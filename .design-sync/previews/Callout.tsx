import { Callout, SnackyIcons } from '@snacky/ui';

const CheckIcon = <SnackyIcons.outline.sent width={12} height={12} />;
const ClockIcon = <SnackyIcons.outline.unsent width={12} height={12} />;

export function ReceivedMessage() {
  return (
    <div style={{ width: 260 }}>
      <Callout message="Hi, is the order still on its way?" timestamp="10:24" variant="received" />
    </div>
  );
}

export function SentMessage() {
  return (
    <div style={{ width: 260 }}>
      <Callout message="Yes, the driver is about 5 minutes away." timestamp="10:25" variant="sent" statusIcon={CheckIcon} />
    </div>
  );
}

export function PendingMessage() {
  return (
    <div style={{ width: 260 }}>
      <Callout message="Can you leave it at the front desk?" timestamp="10:26" variant="pending" statusIcon={ClockIcon} />
    </div>
  );
}

export function Conversation() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 280 }}>
      <Callout message="Hi, is my order ready for pickup?" timestamp="09:12" variant="received" />
      <Callout message="Almost there, packing it now." timestamp="09:13" variant="sent" statusIcon={CheckIcon} />
      <Callout message="Great, I will be there in 10 minutes." timestamp="09:14" variant="pending" statusIcon={ClockIcon} />
    </div>
  );
}
