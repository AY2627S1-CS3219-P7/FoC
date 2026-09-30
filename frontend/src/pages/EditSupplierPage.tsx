/**
 * AI Assistance Disclosure
 * Tool: Cursor (GPT-5.6 Sol Medium)
 * Scope: Assisted with frontend implementation, debugging and UI refinement.
 * Author review: The generated code was reviewed, tested, and iteratively refined by the author through follow-up instructions.
 */

import { useState, useEffect, type FormEvent } from 'react'
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
import type { Supplier } from '../interfaces'
import { updateSupplier , fetchSupplierById } from '../api/suppliers'

function EditSupplierPage() {
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const { supplierId } = useParams()

  const [supplier, setSupplier] = useState<Supplier | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  // default initial values for when supplier still null
  const [formValues, setFormValues] = useState({
    supplierName: '',
    type: '',
    building: '',
    floor: '',
    locationDescription: '',
    startingTime: '',
    closingTime: '',
    latitude: '',
    longitude: ''
  })

  const [errors, setErrors] = useState({
    supplierName: false,
    type: false,
    building: false,
    startingTime: false,
    closingTime: false,
    latitude: false,
    longitude: false
  })
  
  useEffect(() => {
    if (!supplierId) return
    fetchSupplierById(supplierId)
      .then((data) => {
        setSupplier(data)

        // Populate the form with fetched supplier data
        if (data) {
          setFormValues({
            supplierName: data.name,
            type: data.type,
            building: data.building,
            floor: data.floor,
            locationDescription: data.location_description,
            startingTime: data.starting_time.slice(0, 5), // remove seconds
            closingTime: data.closing_time.slice(0, 5),
            latitude: String(data.latitude),
            longitude: String(data.longitude)
          })
        }
        // console.log(data)
        setStatus('ready')
      })
      .catch((error) => {
        console.error(error)
        setStatus('error')
      })
  }, [supplierId])


  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!supplier) return

    const newErrors = {
      supplierName: formValues.supplierName.trim() === '',
      type: formValues.type === '',
      building: formValues.building.trim() === '',
      startingTime: formValues.startingTime === '',
      closingTime: formValues.closingTime === '',
      latitude: formValues.latitude.trim() === '' || Number.isNaN(Number(formValues.latitude)),
      longitude: formValues.longitude.trim() === '' || Number.isNaN(Number(formValues.longitude))
    }

    setErrors(newErrors)

    if (Object.values(newErrors).some((hasError) => hasError)) {
      return
    }

    // Send the validated updates to the team's existing Supplier Service API.

    try {
      setSubmitError("")
      await updateSupplier(supplier.id, {
        name: formValues.supplierName.trim(),
        type: formValues.type,
        building: formValues.building.trim(),
        floor: formValues.floor.trim(),
        location_description: formValues.locationDescription.trim(),
        starting_time: `${formValues.startingTime}:00`, // format in db is "HH:MM:SS"
        closing_time: `${formValues.closingTime}:00`,
        latitude: Number(formValues.latitude),
        longitude: Number(formValues.longitude)
      })
      setIsSuccessOpen(true)
    } catch (error) {
      console.error(error)
      setSubmitError("Uh oh, we could not save your changes. Please try again.")
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
                  <MenuItem value="Food/Coffee">Food/Coffee</MenuItem>
                  <MenuItem value="Printing">Printing</MenuItem>
                  <MenuItem value="Printing">Shopping</MenuItem>
                </Select>
                {errors.type && <FormHelperText>Type is required</FormHelperText>}
              </FormControl>

              <TextField
                required
                label="Building"
                value={formValues.building}
                onChange={(event) =>
                  setFormValues({ ...formValues, building: event.target.value })
                }
                error={errors.building}
                helperText={errors.building ? 'Building is required' : ''}
              />

              <TextField
                label="Floor"
                value={formValues.floor}
                onChange={(event) =>
                  setFormValues({ ...formValues, floor: event.target.value })
                }
              />

              <TextField
                label="Location Description"
                value={formValues.locationDescription}
                onChange={(event) =>
                  setFormValues({ ...formValues, locationDescription: event.target.value })
                }
              />

              <TextField
                required
                fullWidth
                type="time"
                label="Opening Time"
                value={formValues.startingTime}
                onChange={(event) =>
                  setFormValues({ ...formValues, startingTime: event.target.value })
                }
                error={errors.startingTime}
                helperText={errors.startingTime ? 'Opening time is required' : ''}
              />
              <TextField
                required
                fullWidth
                type="time"
                label="Closing Time"
                value={formValues.closingTime}
                onChange={(event) =>
                  setFormValues({ ...formValues, closingTime: event.target.value })
                }
                error={errors.closingTime}
                helperText={errors.closingTime ? 'Closing time is required' : ''}
              />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  label="Latitude"
                  value={formValues.latitude}
                  onChange={(event) =>
                    setFormValues({ ...formValues, latitude: event.target.value })
                  }
                  error={errors.latitude}
                  helperText={errors.latitude ? 'Valid latitude is required' : ''}
                  slotProps={{ htmlInput: { step: 'any' } }}
                />
                <TextField
                  required
                  fullWidth
                  type="number"
                  label="Longitude"
                  value={formValues.longitude}
                  onChange={(event) =>
                    setFormValues({ ...formValues, longitude: event.target.value })
                  }
                  error={errors.longitude}
                  helperText={errors.longitude ? 'Valid longitude is required' : ''}
                  slotProps={{ htmlInput: { step: 'any' } }}
                />
              </Stack>

              {/* <TextField
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
              /> */}

              {submitError && <FormHelperText error>{submitError}</FormHelperText>}

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
        message="Supplier changes saved successfully."
        onClose={() => setIsSuccessOpen(false)}
      />
    </Container>
  )
}

export default EditSupplierPage
