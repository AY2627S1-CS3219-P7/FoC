/**
 * AI Assistance Disclosure
 * Tool: Cursor (GPT-5.6 Sol Medium)
 * Scope: Assisted with frontend implementation, debugging and UI refinement.
 * Author review: The generated code was reviewed, tested, and iteratively refined by the author through follow-up instructions.
 */

import {
  Alert,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Container,
  Stack,
  Typography,
} from '@mui/material'
import { Link } from 'react-router-dom'
import type { UserMode } from '../components/AppNavigation'
import {
  CheckTaskIcon,
  ClipboardIcon,
  DeliveryBagIcon,
  IconBadge,
  StudentIcon,
} from '../components/CampusArt'
import CampusMap from '../components/CampusMap'

const requesterQuickActions = [
  {
    title: 'Browse Suppliers',
    description: 'Find food, printing, and other useful campus services.',
    to: '/suppliers',
    icon: <DeliveryBagIcon />,
  },
  {
    title: 'My Requests',
    description: 'Order-related request tracking is under development.',
    to: '/requests',
    underDevelopment: true,
    icon: <ClipboardIcon />,
  },
  {
    title: 'Account',
    description: 'Review your profile and available FoC roles.',
    to: '/account',
    icon: <StudentIcon />,
  },
]

const courierQuickActions = [
  {
    title: 'Fulfil Requests',
    description: 'Open campus errand requests available for you to accept.',
    to: '/requests',
    underDevelopment: true,
    icon: <ClipboardIcon />,
  },
  {
    title: 'My Tasks',
    description: 'Track accepted courier requests you are currently handling.',
    to: '/my-tasks',
    underDevelopment: true,
    icon: <CheckTaskIcon />,
  },
  {
    title: 'Account',
    description: 'Review your profile and available FoC roles.',
    to: '/account',
    icon: <StudentIcon />,
  },
]

type HomePageProps = {
  mode: UserMode
}

function HomePage({ mode }: HomePageProps) {
  const isCourier = mode === 'courier'
  const tone = isCourier ? 'teal' : 'blue'
  const quickActions = isCourier ? courierQuickActions : requesterQuickActions

  return (
    <Container component="main" maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={{ xs: 2.5, md: 3.5 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: { xs: 2, md: 3 },
            overflow: 'hidden',
            p: { xs: 2.5, md: 4 },
            borderRadius: 4,
            color: '#FFFFFF',
            background: isCourier
              ? 'linear-gradient(135deg, #0F4743 0%, #145E59 48%, #1F8A80 100%)'
              : 'linear-gradient(135deg, #0C2436 0%, #12324C 48%, #1E5680 100%)',
            boxShadow: '0 18px 40px rgba(18, 35, 48, 0.22)',
          }}
        >
          <Stack spacing={1.5}>
            <Typography
              variant="overline"
              sx={{ fontWeight: 800, letterSpacing: '0.12em', color: isCourier ? '#B7E6DF' : '#C5DDF0' }}
            >
              Friend of Campus
            </Typography>
            <Typography component="h1" variant="h3" sx={{ fontWeight: 750, letterSpacing: '-0.03em', color: '#FFFFFF' }}>
              {isCourier ? (
                <>
                  Accept and{' '}
                  <Box component="span" sx={{ color: '#B7E6DF' }}>complete</Box>{' '}
                  campus errands
                </>
              ) : (
                <>
                  Create and{' '}
                  <Box component="span" sx={{ color: '#C5DDF0' }}>track</Box>{' '}
                  campus errands
                </>
              )}
            </Typography>
            <Typography sx={{ maxWidth: 520, fontSize: '1.05rem', color: 'rgba(255,255,255,0.86)' }}>
              {isCourier
                ? 'Pick up open requests and finish the ones you are already handling.'
                : 'Send a campus errand, then follow it from pickup to confirmed delivery.'}
            </Typography>
            <Chip
              label={isCourier ? 'Courier mode' : 'Requester mode'}
              sx={{
                alignSelf: 'flex-start',
                mt: 0.5,
                color: '#FFFFFF',
                bgcolor: 'rgba(255,255,255,0.16)',
                border: '1px solid rgba(255,255,255,0.28)',
              }}
            />
          </Stack>
          <CampusMap />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
            gap: { xs: 2, md: 2.5 },
          }}
        >
          {quickActions.map((action) => (
            <Card
              key={action.title}
              variant="outlined"
              sx={{
                height: '100%',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                boxShadow: '0 12px 28px rgba(18, 35, 48, 0.1)',
                transition: 'transform 160ms ease, box-shadow 160ms ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 18px 36px rgba(18, 35, 48, 0.16)',
                },
              }}
            >
              <CardActionArea
                component={Link}
                to={action.to}
                sx={{ height: '100%' }}
              >
                <Box
                  sx={{
                    height: 6,
                    bgcolor: isCourier ? 'secondary.main' : 'primary.main',
                  }}
                />
                <CardContent sx={{ p: 2.5 }}>
                  <Stack spacing={2}>
                    <IconBadge tone={tone}>{action.icon}</IconBadge>
                    <Stack spacing={0.75}>
                      <Typography component="h2" variant="h6">
                        {action.title}
                      </Typography>
                      <Typography color="text.secondary">
                        {action.description}
                      </Typography>
                    </Stack>
                    {action.underDevelopment && (
                      <Chip
                        label="Under development"
                        size="small"
                        color="secondary"
                        variant="outlined"
                        sx={{ alignSelf: 'flex-start' }}
                      />
                    )}
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>

        <Alert severity="info" variant="outlined" sx={{ bgcolor: 'background.paper' }}>
          Order-related workflows are still under development.
        </Alert>
      </Stack>
    </Container>
  )
}

export default HomePage
