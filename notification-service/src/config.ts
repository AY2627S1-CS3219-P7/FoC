const required = (name: string): string => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
};

export const env = {
  PORT: Number(process.env.PORT || 3005),

  RABBITMQ_URL: required("RABBITMQ_URL"),
  RABBITMQ_USER: process.env.RABBITMQ_USER,
  RABBITMQ_PASSWORD: process.env.RABBITMQ_PASSWORD,
  RABBITMQ_EXCHANGE: process.env.RABBITMQ_EXCHANGE || "orders",
  // Durable queue owned by this service, bound to every order event
  QUEUE_NAME: process.env.NOTIFICATION_QUEUE || "notification-service.order-events",

  // Empty = log emails to stdout instead of sending (local dev)
  SNS_TOPIC_ARN: process.env.SNS_TOPIC_ARN || "",
  AWS_REGION: process.env.AWS_REGION || "ap-southeast-1",

  // Link to the app in emails (e.g. the CloudFront URL)
  APP_URL: (process.env.APP_URL || "").replace(/\/+$/, ""),
};
