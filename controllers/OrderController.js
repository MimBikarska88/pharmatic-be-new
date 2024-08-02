const {
  processOrder,
  getDetailedOrdersForCustomer,
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
      const id = req.user.id;
      const orders = await getDetailedOrdersForCustomer(id);
      return res.status(200).json({ orders: orders });
    },
  },
};
