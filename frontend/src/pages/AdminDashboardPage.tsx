/**
 * AI Assistance Disclosure
 * Tool: Cursor (GPT-5.6 Sol Medium)
 * Scope: Assisted with frontend implementation, debugging and UI refinement.
 * Author review: The generated code was reviewed, tested, and iteratively refined by the author through follow-up instructions.
 */

import { useState, type ReactNode } from 'react'
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from '@mui/material'
import { Link } from 'react-router-dom'
import {
  CampusBuildingIcon,
  ClipboardIcon,
  IconBadge,
  StudentIcon,
} from '../components/CampusArt'

type AdminSection = 'users' | 'suppliers' | 'orders'

const userTableColumns = ['Username', 'Email', 'Roles', 'Status', 'Actions']

const sectionPaperSx = {
  p: { xs: 2, md: 3 },
  bgcolor: 'background.paper',
  boxShadow: '0 12px 32px rgba(23, 35, 45, 0.06)',
}

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: ReactNode
  title: string
  description: string
}) {
  return (
    <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
      <Box
        sx={{
          display: 'grid',
          width: 56,
          height: 56,
          flexShrink: 0,
          placeItems: 'center',
          borderRadius: '50%',
          color: 'primary.dark',
          bgcolor: 'primary.light',
        }}
      >
        {icon}
      </Box>
      <Stack spacing={0.25}>
        <Typography variant="h6">{title}</Typography>
        <Typography color="text.secondary">{description}</Typography>
      </Stack>
    </Stack>
  )
}

function UsersSection() {
  return (
    <Paper variant="outlined" sx={sectionPaperSx}>
      <Stack spacing={2.5}>
        <SectionHeader
          icon={<StudentIcon sx={{ fontSize: 28 }} />}
          title="Users"
          description="View accounts and manage their roles."
        />

        <TableContainer
          sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}
        >
          <Table size="small" aria-label="Users">
            <TableHead>
              <TableRow>
                {userTableColumns.map((column) => (
                  <TableCell key={column} sx={{ fontWeight: 700 }}>
                    {column}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell
                  colSpan={userTableColumns.length}
                  align="center"
                  sx={{ py: 4, color: 'text.secondary' }}
                >
                  User management is under development. No users are loaded yet.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Paper>
  )
}

function SuppliersSection() {
  return (
    <Paper variant="outlined" sx={sectionPaperSx}>
      <Stack spacing={2.5}>
        <SectionHeader
          icon={<CampusBuildingIcon sx={{ fontSize: 28 }} />}
          title="Suppliers"
          description="Add, edit, and remove campus suppliers."
        />
        <Box>
          <Button variant="contained" component={Link} to="/suppliers">
            Go to Suppliers
          </Button>
        </Box>
      </Stack>
    </Paper>
  )
}

function OrdersSection() {
  return (
    <Paper variant="outlined" sx={sectionPaperSx}>
      <SectionHeader
        icon={<ClipboardIcon sx={{ fontSize: 28 }} />}
        title="Orders"
        description="Order monitoring is pending Order Service integration."
      />
    </Paper>
  )
}

function AdminDashboardPage() {
  const [section, setSection] = useState<AdminSection>('users')

  return (
    <Container component="main" maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
      <Stack spacing={3}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <IconBadge tone="blue">
            <StudentIcon />
          </IconBadge>
          <Stack spacing={0.25}>
            <Typography component="h1" variant="h4">
              Admin Dashboard
            </Typography>
            <Typography color="text.secondary">
              Manage users, suppliers, and orders across FoC.
            </Typography>
          </Stack>
        </Stack>

        <Tabs
          value={section}
          onChange={(_event, newSection: AdminSection) => setSection(newSection)}
          variant="scrollable"
          allowScrollButtonsMobile
          aria-label="Admin sections"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Users" value="users" />
          <Tab label="Suppliers" value="suppliers" />
          <Tab label="Orders" value="orders" />
        </Tabs>

        {section === 'users' && <UsersSection />}
        {section === 'suppliers' && <SuppliersSection />}
        {section === 'orders' && <OrdersSection />}
      </Stack>
    </Container>
  )
}

export default AdminDashboardPage
