import {FilterList as FilterListIcon} from '@mui/icons-material'
import {Button, Card, CardContent, Stack} from '@mui/material'
import {FC, PropsWithChildren, useState} from 'react'
import {FilterLiveSearch} from 'react-admin'

export const FilterSidebar: FC<PropsWithChildren> = ({children}) => {
  const [filterOpen, setFilterOpen] = useState(false)
  const toggleFilter = () => setFilterOpen((prev) => !prev)

  return (
    <Stack
      sx={{
        order: -1,
        position: 'relative',
        overflow: 'visible',
      }}
    >
      <Button onClick={toggleFilter} sx={{mt: 0.5, position: 'absolute', width: 'max-content', gap: 1}}>
        <FilterListIcon />
        Filters
      </Button>

      <Card sx={{mt: 8, mr: filterOpen ? 2 : 0, width: filterOpen ? 200 : 0, transition: 'width 0.2s'}}>
        <CardContent>
          <FilterLiveSearch />
          {children}
        </CardContent>
      </Card>
    </Stack>
  )
}
