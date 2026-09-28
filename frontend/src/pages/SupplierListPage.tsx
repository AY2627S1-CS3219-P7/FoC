/**
 * AI Assistance Disclosure
 * Tool: Cursor (GPT-5.6 Sol Medium)
 * Scope: Assisted with frontend implementation, debugging and UI refinement.
 * Author review: The generated code was reviewed, tested, and iteratively refined by the author through follow-up instructions.
 */

import { useState } from 'react'
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Link } from 'react-router-dom'
import { CampusBuildingIcon, IconBadge } from '../components/CampusArt'
import SupplierCard from '../components/SupplierCard'
import SupplierListStatus from '../components/SupplierListStatus'

// Temporary frontend-only data used while developing the page.
// Shared with the supplier detail and edit pages while this stays frontend-only data.
// eslint-disable-next-line react-refresh/only-export-components
export const sampleSuppliers = [
  {
    id: 1,
    name: 'Cool Spot',
    type: 'Food',
    location: 'COM2',
    operatingHours: 'Daily 7:30am - 7:30pm',
  },
  {
    id: 2,
    name: 'Techno Edge',
    type: 'Food',
    location: 'Engineering',
    operatingHours: 'Daily 8am - 8pm',
  },
  {
    id: 3,
    name: 'PC Commons Printer',
    type: 'Printing',
    location: 'COM1',
  },
  {
    id: 4,
    name: 'Terrace Food Court',
    type: 'Food',
    location: 'Engineering',
    operatingHours: 'Daily 8am - 8pm',
  },
  {
    id: 5,
    name: 'Spinelli Coffee',
    type: 'Food',
    location: 'COM1',
    operatingHours: 'Daily 8am - 6pm',
  },
  {
    id: 6,
    name: 'Fine Food',
    type: 'Food',
    location: 'UTown',
    operatingHours: 'Daily 7am - 10pm',
  },
  {
    id: 7,
    name: 'COM3 Print Hub',
    type: 'Printing',
    location: 'COM3',
    operatingHours: 'Weekdays 9am - 6pm',
  },
  {
    id: 8,
    name: 'Engineering Plotter Room',
    type: 'Printing',
    location: 'Engineering',
    operatingHours: 'Weekdays 9am - 6pm',
  },
  {
    id: 9,
    name: 'Central Library Printers',
    type: 'Printing',
    location: 'Central Library',
  },
  {
    id: 10,
    name: 'Cheers',
    type: 'Convenience',
    location: 'COM2',
    operatingHours: 'Daily 8am - 10pm',
  },
  {
    id: 11,
    name: 'FairPrice Xpress',
    type: 'Convenience',
    location: 'UTown',
    operatingHours: 'Daily 8am - 10pm',
  },
  {
    id: 12,
    name: 'Campus Services Desk',
    type: 'Services',
    location: 'COM1',
    operatingHours: 'Weekdays 9am - 5pm',
  },
]

const itemsPerPage = 6

type SupplierListPageProps = {
  isAdmin: boolean
}

type SupplierListPreviewState = 'ready' | 'loading' | 'empty' | 'error'

function SupplierListPage({ isAdmin }: SupplierListPageProps) {
  // Change 'ready' to 'loading', 'empty', or 'error' to preview each list state.
  // TODO: Replace this preview state with results from the Supplier Service.
  const [listPreviewState] = useState<SupplierListPreviewState>('ready')

  const [searchText, setSearchText] = useState('')
  const [selectedType, setSelectedType] = useState('All')
  const [selectedSort, setSelectedSort] = useState('name-asc')
  const [page, setPage] = useState(1)

  const supplierRecords =
    listPreviewState === 'empty' ? [] : sampleSuppliers

  const normalizedSearch = searchText.toLowerCase()
  const filteredSuppliers = supplierRecords.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(normalizedSearch) ||
      supplier.type.toLowerCase().includes(normalizedSearch) ||
      supplier.location.toLowerCase().includes(normalizedSearch)

    const matchesType =
      selectedType === 'All' || supplier.type === selectedType

    return matchesSearch && matchesType
  })

  const sortedSuppliers = [...filteredSuppliers].sort((first, second) => {
    if (selectedSort === 'name-desc') {
      return second.name.localeCompare(first.name)
    }

    return first.name.localeCompare(second.name)
  })

  const pageCount = Math.ceil(sortedSuppliers.length / itemsPerPage)
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedSuppliers = sortedSuppliers.slice(startIndex, endIndex)

  return (
    // xs applies on small screens, while md applies on medium screens and larger.
    <Container component="main" maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
      <Stack spacing={{ xs: 2, md: 3 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{
            alignItems: { sm: 'center' },
            justifyContent: 'space-between',
          }}
        >
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <IconBadge tone="blue">
              <CampusBuildingIcon />
            </IconBadge>
            <Box>
              <Typography component="h1" variant="h4">
                Suppliers
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 0.25 }}>
                Food, printing, and everyday campus services.
              </Typography>
            </Box>
          </Stack>
          {isAdmin && (
            <Button
              component={Link}
              to="/suppliers/new"
              variant="contained"
              sx={{ alignSelf: { xs: 'flex-start', sm: 'auto' } }}
            >
              Add Supplier
            </Button>
          )}
        </Stack>

        <Paper
          variant="outlined"
          sx={{
            p: { xs: 2, md: 2.5 },
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Stack spacing={2}>
            <TextField
              fullWidth
              placeholder="Search suppliers"
              value={searchText}
              onChange={(event) => {
                setSearchText(event.target.value)
                setPage(1)
              }}
              slotProps={{ htmlInput: { 'aria-label': 'Search suppliers' } }}
              sx={{ maxWidth: 560 }}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <FormControl fullWidth sx={{ maxWidth: 260 }}>
                <InputLabel id="supplier-type-label">Supplier type</InputLabel>
                <Select
                  labelId="supplier-type-label"
                  value={selectedType}
                  label="Supplier type"
                  onChange={(event) => {
                    setSelectedType(event.target.value)
                    setPage(1)
                  }}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Food">Food</MenuItem>
                  <MenuItem value="Printing">Printing</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ maxWidth: 260 }}>
                <InputLabel id="supplier-sort-label">Sort by</InputLabel>
                <Select
                  labelId="supplier-sort-label"
                  value={selectedSort}
                  label="Sort by"
                  onChange={(event) => setSelectedSort(event.target.value)}
                >
                  <MenuItem value="name-asc">Name A-Z</MenuItem>
                  <MenuItem value="name-desc">Name Z-A</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Stack>
        </Paper>

        <Box aria-label="Supplier results">
          {listPreviewState === 'ready' && sortedSuppliers.length > 0 && (
            <Typography color="text.secondary" sx={{ mb: 1.5 }}>
              Showing {paginatedSuppliers.length} of {sortedSuppliers.length}{' '}
              supplier{sortedSuppliers.length === 1 ? '' : 's'}
            </Typography>
          )}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(2, minmax(0, 1fr))',
                lg: 'repeat(3, minmax(0, 1fr))',
              },
              gap: { xs: 2, md: 3 },
            }}
          >
            {listPreviewState === 'loading' ? (
              <Box sx={{ gridColumn: '1 / -1' }}>
                <SupplierListStatus status="loading" />
              </Box>
            ) : listPreviewState === 'error' ? (
              <Box sx={{ gridColumn: '1 / -1' }}>
                <SupplierListStatus status="error" />
              </Box>
            ) : supplierRecords.length === 0 ? (
              <Box sx={{ gridColumn: '1 / -1' }}>
                <SupplierListStatus status="empty" />
              </Box>
            ) : sortedSuppliers.length > 0 ? (
              paginatedSuppliers.map((supplier) => (
                <SupplierCard
                  key={supplier.id}
                  id={supplier.id}
                  name={supplier.name}
                  type={supplier.type}
                  location={supplier.location}
                  operatingHours={supplier.operatingHours}
                />
              ))
            ) : (
              <Box sx={{ gridColumn: '1 / -1' }}>
                <SupplierListStatus status="no-results" />
              </Box>
            )}
          </Box>

          {listPreviewState === 'ready' && pageCount > 0 && (
            <Pagination
              count={pageCount}
              page={page}
              onChange={(_, newPage) => setPage(newPage)}
              color="primary"
              sx={{ mt: 3 }}
            />
          )}
        </Box>
      </Stack>
    </Container>
  )
}

export default SupplierListPage
