import { styled } from '@nextui-org/react';

export const StyledBadge = styled('span', {
  display: 'inline-block',
  textTransform: 'uppercase',
  padding: '$4 $5',
  margin: ' 2px',
  fontSize: '12px',
  fontWeight: '$bold',
  borderRadius: '14px',
  letterSpacing: '0.6px',
  lineHeight: 1,
  boxShadow: '1px 2px 5px 0px rgb(0 0 0 / 5%)',
  alignItems: 'center',
  alignSelf: 'center',
  color: '$white',
  variants: {
    type: {
      active: {
        bg: '$successLight',
        color: '$successLightContrast'
      },
      paused: {
        bg: '$errorLight',
        color: '$errorLightContrast'
      },
      vacation: {
        bg: '$warningLight',
        color: '$warningLightContrast'
      }
    }
  },
  defaultVariants: {
    type: 'active'
  }
});
