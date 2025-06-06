import {Box, ClickAwayListener, Popper, Stack, Typography} from '@mui/material'
import Link from 'next/link'
import {FC, MouseEvent, useState} from 'react'

import {colors} from '@/colors'
import ArrowDown from '@/svg/ArrowDown.svg'

import {Button} from '../Clickable/Button'

export interface DropdownOption {
  id: number
  text: string
  link: string
  selected: boolean
}

export const Dropdown: FC<{title: string; options: DropdownOption[]}> = ({title, options}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl((prev) => (prev ? null : event.currentTarget))
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <Button
        variant="button2"
        onClick={handleClick}
        endElement={
          <Box
            sx={{
              ml: '1rem',
              // roughly aligned with button2 font sizes
              width: {xs: '12px', md: '13px', lg: '16px', xl: '20px'},
            }}
          >
            <ArrowDown />
          </Box>
        }
      >
        {title}
      </Button>
      <Popper open={!!anchorEl} anchorEl={anchorEl} placement="bottom-end">
        <ClickAwayListener onClickAway={handleClose}>
          <Stack
            sx={{
              bgcolor: colors.white,
              border: '5px solid black',
              borderWidth: '5px',
              // random constant to make sure the dropdown is not too long (around 9 options)
              maxHeight: '20rem',
              overflowY: 'auto',
            }}
          >
            {options.map((option) => (
              <Box
                key={option.id}
                component={Link}
                href={option.link}
                onClick={handleClose}
                sx={{
                  bgcolor: colors.white,
                  color: colors.black,
                  padding: '5px',
                  ':hover': {
                    bgcolor: colors.gray,
                  },
                  ...(option.selected && {
                    bgcolor: colors.black,
                    color: colors.white,
                    // ziadny hover feedback na ciernej aktualne vybratej option
                    ':hover': {},
                  }),
                }}
              >
                <Typography variant="button2">{option.text}</Typography>
              </Box>
            ))}
          </Stack>
        </ClickAwayListener>
      </Popper>
    </>
  )
}
