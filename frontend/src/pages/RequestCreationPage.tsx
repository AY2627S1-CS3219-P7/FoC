/**
 * AI Assistance Disclosure
 * Tool: Cursor (GPT-5.6 Sol Medium)
 * Scope: Assisted with frontend implementation, debugging and UI refinement.
 * Author review: The generated code was reviewed, tested, and iteratively refined by the author through follow-up instructions.
 */

import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import type { UserMode } from '../components/AppNavigation'
import { sampleSuppliers } from './SupplierListPage'

type RequestCreationPageProps = {
  mode: UserMode
}

function RequestCreationPage({ mode }: RequestCreationPageProps) {
  const [searchParams] = useSearchParams()
  const supplierId = Number(searchParams.get('supplierId'))
  const supplier = sampleSuppliers.find((item) => item.id === supplierId)

  if (mode !== 'requester') {
    return <Navigate to="/home" replace />
  }

  if (!supplier) {
    return (
      <Container component="main" maxWidth="sm" sx={{ py: { xs: 3, md: 6 } }}>
        <Stack spacing={2}>
          <Typography component="h1" variant="h4">
            Supplier not found
          </Typography>
          <Typography color="text.secondary">
            Choose a supplier before starting a request.
          </Typography>
          <Button component={Link} to="/suppliers" variant="outlined" sx={{ alignSelf: 'flex-start' }}>
            Back to suppliers
          </Button>
        </Stack>
      </Container>
    )
  }

  const pickupLocation = `${supplier.name}, ${supplier.location}`

  return (
    <Container component="main" maxWidth="sm" sx={{ py: { xs: 3, md: 6 } }}>
      <Stack spacing={3}>
        <Box>
          <Typography component="h1" variant="h4">
            Create Request
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Pickup will be at {supplier.name}.
          </Typography>
        </Box>

        <Alert severity="info">
          Request creation is pending Order Service integration. Nothing on this page is submitted.
        </Alert>

        <Paper
          variant="outlined"
          sx={{
            p: { xs: 2.5, md: 3.5 },
            borderColor: 'divider',
            boxShadow: '0 8px 24px rgba(23, 35, 45, 0.05)',
          }}
        >
          <Stack spacing={2.5}>
            <TextField
              label="Pickup location"
              value={pickupLocation}
              fullWidth
              slotProps={{ input: { readOnly: true } }}
              helperText="Prefilled from the selected supplier."
            />
            <TextField
              label="Item description"
              placeholder="What should the courier collect?"
              fullWidth
              multiline
              minRows={3}
            />
            <TextField
              label="Delivery location"
              placeholder="Where should it be delivered?"
              fullWidth
            />
            <TextField
              label="Credit amount offered"
              placeholder="0"
              type="number"
              fullWidth
              slotProps={{ htmlInput: { min: 0 } }}
            />
            <TextField
              label="Acceptance deadline"
              type="datetime-local"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Stack>
        </Paper>

        <Button component={Link} to={`/suppliers/${supplier.id}`} variant="outlined" sx={{ alignSelf: 'flex-start' }}>
          Back to supplier
        </Button>
      </Stack>
    </Container>
  )
}

export default RequestCreationPage
