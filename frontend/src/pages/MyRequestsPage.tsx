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
import type { UserMode } from '../components/AppNavigation'
import { ClipboardIcon, DeliveryBagIcon, IconBadge } from '../components/CampusArt'

type MyRequestsPageProps = {
  mode: UserMode
}

const requesterProgressSteps = [
  {
    label: 'OPEN',
    helperText: 'Waiting for a courier to accept.',
  },
  {
    label: 'ACCEPTED',
    helperText: 'A courier has accepted the request.',
  },
  {
    label: 'PICKED_UP',
    helperText: 'The courier has collected the item.',
  },
  {
    label: 'COMPLETED',
    helperText: 'Delivery confirmed by the requester.',
  },
]

function MyRequestsPage({ mode }: MyRequestsPageProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isCourier = mode === 'courier'
  const requestTitle = isCourier ? 'Fulfil Requests' : 'My Requests'
  const requestDescription = isCourier
    ? 'See campus errand requests that are waiting to be fulfilled.'
    : 'Track your campus errand requests in one place.'

  return (
    <Container component="main" maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
      <Stack spacing={3}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <IconBadge tone={isCourier ? 'teal' : 'blue'}>
            {isCourier ? <DeliveryBagIcon /> : <ClipboardIcon />}
          </IconBadge>
          <Stack spacing={0.25}>
            <Typography component="h1" variant="h4">
              {requestTitle}
            </Typography>
            <Typography color="text.secondary">{requestDescription}</Typography>
          </Stack>
        </Stack>
        <Paper
          variant="outlined"
          sx={{
            p: { xs: 2.5, md: 3.5 },
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
                color: isCourier ? 'secondary.dark' : 'primary.dark',
                bgcolor: isCourier ? 'secondary.light' : 'primary.light',
              }}
            >
              {isCourier ? <DeliveryBagIcon sx={{ fontSize: 34 }} /> : <ClipboardIcon sx={{ fontSize: 34 }} />}
            </Box>
            <Stack spacing={0.25}>
              <Typography variant="h6">Coming soon</Typography>
              <Typography color="text.secondary">
                This feature is under development.
              </Typography>
            </Stack>
          </Stack>

          {!isCourier && (
            <>
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
                {requesterProgressSteps.map((step) => (
                  <Step key={step.label}>
                    <StepLabel
                      optional={
                        <Typography variant="caption" color="text.secondary">
                          {step.helperText}
                        </Typography>
                      }
                    >
                      {step.label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>

              <Paper
                variant="outlined"
                sx={{
                  mt: { xs: 2, md: 3 },
                  p: 1.5,
                  bgcolor: 'primary.light',
                  borderColor: 'transparent',
                }}
              >
                <Typography color="text.secondary">
                  A request may also become CANCELLED or EXPIRED.
                </Typography>
              </Paper>
            </>
          )}
        </Paper>
      </Stack>
    </Container>
  )
}

export default MyRequestsPage
