const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const autho = require("../../auth/check-auth");
const OrdersControllers = require("../controllers/orders_controller");

router.get("/", autho, OrdersControllers.orders_get_all);

router.delete("/:orderId", autho, OrdersControllers.orders_delete_order);

module.exports = router;
