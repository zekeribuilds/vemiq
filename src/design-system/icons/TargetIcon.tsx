/**
 * Target Icon
 */

import { createIcon, IconProps } from './Icon';

export const TargetIcon = createIcon(
  'TargetIcon',
  (
    <>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </>
  )
);

export default TargetIcon;
