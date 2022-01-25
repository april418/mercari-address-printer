import React from 'react'
import { styled } from '@mui/material/styles'
import Badge, { BadgeProps } from '@mui/material/Badge'

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}))

export const renderWithBadge = (children: any, badgeContent: string | number) => {
  return <StyledBadge color="secondary" badgeContent={badgeContent}>{children}</StyledBadge>
}

export default StyledBadge