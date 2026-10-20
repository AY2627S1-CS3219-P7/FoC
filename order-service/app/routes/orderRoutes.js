const { authenticate, requireRoles } = require("../middleware/auth");

module.exports = (app) => {
  const orders = require("../controllers/orderController.js");

  const router = require("express").Router();

  const requireAnyRole = requireRoles("ADMIN", "REQUESTER", "COURIER");
  const requireRequesterRole = requireRoles("REQUESTER");
  const requireCourierRole = requireRoles("COURIER");

  router.use(authenticate);

  // Create a new order
  router.post("/", requireRequesterRole, orders.create);

  // Browse / filter orders
  router.get("/", requireAnyRole, orders.getAll);

  // Get one order
  router.get("/:id", requireAnyRole, orders.getById);

  // State transitions
  router.post("/:id/accept", requireCourierRole, orders.accept);
  router.post("/:id/pickup", requireCourierRole, orders.pickup);
  router.post("/:id/complete", requireRequesterRole, orders.complete);
  router.post("/:id/cancel", requireRequesterRole, orders.cancel);

  app.use("/api/orders", router);
};