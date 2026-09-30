/**
 * AI Assistance Disclosure
 * Tool: Cursor (GPT-5.6 Sol Medium)
 * Scope: Assisted with frontend implementation, debugging and UI refinement.
 * Author review: The generated code was reviewed, tested, and iteratively refined by the author through follow-up instructions.
 */

import { useEffect, useState } from 'react'
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
import { Link, useParams, useNavigate } from 'react-router-dom'
import type { UserMode } from '../components/AppNavigation'
import {
  DeliveryBagIcon,
  FoodIcon,
  PrinterIcon,
  StudentIcon,
} from '../components/CampusArt'
import SuccessSnackbar from '../components/SuccessSnackbar'
import SupplierInfo from '../components/SupplierInfo'
import type { Supplier } from '../interfaces'
import { deleteSupplier, fetchSupplierById } from '../api/suppliers'

type SupplierDetailPageProps = {
  isAdmin: boolean
  mode: UserMode
}

function SupplierDetailPage({ isAdmin, mode }: SupplierDetailPageProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const navigate = useNavigate()

  const { supplierId } = useParams()
  
  const [supplier, setSupplier] = useState<Supplier | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    if (!supplierId) return
    fetchSupplierById(supplierId)
      .then((data) => {
        setSupplier(data)
        setStatus('ready')
      })
      .catch((error) => {
        console.error(error)
        setStatus('error')
      })
  }, [supplierId])

  function closeDeleteDialog() {
    setIsDeleteDialogOpen(false)
    setDeleteError('')
  }

  async function handleDelete() {
    if (!supplier) return
    try {
      setDeleteError('')
      setIsDeleting(true)
      await deleteSupplier(supplier.id)
      setIsDeleteDialogOpen(false)
      setIsSuccessOpen(true)
    } catch (error) {
      console.error(error)
      setDeleteError('Could not delete supplier. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  if (status === 'loading') {
    return (
      <Container component="main" maxWidth="md" sx={{ py: { xs: 3, md: 6 } }}>
        <Typography color="text.secondary">Loading supplier…</Typography>
      </Container>
    )
  }

  if (status === 'error') {
    return (
      <Container component="main" maxWidth="md" sx={{ py: { xs: 3, md: 6 } }}>
        <Stack spacing={2}>
          <Typography component="h1" variant="h4">
            Couldn&apos;t load supplier
          </Typography>
          <Button component={Link} to="/suppliers" variant="outlined">
            Back
          </Button>
        </Stack>
      </Container>
    )
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

  const isFood = supplier.type.includes('Food')

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
                color: isFood ? 'secondary.dark' : 'primary.dark',
                bgcolor: isFood ? 'secondary.light' : 'primary.light',
              }}
            >
              {isFood ? (
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
              color={isFood ? 'secondary' : 'primary'}
              variant="outlined"
              sx={{ alignSelf: 'flex-start' }}
            />
            <SupplierInfo
              location={`${supplier.building}, Level ${supplier.floor}`}
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
          onClose={closeDeleteDialog}
          //onClose={() => setIsDeleteDialogOpen(false)}
        >
          <DialogTitle>Delete {supplier.name}?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this supplier?
            </DialogContentText>
            {deleteError && (
            <DialogContentText color="error" sx={{ mt: 1 }}>
              {deleteError}
            </DialogContentText>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDeleteDialog}>Cancel</Button>
            <Button color="error" variant="contained" onClick={handleDelete} disabled={isDeleting}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <SuccessSnackbar
        open={isSuccessOpen}
        message="Supplier deleted successfully (UI preview)."
        onClose={() => {
          setIsSuccessOpen(false)
          navigate('/suppliers')
        }}
      />
    </Container>
  )
}

export default SupplierDetailPage
