import { useState } from 'react';
import { ChatInput, SnackyIcons } from '@snacky/ui';

function Field(props: Partial<React.ComponentProps<typeof ChatInput>> & { initial?: string }) {
  const [value, setValue] = useState(props.initial ?? '');
  return (
    <ChatInput
      {...props}
      value={props.value ?? value}
      onChange={props.onChange ?? setValue}
      onSend={props.onSend ?? (() => {})}
    />
  );
}

export function Empty() {
  return <Field initial="" />;
}

export function Filled() {
  return <Field initial="Is my order still on the way?" sendIcon={<SnackyIcons.outline.send width={18} height={18} />} />;
}

export function CustomPlaceholder() {
  return <Field initial="" placeholder="Ask your driver a question" />;
}

export function Disabled() {
  return <Field initial="" disabled />;
}
