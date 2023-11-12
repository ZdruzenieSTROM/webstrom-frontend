import {Typography} from '@mui/material'
import clsx from 'clsx'
import Link from 'next/link'
import {FC, MouseEvent, useState} from 'react'

import styles from './Dropdown.module.scss'

export interface DropdownOption {
  id: number
  text: string
  link: string
  selected: boolean
}

export const Dropdown: FC<{title: string; options: DropdownOption[]}> = ({title, options}) => {
  const [display, setDisplay] = useState(false)

  const handleClick = (event: MouseEvent) => {
    event.preventDefault()
    setDisplay((prevDisplay) => !prevDisplay)
  }

  const handleMouseLeave = () => {
    setDisplay(false)
  }

  return (
    <div className={styles.dropdown} onClick={handleClick} onMouseLeave={handleMouseLeave}>
      <Typography variant="button2">
        {title}
        <div className={styles.arrow} />
      </Typography>
      <div className={clsx(styles.options, display && styles.displayOptions)}>
        {options.map((option) => {
          return (
            <Link
              href={option.link}
              key={option.id}
              className={clsx(styles.option, option.selected && styles.selectedOption)}
            >
              <Typography variant="button2">{option.text}</Typography>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
