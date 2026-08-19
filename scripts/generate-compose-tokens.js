#!/usr/bin/env node
// Generates packages/compose-ui/src/commonMain/kotlin/com/snacky/ui/theme/Tokens.kt
// from tokens.json. Every value is fully resolved (no Kotlin-to-Kotlin references),
// matching the same flattening approach scripts/generate-react-tokens.js uses for
// tokens.css.
//
// Run after any change to tokens.json (i.e. after scripts/generate-agent-files.js):
//   node scripts/generate-compose-tokens.js

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const tokens = JSON.parse(fs.readFileSync(path.join(ROOT, 'tokens.json'), 'utf8'));
const OUT_DIR = path.join(ROOT, 'packages/compose-ui/src/commonMain/kotlin/com/snacky/ui/theme');

function resolveRef(value, root) {
  if (typeof value !== 'string') return value;
  const m = /^\{([^}]+)\}$/.exec(value);
  if (!m) return value;
  const parts = m[1].split('.');
  let node = root;
  for (const p of parts) node = node[p];
  return resolveRef(node.$value, root);
}

function pascal(s) {
  return s.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());
}

function camel(s) {
  const p = pascal(s);
  return p.charAt(0).toLowerCase() + p.slice(1);
}

function colorToKotlin(value) {
  const hex = /^#([0-9a-fA-F]{6})$/.exec(value);
  if (hex) return `Color(0xFF${hex[1].toUpperCase()})`;
  const rgba = /^rgba\((\d+),(\d+),(\d+),([\d.]+)\)$/.exec(value);
  if (rgba) {
    const [, r, g, b, a] = rgba;
    const channel = (n) => (n === '0' ? '0f' : `${n}f / 255f`);
    return `Color(red = ${channel(r)}, green = ${channel(g)}, blue = ${channel(b)}, alpha = ${a}f)`;
  }
  throw new Error(`Unhandled color value: ${value}`);
}

function dp(value) {
  const n = /^(-?\d+(?:\.\d+)?)px$/.exec(value);
  if (!n) throw new Error(`Unhandled dimension value: ${value}`);
  return `${n[1]}.dp`;
}

function sp(value) {
  const n = /^(-?\d+(?:\.\d+)?)px$/.exec(value);
  if (!n) throw new Error(`Unhandled font size/line height value: ${value}`);
  return `${n[1]}.sp`;
}

function letterSpacing(value) {
  if (value === '0') return '0.sp';
  const n = /^(-?\d+(?:\.\d+)?)em$/.exec(value);
  if (!n) throw new Error(`Unhandled letter spacing value: ${value}`);
  return `${n[1]}.em`;
}

function fontWeight(w) {
  if (w === 400) return 'FontWeight.Normal';
  if (w === 600) return 'FontWeight.SemiBold';
  if (w === 700) return 'FontWeight.Bold';
  return `FontWeight(${w})`;
}

function shadowToKotlin(value) {
  const m = /^(-?\d+)(?:px)? (-?\d+)(?:px)? (-?\d+)(?:px)? (rgba?\([^)]+\))$/.exec(value);
  if (!m) throw new Error(`Unhandled shadow value: ${value}`);
  const [, x, y, blur, color] = m;
  return `SnackyShadowToken(offsetX = ${x}.dp, offsetY = ${y}.dp, blurRadius = ${blur}.dp, color = ${colorToKotlin(color.replace(/\s/g, ''))})`;
}

const L = [];
const indent = (n) => '    '.repeat(n);

L.push('// Generated from tokens.json by scripts/generate-compose-tokens.js - do not hand-edit.');
L.push('package com.snacky.ui.theme');
L.push('');
L.push('import androidx.compose.ui.graphics.Color');
L.push('import androidx.compose.ui.text.font.FontWeight');
L.push('import androidx.compose.ui.unit.Dp');
L.push('import androidx.compose.ui.unit.TextUnit');
L.push('import androidx.compose.ui.unit.dp');
L.push('import androidx.compose.ui.unit.em');
L.push('import androidx.compose.ui.unit.sp');
L.push('');

// --- Color -------------------------------------------------------------

L.push('/** Raw color ramps. Rarely used directly, prefer [SnackyColor]. */');
L.push('object SnackyColorPrimitive {');
for (const [ramp, steps] of Object.entries(tokens.color.primitive)) {
  L.push(`${indent(1)}object ${pascal(ramp)} {`);
  for (const [step, node] of Object.entries(steps)) {
    L.push(`${indent(2)}val c${step} = ${colorToKotlin(node.$value)}`);
  }
  L.push(`${indent(1)}}`);
}
L.push('}');
L.push('');

L.push('/** Semantic colors, what components should bind to. */');
L.push('object SnackyColor {');
for (const group of Object.values(tokens.color.semantic)) {
  for (const [name, node] of Object.entries(group)) {
    L.push(`${indent(1)}val ${camel(name)} = ${colorToKotlin(resolveRef(node.$value, tokens))}`);
  }
}
L.push('}');
L.push('');

// --- Spacing / gap / layout / margin -----------------------------------

L.push('object SnackySpacingPrimitive {');
for (const [step, node] of Object.entries(tokens.spacing.primitive)) {
  L.push(`${indent(1)}val space${step} = ${dp(node.$value)}`);
}
L.push('}');
L.push('');

L.push('object SnackyGap {');
for (const [name, node] of Object.entries(tokens.spacing.gap)) {
  L.push(`${indent(1)}val ${camel(name)} = ${dp(resolveRef(node.$value, tokens))}`);
}
L.push('}');
L.push('');

L.push('object SnackyLayout {');
for (const [name, node] of Object.entries(tokens.spacing.layout)) {
  L.push(`${indent(1)}val ${camel(name)} = ${dp(resolveRef(node.$value, tokens))}`);
}
L.push('}');
L.push('');

L.push('object SnackyMargin {');
for (const [name, node] of Object.entries(tokens.spacing.margin)) {
  L.push(`${indent(1)}val ${camel(name)} = ${dp(resolveRef(node.$value, tokens))}`);
}
L.push('}');
L.push('');

// --- Radius --------------------------------------------------------------

L.push('object SnackyRadiusPrimitive {');
for (const [step, node] of Object.entries(tokens.radius.primitive)) {
  L.push(`${indent(1)}val radius${step} = ${dp(node.$value)}`);
}
L.push('}');
L.push('');

L.push('object SnackyRadius {');
for (const [name, node] of Object.entries(tokens.radius.semantic)) {
  L.push(`${indent(1)}val ${camel(name)} = ${dp(resolveRef(node.$value, tokens))}`);
}
L.push('}');
L.push('');

// --- Size ------------------------------------------------------------------

L.push('object SnackySize {');
for (const [cat, sizes] of Object.entries(tokens.size)) {
  L.push(`${indent(1)}object ${pascal(cat)} {`);
  for (const [name, node] of Object.entries(sizes)) {
    L.push(`${indent(2)}val ${camel(name)} = ${dp(node.$value)}`);
  }
  L.push(`${indent(1)}}`);
}
L.push('}');
L.push('');

// --- Shadow ------------------------------------------------------------

L.push('/**');
L.push(' * Compose Multiplatform has no direct box-shadow primitive, so this is a raw');
L.push(' * value carrier (offset/blur/color), not a ready-to-apply Modifier. Map it onto');
L.push(' * the platform shadow API you are using (e.g. Modifier.shadow on Android).');
L.push(' */');
L.push('data class SnackyShadowToken(');
L.push(`${indent(1)}val offsetX: Dp,`);
L.push(`${indent(1)}val offsetY: Dp,`);
L.push(`${indent(1)}val blurRadius: Dp,`);
L.push(`${indent(1)}val color: Color,`);
L.push(')');
L.push('');
L.push('object SnackyShadow {');
for (const [name, node] of Object.entries(tokens.shadow)) {
  L.push(`${indent(1)}val ${camel(name)} = ${shadowToKotlin(node.$value)}`);
}
L.push('}');
L.push('');

// --- Typography ----------------------------------------------------------

L.push('/**');
L.push(' * Raw type-scale values, not a Compose TextStyle. This package ships no font');
L.push(' * resource (Poppins), so build the TextStyle with a FontFamily you supply:');
L.push(' * `TextStyle(fontFamily = poppins, fontSize = SnackyTypography.H1.bold.fontSize, ...)`.');
L.push(' */');
L.push('data class SnackyTypographyToken(');
L.push(`${indent(1)}val fontSize: TextUnit,`);
L.push(`${indent(1)}val fontWeight: FontWeight,`);
L.push(`${indent(1)}val lineHeight: TextUnit,`);
L.push(`${indent(1)}val letterSpacing: TextUnit,`);
L.push(')');
L.push('');
L.push('object SnackyTypography {');
for (const [group, variants] of Object.entries(tokens.typography)) {
  L.push(`${indent(1)}object ${pascal(group)} {`);
  for (const [variant, node] of Object.entries(variants)) {
    const v = node.$value;
    L.push(
      `${indent(2)}val ${camel(variant)} = SnackyTypographyToken(fontSize = ${sp(v.fontSize)}, fontWeight = ${fontWeight(v.fontWeight)}, lineHeight = ${sp(v.lineHeight)}, letterSpacing = ${letterSpacing(v.letterSpacing)})`
    );
  }
  L.push(`${indent(1)}}`);
}
L.push('}');
L.push('');

fs.writeFileSync(path.join(OUT_DIR, 'Tokens.kt'), L.join('\n'), 'utf8');

console.log('Wrote packages/compose-ui/src/commonMain/kotlin/com/snacky/ui/theme/Tokens.kt');
