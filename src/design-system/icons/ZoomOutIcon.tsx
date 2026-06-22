/**
 * Zoom Out Icon
 */

import { createIcon, IconProps } from './Icon';

export const ZoomOutIcon = createIcon(
  'ZoomOutIcon',
  (
    <>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
      <path d="m8 11h6" />
    </>
  )
);

export default ZoomOutIcon;
