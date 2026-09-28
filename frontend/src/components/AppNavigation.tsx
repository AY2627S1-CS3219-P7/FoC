/**
 * AI Assistance Disclosure
 * Tool: Cursor (GPT-5.6 Sol Medium)
 * Scope: Assisted with frontend implementation, debugging and UI refinement.
 * Author review: The generated code was reviewed, tested, and iteratively refined by the author through follow-up instructions.
 */

import { useState } from 'react'
import {
  AppBar,
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  SvgIcon,
  Toolbar,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CampusBuildingIcon } from './CampusArt'

export type UserMode = 'requester' | 'courier'

type AppNavigationProps = {
  mode: UserMode
  onModeChange: (newMode: UserMode) => void
}

const navigationItems = [
  {
    label: 'Home',
    value: 'home',
    to: '/home',
    path: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5Z',
  },
  {
    label: 'Suppliers',
    value: 'suppliers',
    to: '/suppliers',
    path: 'M4 4h16v2H4V4Zm-1 4h18l-1 5H4L3 8Zm2 7h14v6H5v-6Zm3 2v2h3v-2H8Z',
  },
  {
    label: 'My Requests',
    value: 'requests',
    to: '/requests',
    path: 'M19 3h-4.18A3 3 0 0 0 9.18 3H5a2 2 0 0 0-2 2v16h18V5a2 2 0 0 0-2-2Zm-7-1a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm3 15H7v-2h8v2Zm2-4H7v-2h10v2Zm0-4H7V7h10v2Z',
  },
  {
    label: 'My Tasks',
    value: 'tasks',
    to: '/my-tasks',
    path: 'M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
  },
  {
    label: 'Account',
    value: 'account',
    to: '/account',
    path: 'M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-5.52 0-10 2.24-10 5v3h20v-3c0-2.76-4.48-5-10-5Z',
  },
]

function NavigationIcon({ path }: { path: string }) {
  return (
    <SvgIcon aria-hidden="true">
      <path d={path} />
    </SvgIcon>
  )
}

function ModeToggle({
  mode,
  onChange,
}: {
  mode: UserMode
  onChange: (newMode: UserMode) => void
}) {
  const activeStyle = {
    color: mode === 'courier' ? '#145E59' : '#12324C',
    backgroundColor: '#FFFFFF',
  }

  return (
    <ToggleButtonGroup
      exclusive
      size="small"
      value={mode}
      aria-label="User mode"
      sx={{
        width: { xs: '100%', md: 'auto' },
        bgcolor: 'rgba(255, 255, 255, 0.14)',
        border: '1px solid rgba(255, 255, 255, 0.28)',
        '& .MuiToggleButton-root': {
          color: 'rgba(255, 255, 255, 0.86)',
          border: 0,
          px: 1.5,
        },
      }}
    >
      <ToggleButton
        value="requester"
        onClick={() => onChange('requester')}
        style={mode === 'requester' ? activeStyle : undefined}
        sx={{ flex: { xs: 1, md: 'initial' } }}
      >
        Requester
      </ToggleButton>
      <ToggleButton
        value="courier"
        onClick={() => onChange('courier')}
        style={mode === 'courier' ? activeStyle : undefined}
        sx={{ flex: { xs: 1, md: 'initial' } }}
      >
        Courier
      </ToggleButton>
    </ToggleButtonGroup>
  )
}

function AppNavigation({ mode, onModeChange }: AppNavigationProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const requestLabel = mode === 'courier' ? 'Fulfil Requests' : 'My Requests'
  const visibleNavigationItems = navigationItems.filter((item) => {
    if (item.value === 'suppliers') {
      return mode === 'requester'
    }

    if (item.value === 'tasks') {
      return mode === 'courier'
    }

    return true
  })
  const activeNavigationItem =
    visibleNavigationItems.find((item) => {
      if (item.value === 'suppliers') {
        return location.pathname.startsWith('/suppliers')
      }

      return location.pathname === item.to
    })?.value ?? false

  const [mobileMenuAnchor, setMobileMenuAnchor] =
    useState<HTMLElement | null>(null)
  const isCourier = mode === 'courier'
  const barColor = isCourier ? '#145E59' : '#12324C'
  const navButtonSx = (isActive: boolean) => ({
    color: isActive ? barColor : 'rgba(255, 255, 255, 0.82)',
    bgcolor: isActive ? '#FFFFFF' : 'transparent',
    '&:hover': {
      bgcolor: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.12)',
    },
    '&.Mui-focusVisible': {
      outline: '2px solid #FFFFFF',
      outlineOffset: 2,
    },
  })

  function handleLogout() {
    setMobileMenuAnchor(null)

    // TODO: Replace this navigation-only logout with real authenticated session
    // handling through the team's existing User Service.
    navigate('/login')
  }

  return (
    <>
      <AppBar
        component="nav"
        position="sticky"
        elevation={0}
        sx={{
          display: { xs: 'none', md: 'block' },
          color: '#FFFFFF',
          bgcolor: barColor,
        }}
      >
        <Toolbar
          sx={{
            display: 'grid',
            gridTemplateColumns: { md: '1fr auto 1fr', lg: '1fr auto 1fr' },
            alignItems: 'center',
            columnGap: 1.5,
            rowGap: 1,
            height: 'auto',
            minHeight: 64,
            py: 1,
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            sx={{ alignItems: 'center', justifySelf: 'start' }}
          >
            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: 'center' }}
            >
              <Box
                sx={{
                  display: 'grid',
                  width: 40,
                  height: 40,
                  placeItems: 'center',
                  color: barColor,
                  bgcolor: '#FFFFFF',
                  borderRadius: 2,
                }}
              >
                <CampusBuildingIcon />
              </Box>
              <Box sx={{ display: { md: 'none', lg: 'block' } }}>
                <Typography
                  sx={{
                    color: '#FFFFFF',
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    lineHeight: 1.1,
                  }}
                >
                  FoC
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.78)' }}>
                  Friend of Campus
                </Typography>
              </Box>
            </Stack>
            <ModeToggle mode={mode} onChange={onModeChange} />
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            sx={{ justifySelf: 'center', flexWrap: 'wrap', justifyContent: 'center' }}
          >
            {visibleNavigationItems.map((item) => {
              const isActive = item.value === activeNavigationItem

              return (
                <Button
                  key={item.value}
                  component={Link}
                  to={item.to}
                  startIcon={<NavigationIcon path={item.path} />}
                  variant="text"
                  sx={navButtonSx(isActive)}
                >
                  {item.value === 'requests' ? requestLabel : item.label}
                </Button>
              )
            })}
          </Stack>
          <Button
            variant="outlined"
            onClick={handleLogout}
            sx={{
              justifySelf: 'end',
              color: '#FFFFFF',
              borderColor: 'rgba(255, 255, 255, 0.55)',
              '&:hover': {
                borderColor: '#FFFFFF',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Paper
        component="section"
        square
        elevation={1}
        aria-label="Application controls"
        sx={{
          display: { xs: 'block', md: 'none' },
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          px: 1.5,
          py: 1,
          color: '#FFFFFF',
          bgcolor: barColor,
        }}
      >
        <Stack spacing={1}>
          <Stack
            direction="row"
            sx={{ alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Box
                sx={{
                  display: 'grid',
                  width: 32,
                  height: 32,
                  placeItems: 'center',
                  color: barColor,
                  bgcolor: '#FFFFFF',
                  borderRadius: 1.5,
                }}
              >
                <CampusBuildingIcon fontSize="small" />
              </Box>
              <Typography
                sx={{
                  color: '#FFFFFF',
                  fontSize: '1.05rem',
                  fontWeight: 800,
                }}
              >
                FoC
              </Typography>
            </Stack>
            <IconButton
              aria-label="Open account actions"
              aria-haspopup="menu"
              aria-expanded={mobileMenuAnchor ? 'true' : undefined}
              onClick={(event) => setMobileMenuAnchor(event.currentTarget)}
              sx={{ color: '#FFFFFF' }}
            >
              <SvgIcon aria-hidden="true">
                <path d="M12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
              </SvgIcon>
            </IconButton>
          </Stack>
          <ModeToggle mode={mode} onChange={onModeChange} />
        </Stack>
      </Paper>

      <Menu
        anchorEl={mobileMenuAnchor}
        open={Boolean(mobileMenuAnchor)}
        onClose={() => setMobileMenuAnchor(null)}
      >
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>

      <Paper
        component="nav"
        square
        elevation={8}
        sx={{
          display: { xs: 'block', md: 'none' },
          position: 'fixed',
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: 1200,
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <BottomNavigation
          showLabels
          value={activeNavigationItem}
          sx={{
            bgcolor: barColor,
            '& .MuiBottomNavigationAction-root': {
              color: 'rgba(255, 255, 255, 0.72)',
              minWidth: 0,
              px: 0.5,
              '&.Mui-selected': {
                color: '#FFFFFF',
              },
            },
          }}
        >
          {visibleNavigationItems.map((item) => (
            <BottomNavigationAction
              key={item.value}
              component={Link}
              to={item.to}
              label={item.value === 'requests' ? requestLabel : item.label}
              value={item.value}
              icon={<NavigationIcon path={item.path} />}
            />
          ))}
        </BottomNavigation>
      </Paper>
    </>
  )
}

export default AppNavigation
