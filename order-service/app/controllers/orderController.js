const orderService = require("../services/orderService");

exports.create = async (req, res) => {
  const order = await orderService.createOrder(req.user, req.body);
  res.status(201).json(order);
};

exports.getById = async (req, res) => {
  res.json(await orderService.getOrder(req.user, req.params.id));
};

exports.getAll = async (req, res) => {
  res.json(await orderService.listOrders(req.user, req.query));
};

exports.accept = async (req, res) => {
  res.json(await orderService.accept(req.user, req.params.id));
};

exports.pickup = async (req, res) => {
  res.json(await orderService.pickup(req.user, req.params.id));
};

exports.complete = async (req, res) => {
  res.json(await orderService.complete(req.user, req.params.id));
};

exports.cancel = async (req, res) => {
  res.json(await orderService.cancel(req.user, req.params.id));
};