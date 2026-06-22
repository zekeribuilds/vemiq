/**
 * Clock Icon
 */

import { createIcon, IconProps } from './Icon';

export const ClockIcon = createIcon(
  'ClockIcon',
  (
    <>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </>
  )
);

export default ClockIcon;
