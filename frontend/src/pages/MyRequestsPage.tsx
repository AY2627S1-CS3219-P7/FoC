/**
 * AI Assistance Disclosure
 * Tool: Cursor (GPT-5.6 Sol Medium)
 * Scope: Assisted with frontend implementation, debugging and UI refinement.
 * Author review: The generated code was reviewed, tested, and iteratively refined by the author through follow-up instructions.
 */

import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Container,
  Pagination,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'
import { Link } from 'react-router-dom'
import { fetchMyRequests, isOrderApiConnected } from '../api/orders'
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

function OrderSection({
  title,
  orders,
  page,
  onPageChange,
}: {
  title: string
  orders: Order[]
  page: number
  onPageChange: (page: number) => void
}) {
  if (orders.length === 0) return null

  // Client-side slice for now. When Order Service supports pagination,
  // pass already-paged `orders` and set totalPages from the API response.
  const { items, page: safePage, totalPages, total } = paginateItems(
    orders,
    page,
    REQUESTS_PER_PAGE,
  )

  return (
    <Stack component="section" spacing={1.5}>
      <Typography component="h2" variant="h6" sx={{ fontWeight: 650 }}>
        {title} ({total})
      </Typography>
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
  const activeTotalPages = Math.ceil(activeOrders.length / REQUESTS_PER_PAGE)
  const pastTotalPages = Math.ceil(pastOrders.length / REQUESTS_PER_PAGE)
  const safeActivePage = clampPage(activePage, activeTotalPages)
  const safePastPage = clampPage(pastPage, pastTotalPages)

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
      <Paper
        variant="outlined"
        sx={{ p: { xs: 3, md: 4 }, textAlign: 'center', bgcolor: 'background.paper' }}
      >
        <Stack spacing={1.5} sx={{ alignItems: 'center' }}>
          <ClipboardIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h6">No requests yet</Typography>
          <Typography color="text.secondary">
            Choose a supplier to create your first campus errand request.
          </Typography>
          <Button component={Link} to="/suppliers" variant="contained">
            Browse suppliers
          </Button>
        </Stack>
      </Paper>
    )
  }

  return (
    <Stack spacing={4}>
      <OrderSection
        title="Active"
        orders={activeOrders}
        page={safeActivePage}
        onPageChange={setActivePage}
      />
      <OrderSection
        title="Past"
        orders={pastOrders}
        page={safePastPage}
        onPageChange={setPastPage}
      />
    </Stack>
  )
}

function CourierPlaceholder() {
  return (
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
            color: 'secondary.dark',
            bgcolor: 'secondary.light',
          }}
        >
          <DeliveryBagIcon sx={{ fontSize: 34 }} />
        </Box>
        <Stack spacing={0.25}>
          <Typography variant="h6">Coming soon</Typography>
          <Typography color="text.secondary">
            This feature is under development.
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  )
}

function MyRequestsPage({ mode }: MyRequestsPageProps) {
  const isCourier = mode === 'courier'
  const requestTitle = isCourier ? 'Fulfil Requests' : 'My Requests'
  const requestDescription = isCourier
    ? 'See campus errand requests that are waiting to be fulfilled.'
    : 'Track your campus errand requests in one place.'

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
                {requestTitle}
              </Typography>
              <Typography color="text.secondary">{requestDescription}</Typography>
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
          <CourierPlaceholder />
        ) : (
          <>
            {!isOrderApiConnected() && (
              <Alert severity="info">
                Showing preview data. Requests will load from the Order Service once it is connected.
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
