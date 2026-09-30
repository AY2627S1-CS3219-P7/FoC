// AI Assistance Disclosure:
// Tool: ChatGPT (model: GPT-5.6 Luna), date: 2026-09-30
// Scope: Implemented the Phase 3 API Gateway request ID propagation,
// sanitized request logging, and downstream request ID forwarding
// based on the finalized project design.
// Author review: Reviewed and validated against the finalized gateway
// architecture and Phase 3 requirements.

import "dotenv/config";
import express, {
  type Express,
  type Request,
  type Response
} from "express";
import cors from "cors";
import {
  createProxyMiddleware,
  fixRequestBody
} from "http-proxy-middleware";

import { env } from "./config/env.js";
import { authMiddleware } from "./middleware/authMiddleware.js";
import { loggerMiddleware } from "./middleware/logger.js";
import { requestIdMiddleware } from "./middleware/requestId.js";

const app: Express = express();

const corsOptions = {
  origin: env.frontendOrigin,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(requestIdMiddleware);
app.use(loggerMiddleware);

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "UP",
    service: "api-gateway"
  });
});

const createJsonProxy = (
  target: string,
  pathFilter: (path: string) => boolean
) =>
  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathFilter,
    on: {
      proxyReq: (proxyReq, req) => {
        fixRequestBody(proxyReq, req);

        const requestId = req.headers["x-request-id"];

        if (typeof requestId === "string" && requestId.length > 0) {
          proxyReq.setHeader("X-Request-Id", requestId);
        }
      },
      error: (_error, _req, res) => {
        const response = res as Response;

        if (
          response &&
          typeof response.status === "function" &&
          !response.headersSent
        ) {
          response.status(502).json({
            status: 502,
            message: "Bad Gateway"
          });
        }
      }
    }
  });

const publicAuthProxy = createJsonProxy(
  env.userServiceUrl,
  (path) =>
    path === "/api/auth/register" ||
    path === "/api/auth/login"
);

const protectedAuthProxy = createJsonProxy(
  env.userServiceUrl,
  (path) => path === "/api/auth/logout"
);

const userProxy = createJsonProxy(
  env.userServiceUrl,
  (path) => path.startsWith("/api/users")
);

const supplierServiceProxy = createJsonProxy(
  env.supplierServiceUrl,
  (path) => path.startsWith("/api/suppliers")
);

app.use(publicAuthProxy);
app.use(supplierServiceProxy);

app.use(authMiddleware, protectedAuthProxy);
app.use(authMiddleware, userProxy);

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    status: 404,
    message: "Route not found"
  });
});

app.listen(env.port, () => {
  console.log(`Gateway running on PORT ${env.port}`);
});