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
import { Link } from 'react-router-dom'
import {
  acceptOrder,
  fetchAvailableRequests,
  fetchMyRequests,
  isOrderApiConnected,
} from '../api/orders'
import type { UserMode } from '../components/AppNavigation'
import { ClipboardIcon, DeliveryBagIcon, IconBadge } from '../components/CampusArt'
import OrderCard from '../components/OrderCard'
import {
  clampPage,
  paginateItems,
  REQUESTS_PER_PAGE,
} from '../orders/clientPagination'
import { isOrderActive, type Order } from '../orders/orderTypes'

type MyRequestsPageProps = {
  mode: UserMode
}

type OrdersRequestResult = {
  key: number
  orders?: Order[]
  error?: string
}

type RequestTab = 'active' | 'past'

const orderGridSx = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
  gap: 2,
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

function EmptyRequests({
  title,
  description,
  showBrowse,
  icon,
}: {
  title: string
  description: string
  showBrowse?: boolean
  icon?: ReactNode
}) {
  return (
    <Paper
      variant="outlined"
      sx={{ p: { xs: 3, md: 4 }, textAlign: 'center', bgcolor: 'background.paper' }}
    >
      <Stack spacing={1.5} sx={{ alignItems: 'center' }}>
        {icon ?? <ClipboardIcon sx={{ fontSize: 40, color: 'primary.main' }} />}
        <Typography variant="h6">{title}</Typography>
        <Typography color="text.secondary">{description}</Typography>
        {showBrowse && (
          <Button component={Link} to="/suppliers" variant="contained">
            Browse suppliers
          </Button>
        )}
      </Stack>
    </Paper>
  )
}

function RequestList({
  orders,
  page,
  onPageChange,
  emptyTitle,
  emptyDescription,
  showBrowse,
}: {
  orders: Order[]
  page: number
  onPageChange: (page: number) => void
  emptyTitle: string
  emptyDescription: string
  showBrowse?: boolean
}) {
  // Client-side slice for now. Replace with API page/limit during integration.
  const { items, page: safePage, totalPages, total } = paginateItems(
    orders,
    page,
    REQUESTS_PER_PAGE,
  )

  if (total === 0) {
    return (
      <EmptyRequests
        title={emptyTitle}
        description={emptyDescription}
        showBrowse={showBrowse}
      />
    )
  }

  return (
    <Stack spacing={2}>
      <Box sx={orderGridSx}>
        {items.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </Box>
      {totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={safePage}
          onChange={(_, newPage) => onPageChange(newPage)}
          color="primary"
          sx={{ alignSelf: { xs: 'center', sm: 'flex-start' } }}
        />
      )}
    </Stack>
  )
}

function RequesterOrders() {
  const [reloadCount, setReloadCount] = useState(0)
  const [result, setResult] = useState<OrdersRequestResult | null>(null)
  const [tab, setTab] = useState<RequestTab>('active')
  const [activePage, setActivePage] = useState(1)
  const [pastPage, setPastPage] = useState(1)

  const loading = result?.key !== reloadCount
  const orders = !loading ? result?.orders : undefined
  const errorMessage = !loading ? result?.error : undefined

  useEffect(() => {
    let ignore = false

    fetchMyRequests()
      .then((data) => {
        if (!ignore) {
          setResult({ key: reloadCount, orders: data })
          setActivePage(1)
          setPastPage(1)
        }
      })
      .catch((error: unknown) => {
        if (ignore) return
        console.error(error)
        setResult({ key: reloadCount, error: 'Your requests could not be loaded.' })
      })

    return () => {
      ignore = true
    }
  }, [reloadCount])

  const activeOrders = orders?.filter((order) => isOrderActive(order.status)) ?? []
  const pastOrders = orders?.filter((order) => !isOrderActive(order.status)) ?? []
  const safeActivePage = clampPage(
    activePage,
    Math.ceil(activeOrders.length / REQUESTS_PER_PAGE),
  )
  const safePastPage = clampPage(pastPage, Math.ceil(pastOrders.length / REQUESTS_PER_PAGE))

  if (loading) {
    return (
      <Box role="status" aria-label="Loading requests" sx={orderGridSx}>
        <OrderCardSkeleton />
        <OrderCardSkeleton />
      </Box>
    )
  }

  if (errorMessage) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={() => setReloadCount((count) => count + 1)}>
            Retry
          </Button>
        }
      >
        {errorMessage}
      </Alert>
    )
  }

  if (!orders || orders.length === 0) {
    return (
      <EmptyRequests
        title="No requests yet"
        description="Choose a supplier to create your first campus errand request."
        showBrowse
      />
    )
  }

  return (
    <Stack spacing={2.5}>
      <Tabs
        value={tab}
        onChange={(_event, newTab: RequestTab) => setTab(newTab)}
        variant="scrollable"
        allowScrollButtonsMobile
        aria-label="Request sections"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label={`Active Requests (${activeOrders.length})`} value="active" />
        <Tab label={`Past Requests (${pastOrders.length})`} value="past" />
      </Tabs>

      {tab === 'active' ? (
        <RequestList
          orders={activeOrders}
          page={safeActivePage}
          onPageChange={setActivePage}
          emptyTitle="No active requests"
          emptyDescription="You have no open, accepted, or in-progress requests right now."
          showBrowse
        />
      ) : (
        <RequestList
          orders={pastOrders}
          page={safePastPage}
          onPageChange={setPastPage}
          emptyTitle="No past requests"
          emptyDescription="Completed, cancelled, and expired requests will appear here."
        />
      )}
    </Stack>
  )
}

/** Courier "Fulfil Requests" page: OPEN orders waiting to be accepted. */
function CourierAvailableRequests() {
  const [reloadCount, setReloadCount] = useState(0)
  const [result, setResult] = useState<OrdersRequestResult | null>(null)
  const [page, setPage] = useState(1)
  const [pendingOrder, setPendingOrder] = useState<Order | null>(null)
  const [actionOrderId, setActionOrderId] = useState<string | null>(null)
  const [actionError, setActionError] = useState('')

  const loading = result?.key !== reloadCount
  const orders = !loading ? (result?.orders ?? []) : []
  const errorMessage = !loading ? result?.error : undefined
  const safePage = clampPage(page, Math.ceil(orders.length / REQUESTS_PER_PAGE))
  const { items, page: listPage, totalPages, total } = paginateItems(
    orders,
    safePage,
    REQUESTS_PER_PAGE,
  )

  useEffect(() => {
    let ignore = false

    fetchAvailableRequests()
      .then((data) => {
        if (!ignore) {
          setResult({ key: reloadCount, orders: data })
          setPage(1)
        }
      })
      .catch((error: unknown) => {
        if (ignore) return
        console.error(error)
        setResult({ key: reloadCount, error: 'Available requests could not be loaded.' })
      })

    return () => {
      ignore = true
    }
  }, [reloadCount])

  async function handleAccept() {
    if (!pendingOrder) return

    const order = pendingOrder
    setPendingOrder(null)
    setActionOrderId(order.id)
    setActionError('')

    try {
      await acceptOrder(order.id)
      setReloadCount((count) => count + 1)
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : 'Action failed. Please try again.',
      )
    } finally {
      setActionOrderId(null)
    }
  }

  return (
    <>
      {!isOrderApiConnected() && (
        <Alert severity="info">
          Showing preview data. Accept will report an error until the Order Service is connected.
        </Alert>
      )}

      {actionError && (
        <Alert severity="error" onClose={() => setActionError('')}>
          {actionError}
        </Alert>
      )}

      {loading ? (
        <Box role="status" aria-label="Loading available requests" sx={orderGridSx}>
          <OrderCardSkeleton />
          <OrderCardSkeleton />
        </Box>
      ) : errorMessage ? (
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
          {errorMessage}
        </Alert>
      ) : total === 0 ? (
        <EmptyRequests
          title="No available requests"
          description="Check back later for new campus errands you can accept."
          icon={<DeliveryBagIcon sx={{ fontSize: 40, color: 'secondary.main' }} />}
        />
      ) : (
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            {total} open {total === 1 ? 'request' : 'requests'} waiting for a courier.
          </Typography>
          <Box sx={orderGridSx}>
            {items.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                variant="courier"
                actionPending={actionOrderId === order.id}
                onCourierAction={(selected) => {
                  setPendingOrder(selected)
                }}
              />
            ))}
          </Box>
          {totalPages > 1 && (
            <Pagination
              count={totalPages}
              page={listPage}
              onChange={(_, newPage) => setPage(newPage)}
              color="secondary"
              sx={{ alignSelf: { xs: 'center', sm: 'flex-start' } }}
            />
          )}
        </Stack>
      )}

      <Dialog open={pendingOrder !== null} onClose={() => setPendingOrder(null)}>
        <DialogTitle>Accept this request?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You will become the assigned courier for this campus errand.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPendingOrder(null)}>Back</Button>
          <Button variant="contained" color="secondary" onClick={() => void handleAccept()}>
            Accept
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

function MyRequestsPage({ mode }: MyRequestsPageProps) {
  const isCourier = mode === 'courier'

  return (
    <Container component="main" maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
      <Stack spacing={3}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between' }}
        >
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <IconBadge tone={isCourier ? 'teal' : 'blue'}>
              {isCourier ? <DeliveryBagIcon /> : <ClipboardIcon />}
            </IconBadge>
            <Stack spacing={0.25}>
              <Typography component="h1" variant="h4">
                {isCourier ? 'Fulfil Requests' : 'My Requests'}
              </Typography>
              <Typography color="text.secondary">
                {isCourier
                  ? 'See campus errand requests that are waiting to be fulfilled.'
                  : 'Track your campus errand requests in one place.'}
              </Typography>
            </Stack>
          </Stack>

          {!isCourier && (
            <Button
              component={Link}
              to="/suppliers"
              variant="contained"
              sx={{ alignSelf: { xs: 'flex-start', sm: 'auto' } }}
            >
              New request
            </Button>
          )}
        </Stack>

        {isCourier ? (
          <CourierAvailableRequests />
        ) : (
          <>
            {!isOrderApiConnected() && (
              <Alert severity="info">
                Showing preview data. Requests will load from the Order Service once it is
                connected.
              </Alert>
            )}
            <RequesterOrders />
          </>
        )}
      </Stack>
    </Container>
  )
}

export default MyRequestsPage
