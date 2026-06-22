/**
 * Department Icon
 */

import { createIcon, IconProps } from './Icon';

export const DepartmentIcon = createIcon(
  'DepartmentIcon',
  (
    <>
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </>
  )
);

export default DepartmentIcon;
