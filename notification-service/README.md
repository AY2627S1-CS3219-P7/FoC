# Notification Service

Emails requesters and couriers when their errand changes status.

## How it works

```
Order Service --(outbox)--> RabbitMQ topic exchange "orders"
                                 |-- queue credit-service ...   (order.completed / cancelled / expired)
                                 '-- queue notification-service.order-events  (order.#)
                                          |
                               Notification Service --> Amazon SNS topic "foc-notifications" --> email
```

- Consumes **every** order event (`order.#`) from its own durable queue, so it never competes with the credit service for messages, and events wait in the queue while it is down.
- Maps each event to emails (`src/notifications/templates.ts`):

| Event | Requester | Courier |
|---|---|---|
| ORDER_CREATED | posted, credits reserved | - |
| ORDER_ACCEPTED | courier accepted | you accepted |
| ORDER_PICKED_UP | items picked up | - |
| ORDER_COMPLETED | completed, credits to courier | you earned credits |
| ORDER_CANCELLED | cancelled, credits released | errand cancelled |
| ORDER_EXPIRED | expired, credits released | - |

- Publishes to **one SNS topic** with a `userId` message attribute. Each user's email subscription has a **filter policy** `{"userId": ["<id>"]}`, so SNS only delivers a user their own emails.
- At-least-once delivery: duplicates skipped by `event_id`; ack only after SNS accepts; one retry, then drop + log.
- Stateless: no database.
- Order Service treats ORDER_CREATED / ACCEPTED / PICKED_UP as informational: if no queue is bound they are dropped with a warning instead of blocking the outbox (credit events must never be blocked).

## Run locally

Part of the root `docker compose up --build`. With `SNS_TOPIC_ARN` empty, emails are printed to the container log. To send real emails, set `SNS_TOPIC_ARN` and temporary AWS credentials in `notification-service/.env`.

## Subscribing a user (manual for now)

SNS console -> topic `foc-notifications` -> Create subscription -> Email -> filter policy (message attributes) `{"userId": ["<user id>"]}` -> user clicks the confirmation email.

## Cloud

ECS service `notification-service` (Fargate, no load balancer). Task role needs `sns:Publish` on the topic. Deploy this service **before** the order-service changes so its queue exists.

## Future work

Auto-subscribe users at sign-up; SMS; dead-letter queue for failed notifications; persistent de-duplication.
