const express = require('express');

const router = express.Router();

const {newOrder,getSingleOrder,myOrders,getAllOrders}=require('../controllers/orderController');

const { isAuthenticatedUser, authorizedRoles } = require("../middlewares/user");

router.route("/order/new").post(isAuthenticatedUser, newOrder);
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);
router.route("/order/me").get(isAuthenticatedUser, myOrders);
router.route("admin/order/").get(isAuthenticatedUser, authorizedRoles('admin'),getAllOrders);


module.exports = router;