/**
 * AI Assistance Disclosure
 * Tool: Cursor (GPT-5.6 Sol Medium)
 * Scope: Assisted with frontend implementation, debugging and UI refinement.
 * Author review: The generated code was reviewed, tested, and iteratively refined by the author through follow-up instructions.
 */

import { useState, type FormEvent } from 'react'
import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Link, useParams } from 'react-router-dom'
import SuccessSnackbar from '../components/SuccessSnackbar'
import { sampleSuppliers } from './SupplierListPage'

function EditSupplierPage() {
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)

  const { supplierId } = useParams()
  const supplier = sampleSuppliers.find(
    (item) => item.id === Number(supplierId),
  )

  // The existing supplier values become the form's initial state.
  const [formValues, setFormValues] = useState({
    supplierName: supplier?.name ?? '',
    type: supplier?.type ?? '',
    location: supplier?.location ?? '',
    operatingHours: supplier?.operatingHours ?? '',
  })

  const [errors, setErrors] = useState({
    supplierName: false,
    type: false,
    location: false,
  })

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const newErrors = {
      supplierName: formValues.supplierName.trim() === '',
      type: formValues.type === '',
      location: formValues.location.trim() === '',
    }

    setErrors(newErrors)

    if (Object.values(newErrors).some((hasError) => hasError)) {
      return
    }

    // TODO: Send the validated updates to the team's existing Supplier Service API.
    setIsSuccessOpen(true)
  }

  if (!supplier) {
    return (
      <Container component="main" maxWidth="sm" sx={{ py: { xs: 3, md: 6 } }}>
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
    <Container component="main" maxWidth="sm" sx={{ py: { xs: 3, md: 6 } }}>
      <Stack spacing={3}>
        <Box>
          <Typography component="h1" variant="h4">
            Edit Supplier
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Keep this supplier&apos;s campus information up to date.
          </Typography>
        </Box>

        <form onSubmit={handleSubmit} noValidate>
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 2.5, md: 3.5 },
              borderColor: 'divider',
              boxShadow: '0 8px 24px rgba(23, 35, 45, 0.05)',
            }}
          >
            <Stack spacing={3}>
              <TextField
                required
                label="Supplier Name"
                value={formValues.supplierName}
                onChange={(event) =>
                  setFormValues({
                    ...formValues,
                    supplierName: event.target.value,
                  })
                }
                error={errors.supplierName}
                helperText={
                  errors.supplierName ? 'Supplier name is required' : ''
                }
              />

              <FormControl required error={errors.type}>
                <InputLabel id="edit-supplier-type-label">Type</InputLabel>
                <Select
                  labelId="edit-supplier-type-label"
                  label="Type"
                  value={formValues.type}
                  onChange={(event) =>
                    setFormValues({ ...formValues, type: event.target.value })
                  }
                >
                  <MenuItem value="Food">Food</MenuItem>
                  <MenuItem value="Printing">Printing</MenuItem>
                </Select>
                {errors.type && <FormHelperText>Type is required</FormHelperText>}
              </FormControl>

              <TextField
                required
                label="Location"
                value={formValues.location}
                onChange={(event) =>
                  setFormValues({
                    ...formValues,
                    location: event.target.value,
                  })
                }
                error={errors.location}
                helperText={errors.location ? 'Location is required' : ''}
              />

              <TextField
                label="Operating Hours"
                value={formValues.operatingHours}
                onChange={(event) =>
                  setFormValues({
                    ...formValues,
                    operatingHours: event.target.value,
                  })
                }
              />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button type="submit" variant="contained">
                  Save Changes
                </Button>
                <Button
                  component={Link}
                  to={`/suppliers/${supplier.id}`}
                  variant="outlined"
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </form>
      </Stack>

      <SuccessSnackbar
        open={isSuccessOpen}
        message="Supplier changes saved successfully (UI preview)."
        onClose={() => setIsSuccessOpen(false)}
      />
    </Container>
  )
}

export default EditSupplierPage
