import "dotenv/config";

export const env = {
  port: Number(process.env.PORT ?? 8080),
  frontendOrigin: process.env.FRONTEND_ORIGIN ?? "http://localhost:5173",
  userServiceUrl: process.env.USER_SERVICE_URL ?? "http://localhost:3002",
  supplierServiceUrl: process.env.SUPPLIER_SERVICE_URL ?? "http://localhost:3001",
};
