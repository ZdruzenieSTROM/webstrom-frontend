import clsx from 'clsx'
import Link from 'next/link'
import {FC, MouseEvent, useState} from 'react'

import styles from './Dropdown.module.scss'

export interface DropdownOption {
  id: number
  text: string
  link: string
}

export const Dropdown: FC<{title: string; selectedId: number; options: DropdownOption[]}> = ({
  title,
  selectedId,
  options,
}) => {
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
      {title} <div className={styles.arrow} />
      <div className={clsx(styles.options, display && styles.displayOptions)}>
        {options.map((option) => {
          return (
            <Link
              href={option.link}
              key={option.id}
              className={clsx(styles.option, selectedId === option.id && styles.selectedOption)}
            >
              {option.text}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
