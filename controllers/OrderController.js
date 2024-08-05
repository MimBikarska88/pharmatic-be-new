const {
  processOrder,
  getDetailedOrdersForCustomer,
  getOrderById,
  changeOrderStatus,
} = require("../services/OrderService");

module.exports = {
  OrderController: {
    createOrder: async (req, res) => {
      const customerId = req.user.id;
      if (!customerId) {
        return res.status(401).json({ Message: "Not authorized" });
      }
      try {
        const order = await processOrder(req, customerId);
        return res.status(200).json(order);
      } catch (err) {
        return res.status(500).json({ Message: err.message });
      }
    },
    getOrdersByCustomer: async (req, res) => {
      console.log("here getORDERS BY CUSTOMER");
      const id = req.user.id;
      console.log(id);
      const orders = await getDetailedOrdersForCustomer(id);
      return res.status(200).json({ orders: orders });
    },
    getCustomerOrderById: async (req, res) => {
      console.log("here GET CUSTOMER DETAILED ORDER");

      const customerId = req.user.id;
      const orderId = req.params.orderId;
      try {
        const order = await getOrderById(customerId, orderId);
        return res.status(200).json({ order });
      } catch (err) {
        return res.status(500).json({ Message: err.message });
      }
    },
    changeOrderStatus: async (req, res) => {
      const id = req.user.id;
      if (!id) {
        return res.status(401).json({ Message: "Not authorized" });
      }
      try {
        const updatedOrder = await changeOrderStatus(
          req.params.orderId,
          id,
          req.body.status
        );
        return res.status(200).json({ updatedOrder });
      } catch (err) {
        return res.status(500).json({ Message: err.message });
      }
    },
  },
};
