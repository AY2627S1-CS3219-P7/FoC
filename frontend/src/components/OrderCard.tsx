/**
 * AI Assistance Disclosure
 * Tool: Cursor (GPT-5.6 Sol Medium)
 * Scope: Assisted with frontend implementation, debugging and UI refinement.
 * Author review: The generated code was reviewed, tested, and iteratively refined by the author through follow-up instructions.
 */

import { Box, Button, Paper, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import {
  formatOrderId,
  formatParticipantName,
  formatPickupLocation,
  type Order,
} from '../orders/orderTypes'
import OrderStatusChip from './OrderStatusChip'

function OrderField({ label, value }: { label: string; value: string }) {
  return (
    <Stack spacing={0.25}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 500, overflowWrap: 'anywhere' }}>
        {value}
      </Typography>
    </Stack>
  )
}

function OrderCard({ order }: { order: Order }) {
  return (
    <Paper
      variant="outlined"
      component="article"
      sx={{
        p: { xs: 2, md: 2.5 },
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        height: '100%',
        boxShadow: '0 8px 24px rgba(23, 35, 45, 0.05)',
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}
      >
        <Stack spacing={0.25} sx={{ minWidth: 0 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
            {formatOrderId(order.id)}
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 650, overflowWrap: 'anywhere' }}>
            {order.itemDescription}
          </Typography>
        </Stack>
        <OrderStatusChip status={order.status} />
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 1.5,
        }}
      >
        <OrderField label="Pickup" value={formatPickupLocation(order.pickup)} />
        <OrderField label="Deliver to" value={order.deliveryLocation} />
        <OrderField label="Credits" value={`${order.creditAmount} credits`} />
        <OrderField
          label="Courier"
          value={order.courier ? formatParticipantName(order.courier) : 'Not assigned yet'}
        />
      </Box>

      <Box sx={{ mt: 'auto' }}>
        <Button
          component={Link}
          to={`/requests/${order.id}`}
          variant="outlined"
          size="small"
        >
          View details
        </Button>
      </Box>
    </Paper>
  )
}

export default OrderCard
