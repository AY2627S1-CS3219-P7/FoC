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
import { Link } from 'react-router-dom'
import SuccessSnackbar from '../components/SuccessSnackbar'

function CreateSupplierPage() {
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)

  const [formValues, setFormValues] = useState({
    supplierName: '',
    type: '',
    location: '',
    operatingHours: '',
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

    // TODO: Send the validated form to the team's existing Supplier Service.
    setIsSuccessOpen(true)
  }

  return (
    <Container component="main" maxWidth="sm" sx={{ py: { xs: 3, md: 6 } }}>
      <Stack spacing={3}>
        <Box>
          <Typography component="h1" variant="h4">
            Create Supplier
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Add a campus service provider to the directory.
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
                <InputLabel id="create-supplier-type-label">Type</InputLabel>
                <Select
                  labelId="create-supplier-type-label"
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
                  Create Supplier
                </Button>
                <Button component={Link} to="/suppliers" variant="outlined">
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </form>
      </Stack>

      <SuccessSnackbar
        open={isSuccessOpen}
        message="Supplier created successfully (UI preview)."
        onClose={() => setIsSuccessOpen(false)}
      />
    </Container>
  )
}

export default CreateSupplierPage
