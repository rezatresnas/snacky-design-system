import { Header, SnackyIcons } from '@snacky/ui';

export function TitleOnly() {
  return <Header title="Snacky" />;
}

export function WithBack() {
  return <Header title="Product details" leadingIcon="back" onLeadingClick={() => {}} />;
}

export function WithCloseAndAction() {
  return (
    <Header
      title="Filter products"
      leadingIcon="close"
      onLeadingClick={() => {}}
      trailingIcon={<SnackyIcons.outline.trash width={24} height={24} />}
      onTrailingClick={() => {}}
    />
  );
}

export function CheckoutFlow() {
  return <Header title="Checkout" leadingIcon="back" onLeadingClick={() => {}} />;
}
