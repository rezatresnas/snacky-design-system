import { UploadButton, SnackyIcons } from '@snacky/ui';

export function Default() {
  return <UploadButton icon={<SnackyIcons.outline.camera />} ariaLabel="Upload product photo" />;
}

export function CustomLabel() {
  return <UploadButton icon={<SnackyIcons.outline.camera />} ariaLabel="Upload profile picture" />;
}

export function Disabled() {
  return <UploadButton icon={<SnackyIcons.outline.camera />} ariaLabel="Upload product photo" disabled />;
}
