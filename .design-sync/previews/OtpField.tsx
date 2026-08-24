import { useState } from 'react';
import { OtpField } from '@snacky/ui';

function Field(props: Partial<React.ComponentProps<typeof OtpField>> & { initial?: string }) {
  const [value, setValue] = useState(props.initial ?? '');
  return <OtpField {...props} value={props.value ?? value} onChange={props.onChange ?? setValue} />;
}

export function Empty() {
  return <Field initial="" length={6} />;
}

export function PartiallyFilled() {
  return <Field initial="482" length={6} />;
}

export function Filled() {
  return <Field initial="482913" length={6} />;
}

export function FourDigit() {
  return <Field initial="24" length={4} />;
}

export function Disabled() {
  return <Field initial="482913" length={6} disabled />;
}
