/**
 * Credit Card Icon
 */

import { createIcon, IconProps } from './Icon';

export const CreditCardIcon = createIcon(
  'CreditCardIcon',
  (
    <>
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </>
  )
);

export default CreditCardIcon;
