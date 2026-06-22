/**
 * Help Circle Icon
 */

import { createIcon, IconProps } from './Icon';

export const HelpCircleIcon = createIcon(
  'HelpCircleIcon',
  (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <circle cx="12" cy="17" r="1" />
    </>
  )
);

export default HelpCircleIcon;
