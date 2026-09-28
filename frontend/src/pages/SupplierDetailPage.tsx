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
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { Link, useParams } from 'react-router-dom'
import type { UserMode } from '../components/AppNavigation'
import {
  DeliveryBagIcon,
  FoodIcon,
  PrinterIcon,
  StudentIcon,
} from '../components/CampusArt'
import SuccessSnackbar from '../components/SuccessSnackbar'
import SupplierInfo from '../components/SupplierInfo'
import { sampleSuppliers } from './SupplierListPage'

type SupplierDetailPageProps = {
  isAdmin: boolean
  mode: UserMode
}

function SupplierDetailPage({ isAdmin, mode }: SupplierDetailPageProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)

  // Route parameters are strings, so convert the ID to a number before comparing it.
  const { supplierId } = useParams()
  const supplier = sampleSuppliers.find(
    (item) => item.id === Number(supplierId),
  )

  function handleDelete() {
    // TODO: Delete this supplier through the team's existing Supplier Service.
    setIsDeleteDialogOpen(false)
    setIsSuccessOpen(true)
  }

  if (!supplier) {
    return (
      <Container component="main" maxWidth="md" sx={{ py: { xs: 3, md: 6 } }}>
        <Stack spacing={2}>
          <Typography component="h1" variant="h4">
            Supplier not found
          </Typography>
          <Button component={Link} to="/suppliers" variant="outlined">
            Back
          </Button>
        </Stack>
      </Container>
    )
  }

  return (
    <Container component="main" maxWidth="md" sx={{ py: { xs: 3, md: 6 } }}>
      <Stack spacing={3}>
        <Stack direction="row" spacing={2}>
          <Button component={Link} to="/suppliers" variant="outlined">
            Back
          </Button>
          {isAdmin && (
            <>
              <Button
                component={Link}
                to={`/suppliers/${supplier.id}/edit`}
                variant="contained"
              >
                Edit
              </Button>
              <Button
                color="error"
                variant="outlined"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                Delete
              </Button>
            </>
          )}
        </Stack>

        <Paper
          variant="outlined"
          sx={{
            p: { xs: 2.5, md: 3.5 },
            borderColor: 'divider',
            boxShadow: '0 8px 24px rgba(23, 35, 45, 0.06)',
          }}
        >
          <Stack spacing={1.5}>
            <Box
              sx={{
                display: 'grid',
                height: 120,
                placeItems: 'center',
                borderRadius: 3,
                color: supplier.type === 'Food' ? 'secondary.dark' : 'primary.dark',
                bgcolor: supplier.type === 'Food' ? 'secondary.light' : 'primary.light',
              }}
            >
              {supplier.type === 'Food' ? (
                <FoodIcon sx={{ fontSize: 48 }} />
              ) : supplier.type === 'Printing' ? (
                <PrinterIcon sx={{ fontSize: 48 }} />
              ) : supplier.type === 'Services' ? (
                <StudentIcon sx={{ fontSize: 48 }} />
              ) : (
                <DeliveryBagIcon sx={{ fontSize: 48 }} />
              )}
            </Box>
            <Typography component="h1" variant="h4">
              {supplier.name}
            </Typography>
            <Chip
              label={supplier.type}
              size="small"
              color={supplier.type === 'Food' ? 'secondary' : 'primary'}
              variant="outlined"
              sx={{ alignSelf: 'flex-start' }}
            />
            <SupplierInfo
              location={supplier.location}
              operatingHours={supplier.operatingHours}
            />
            {mode === 'requester' && (
              <Button
                component={Link}
                to={`/requests/new?supplierId=${supplier.id}`}
                variant="contained"
                sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' } }}
              >
                Create Request
              </Button>
            )}
          </Stack>
        </Paper>
      </Stack>

      {isAdmin && (
        <Dialog
          open={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
        >
          <DialogTitle>Delete {supplier.name}?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this supplier?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button color="error" variant="contained" onClick={handleDelete}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <SuccessSnackbar
        open={isSuccessOpen}
        message="Supplier deleted successfully (UI preview)."
        onClose={() => setIsSuccessOpen(false)}
      />
    </Container>
  )
}

export default SupplierDetailPage
