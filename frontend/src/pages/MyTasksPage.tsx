/**
 * AI Assistance Disclosure
 * Tool: Cursor (GPT-5.6 Sol Medium)
 * Scope: Assisted with frontend implementation, debugging and UI refinement.
 * Author review: The generated code was reviewed, tested, and iteratively refined by the author through follow-up instructions.
 */

import {
  Box,
  Container,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { CheckTaskIcon, IconBadge } from '../components/CampusArt'

const myTasksProgressSteps = [
  {
    label: 'ACCEPTED',
  },
  {
    label: 'PICKED_UP',
    helperText: 'After delivery, waiting for requester confirmation.',
  },
  {
    label: 'COMPLETED',
  },
]

function MyTasksPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Container component="main" maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
      <Stack spacing={3}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <IconBadge tone="teal">
            <CheckTaskIcon />
          </IconBadge>
          <Stack spacing={0.25}>
            <Typography component="h1" variant="h4">
              My Tasks
            </Typography>
            <Typography color="text.secondary">
              Accepted courier requests will appear here while you are handling
              them.
            </Typography>
          </Stack>
        </Stack>

        <Paper
          variant="outlined"
          sx={{
            p: { xs: 2.5, md: 3 },
            bgcolor: 'background.paper',
            boxShadow: '0 12px 32px rgba(23, 35, 45, 0.06)',
          }}
        >
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Box
              sx={{
                display: 'grid',
                width: 72,
                height: 72,
                flexShrink: 0,
                placeItems: 'center',
                borderRadius: '50%',
                color: 'secondary.dark',
                bgcolor: 'secondary.light',
              }}
            >
              <CheckTaskIcon sx={{ fontSize: 34 }} />
            </Box>
            <Stack spacing={0.25}>
              <Typography variant="h6">Coming soon</Typography>
              <Typography color="text.secondary">
                This feature is under development. Future accepted tasks will
                follow this Order Service progress.
              </Typography>
            </Stack>
          </Stack>

          <Stepper
            activeStep={-1}
            alternativeLabel={!isMobile}
            orientation={isMobile ? 'vertical' : 'horizontal'}
            sx={{
              mt: 3,
              '& .MuiStepLabel-label': {
                fontWeight: 650,
                letterSpacing: '0.02em',
              },
            }}
          >
            {myTasksProgressSteps.map((step) => (
              <Step key={step.label}>
                <StepLabel
                  optional={
                    step.helperText ? (
                      <Typography variant="caption" color="text.secondary">
                        {step.helperText}
                      </Typography>
                    ) : undefined
                  }
                >
                  {step.label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          <Stack spacing={0.75} sx={{ mt: { xs: 2, md: 3 } }}>
            <Typography variant="subtitle2">Other states</Typography>
            <Typography variant="body2" color="text.secondary">
              Cancellation before pickup may move the request to CANCELLED.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Cancellation after PICKED_UP is rejected, so the request remains
              PICKED_UP.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              EXPIRED applies to OPEN requests on Fulfil Requests, so it is not
              part of this My Tasks flow.
            </Typography>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  )
}

export default MyTasksPage
