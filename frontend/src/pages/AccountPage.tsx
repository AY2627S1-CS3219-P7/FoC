/**
 * AI Assistance Disclosure
 * Tool: Cursor (GPT-5.6 Sol Medium)
 * Scope: Assisted with frontend implementation, debugging and UI refinement.
 * Author review: The generated code was reviewed, tested, and iteratively refined by the author through follow-up instructions.
 */

import { useState, useEffect, type FormEvent } from 'react'
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { IconBadge, StudentIcon } from '../components/CampusArt'
import { useAuth } from '../auth/AuthContext'
import { updateCurrentUser } from '../api/users'
import type { Role } from '../interfaces'

const roleChips: Record<Role, { label: string; color: 'default' | 'primary' | 'secondary' }> = {
  ADMIN: { label: 'Admin', color: 'default' },
  REQUESTER: { label: 'Requester', color: 'primary' },
  COURIER: { label: 'Courier', color: 'secondary' },
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <Stack spacing={0.25}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography
        variant="body1"
        color="text.primary"
        sx={{ fontSize: '1.05rem', fontWeight: 500 }}
      >
        {value}
      </Typography>
    </Stack>
  )
}

function AccountPage() {
  const { user, setUser } = useAuth()

  const [formValues, setFormValues] = useState({
    username: user?.username ?? '',
    email: user?.email ?? '',
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
  })
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      setFormValues({
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      })
    }
  }, [user])

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    try {
      const updatedUser = await updateCurrentUser({
        username: formValues.username,
        email: formValues.email,
        firstName: formValues.firstName,
        lastName: formValues.lastName,
      })
      setUser(updatedUser)
      setSuccessMsg('Profile updated successfully!')
      setIsEditing(false)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update profile'
      setErrorMsg(message)
    } finally {
      setSaving(false)
    }
  }

  function handleCancel() {
    if (user) {
      setFormValues({
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      })
    }
    setErrorMsg(null)
    setIsEditing(false)
  }

  if (!user) {
    return null
  }

  return (
    <Container component="main" maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
      <Stack spacing={2}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{
            alignItems: { sm: 'center' },
            justifyContent: 'space-between',
          }}
        >
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <IconBadge tone="blue">
              <StudentIcon />
            </IconBadge>
            <Box>
              <Typography component="h1" variant="h4">
                Account
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 0.25 }}>
                Manage your profile and view your available roles.
              </Typography>
            </Box>
          </Stack>

          {!isEditing && (
            <Button
              variant="contained"
              onClick={() => {
                setErrorMsg(null)
                setSuccessMsg(null)
                setIsEditing(true)
              }}
              sx={{ alignSelf: { xs: 'flex-start', sm: 'auto' } }}
            >
              Edit Profile
            </Button>
          )}
        </Stack>

        {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
        {successMsg && <Alert severity="success">{successMsg}</Alert>}

        <Paper
          variant="outlined"
          sx={{
            p: { xs: 2, md: 3 },
            borderColor: 'divider',
            boxBoxShadow: '0 8px 24px rgba(23, 35, 45, 0.05)',
          }}
        >
          {isEditing ? (
            <form onSubmit={handleSave}>
              <Stack spacing={2}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 2,
                  }}
                >
                  <TextField
                    required
                    label="Username"
                    value={formValues.username}
                    onChange={(event) =>
                      setFormValues({
                        ...formValues,
                        username: event.target.value,
                      })
                    }
                  />
                  <TextField
                    required
                    type="email"
                    label="Email"
                    value={formValues.email}
                    onChange={(event) =>
                      setFormValues({
                        ...formValues,
                        email: event.target.value,
                      })
                    }
                  />
                  <TextField
                    required
                    label="First Name"
                    value={formValues.firstName}
                    onChange={(event) =>
                      setFormValues({
                        ...formValues,
                        firstName: event.target.value,
                      })
                    }
                  />
                  <TextField
                    required
                    label="Last Name"
                    value={formValues.lastName}
                    onChange={(event) =>
                      setFormValues({
                        ...formValues,
                        lastName: event.target.value,
                      })
                    }
                  />
                </Box>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button type="submit" variant="contained" disabled={saving}>
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                  <Button variant="outlined" onClick={handleCancel} disabled={saving}>
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            </form>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: { xs: 1.5, sm: 2 },
              }}
            >
              <ProfileField label="Username" value={user.username} />
              <ProfileField label="Email" value={user.email} />
              <ProfileField label="First Name" value={user.firstName} />
              <ProfileField label="Last Name" value={user.lastName} />
            </Box>
          )}

          <Divider sx={{ my: 2.5 }} />

          <Stack component="section" spacing={1.25}>
            <Typography component="h2" variant="h6" sx={{ fontWeight: 600 }}>
              Available Roles
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
              {user.roles.map((role) => (
                <Chip
                  key={role}
                  label={roleChips[role]?.label ?? role}
                  color={roleChips[role]?.color ?? 'default'}
                  variant="outlined"
                />
              ))}
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Roles are managed by the system and cannot be edited here.
            </Typography>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  )
}

export default AccountPage
