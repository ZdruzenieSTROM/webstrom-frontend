import {FilterList as FilterListIcon} from '@mui/icons-material'
import {IconButton, Stack} from '@mui/material'
import {FC, PropsWithChildren, useState} from 'react'
import {FilterLiveSearch} from 'react-admin'

export const FilterSidebar: FC<PropsWithChildren> = ({children}) => {
  const [filterOpen, setFilterOpen] = useState(true)
  const toggleFilter = () => setFilterOpen((prev) => !prev)

  return (
    // TODO: fix collapsed state
    <Stack sx={{order: -1, mr: 2, alignItems: 'start'}}>
      <IconButton onClick={toggleFilter} sx={{m: 0.5}}>
        <FilterListIcon />
      </IconButton>

      <Stack
        sx={{
          width: 200,
          color: 'unset',
          bgcolor: 'unset',
          display: filterOpen ? 'block' : 'none',
        }}
      >
        <FilterLiveSearch />
        {children}
      </Stack>
    </Stack>
  )
}
