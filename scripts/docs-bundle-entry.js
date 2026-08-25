/**
 * Entry point for the Live Preview browser bundle (scripts/build-docs-bundle.js).
 *
 * React is bundled in rather than pulled from unpkg, so the preview iframe has
 * exactly one React copy and no network dependency. It is re-exposed on
 * `window` because the iframe's own bootstrap and any not-yet-migrated
 * `PG[id].impl` still reference the `React` / `ReactDOM` globals the old
 * UMD script tags used to provide.
 */
import * as React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import * as SnackyUI from '../packages/react-ui/src/index.ts';

window.React = React;
// The preview only ever calls ReactDOM.createRoot.
window.ReactDOM = ReactDOMClient;
window.SnackyUI = SnackyUI;
