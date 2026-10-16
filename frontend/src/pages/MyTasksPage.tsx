/**
 * AI Assistance Disclosure
 * Tool: Cursor (GPT-5.6 Sol Medium)
 * Scope: Assisted with frontend implementation, debugging and UI refinement.
 * Author review: The generated code was reviewed, tested, and iteratively refined by the author through follow-up instructions.
 */

import { useEffect, useState, type ReactNode } from 'react'
import {
  Alert,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Pagination,
  Paper,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import {
  fetchMyCourierTasks,
  isOrderApiConnected,
  markOrderDelivered,
  markOrderPickedUp,
} from '../api/orders'
import { CheckTaskIcon, IconBadge } from '../components/CampusArt'
import OrderCard from '../components/OrderCard'
import {
  clampPage,
  paginateItems,
  REQUESTS_PER_PAGE,
} from '../orders/clientPagination'
import {
  isCourierTaskActive,
  type CourierAction,
  type Order,
} from '../orders/orderTypes'

type ListRequestResult = {
  key: number
  orders?: Order[]
  error?: string
}

type TaskTab = 'active' | 'past'

const orderGridSx = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
  gap: 2,
}

const courierActionCopy: Record<
  Exclude<CourierAction, 'accept'>,
  { title: string; body: string; confirmLabel: string }
> = {
  'pick-up': {
    title: 'Mark as picked up?',
    body: 'Confirm only after you have collected the item from the supplier.',
    confirmLabel: 'Mark picked up',
  },
  deliver: {
    title: 'Mark as delivered?',
    body: 'Confirm only after you have handed the item to the requester.',
    confirmLabel: 'Mark delivered',
  },
}

function OrderCardSkeleton() {
  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, md: 2.5 } }} aria-hidden="true">
      <Stack spacing={1.5}>
        <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
          <Skeleton width="55%" height={28} />
          <Skeleton variant="rounded" width={72} height={24} />
        </Stack>
        <Skeleton width="80%" />
        <Skeleton width="70%" />
        <Skeleton width="40%" />
        <Skeleton variant="rounded" width={110} height={30} />
      </Stack>
    </Paper>
  )
}

function EmptySection({
  icon,
  title,
  description,
}: {
  icon: ReactNode
  title: string
  description: string
}) {
  return (
    <Paper
      variant="outlined"
      sx={{ p: { xs: 3, md: 4 }, textAlign: 'center', bgcolor: 'background.paper' }}
    >
      <Stack spacing={1.5} sx={{ alignItems: 'center' }}>
        {icon}
        <Typography variant="h6">{title}</Typography>
        <Typography color="text.secondary">{description}</Typography>
      </Stack>
    </Paper>
  )
}

function CourierTaskList({
  orders,
  page,
  onPageChange,
  emptyTitle,
  emptyDescription,
  emptyIcon,
  actionOrderId,
  onCourierAction,
}: {
  orders: Order[]
  page: number
  onPageChange: (page: number) => void
  emptyTitle: string
  emptyDescription: string
  emptyIcon: ReactNode
  actionOrderId: string | null
  onCourierAction: (order: Order, action: CourierAction) => void
}) {
  // Client-side slice for now. Replace with API page/limit during integration.
  const { items, page: safePage, totalPages, total } = paginateItems(
    orders,
    page,
    REQUESTS_PER_PAGE,
  )

  if (total === 0) {
    return (
      <EmptySection icon={emptyIcon} title={emptyTitle} description={emptyDescription} />
    )
  }

  return (
    <Stack spacing={2}>
      <Box sx={orderGridSx}>
        {items.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            variant="courier"
            actionPending={actionOrderId === order.id}
            onCourierAction={onCourierAction}
          />
        ))}
      </Box>
      {totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={safePage}
          onChange={(_, newPage) => onPageChange(newPage)}
          color="secondary"
          sx={{ alignSelf: { xs: 'center', sm: 'flex-start' } }}
        />
      )}
    </Stack>
  )
}

function MyTasksPage() {
  const [reloadCount, setReloadCount] = useState(0)
  const [tasksResult, setTasksResult] = useState<ListRequestResult | null>(null)
  const [tab, setTab] = useState<TaskTab>('active')
  const [activePage, setActivePage] = useState(1)
  const [pastPage, setPastPage] = useState(1)
  const [pending, setPending] = useState<{
    order: Order
    action: Exclude<CourierAction, 'accept'>
  } | null>(null)
  const [actionOrderId, setActionOrderId] = useState<string | null>(null)
  const [actionError, setActionError] = useState('')

  const loading = tasksResult?.key !== reloadCount

  useEffect(() => {
    let ignore = false

    fetchMyCourierTasks()
      .then((tasks) => {
        if (ignore) return
        setTasksResult({ key: reloadCount, orders: tasks })
        setActivePage(1)
        setPastPage(1)
      })
      .catch((error: unknown) => {
        if (ignore) return
        console.error(error)
        setTasksResult({ key: reloadCount, error: 'Your tasks could not be loaded.' })
      })

    return () => {
      ignore = true
    }
  }, [reloadCount])

  const allTasks = tasksResult?.orders ?? []
  // ACCEPTED / PICKED_UP = still in progress for this courier.
  const activeTasks = allTasks.filter((order) => isCourierTaskActive(order.status))
  // COMPLETED / CANCELLED / EXPIRED (and any other non-active assigned status).
  const pastTasks = allTasks.filter((order) => !isCourierTaskActive(order.status))

  const safeActivePage = clampPage(
    activePage,
    Math.ceil(activeTasks.length / REQUESTS_PER_PAGE),
  )
  const safePastPage = clampPage(pastPage, Math.ceil(pastTasks.length / REQUESTS_PER_PAGE))

  async function handleConfirmAction() {
    if (!pending) return

    const { order, action } = pending
    setPending(null)
    setActionOrderId(order.id)
    setActionError('')

    try {
      if (action === 'pick-up') {
        await markOrderPickedUp(order.id)
      } else {
        await markOrderDelivered(order.id)
      }
      setReloadCount((count) => count + 1)
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : 'Action failed. Please try again.',
      )
    } finally {
      setActionOrderId(null)
    }
  }

  function handleCourierAction(order: Order, action: CourierAction) {
    if (action === 'accept') return
    setPending({ order, action })
  }

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
              Track campus errands assigned to you.
            </Typography>
          </Stack>
        </Stack>

        {!isOrderApiConnected() && (
          <Alert severity="info">
            Showing preview data. Courier actions will report an error until the Order Service is
            connected.
          </Alert>
        )}

        {actionError && (
          <Alert severity="error" onClose={() => setActionError('')}>
            {actionError}
          </Alert>
        )}

        {loading ? (
          <Box role="status" aria-label="Loading courier tasks" sx={orderGridSx}>
            <OrderCardSkeleton />
            <OrderCardSkeleton />
          </Box>
        ) : tasksResult?.error ? (
          <Alert
            severity="error"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => setReloadCount((count) => count + 1)}
              >
                Retry
              </Button>
            }
          >
            {tasksResult.error}
          </Alert>
        ) : (
          <Stack spacing={2.5}>
            <Tabs
              value={tab}
              onChange={(_event, newTab: TaskTab) => setTab(newTab)}
              variant="scrollable"
              allowScrollButtonsMobile
              aria-label="Courier task sections"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label={`Active Tasks (${activeTasks.length})`} value="active" />
              <Tab label={`Past Tasks (${pastTasks.length})`} value="past" />
            </Tabs>

            {tab === 'active' && (
              <CourierTaskList
                orders={activeTasks}
                page={safeActivePage}
                onPageChange={setActivePage}
                emptyTitle="No active tasks"
                emptyDescription="Accept a request from Fulfil Requests to start your first task."
                emptyIcon={<CheckTaskIcon sx={{ fontSize: 40, color: 'secondary.main' }} />}
                actionOrderId={actionOrderId}
                onCourierAction={handleCourierAction}
              />
            )}

            {tab === 'past' && (
              <CourierTaskList
                orders={pastTasks}
                page={safePastPage}
                onPageChange={setPastPage}
                emptyTitle="No past tasks"
                emptyDescription="Completed, cancelled, and expired tasks will appear here."
                emptyIcon={<CheckTaskIcon sx={{ fontSize: 40, color: 'secondary.main' }} />}
                actionOrderId={actionOrderId}
                onCourierAction={handleCourierAction}
              />
            )}
          </Stack>
        )}
      </Stack>

      <Dialog open={pending !== null} onClose={() => setPending(null)}>
        {pending && (
          <>
            <DialogTitle>{courierActionCopy[pending.action].title}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {courierActionCopy[pending.action].body}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setPending(null)}>Back</Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => void handleConfirmAction()}
              >
                {courierActionCopy[pending.action].confirmLabel}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  )
}

export default MyTasksPage
