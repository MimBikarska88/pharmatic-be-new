const {
  processOrder,
  getDetailedOrdersForCustomer,
  getOrderById,
  changeOrderStatus,
  getAllOrderForVendor,
  getOrderByIdForVendor,
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
    getOrderById: async (req, res) => {
      const Id = req.user.id;
      const role = req.params.role;
      const orderId = req.params.orderId;
      try {
        if (role === "customer") {
          const order = await getOrderById(Id, orderId);
          return res.status(200).json({ order });
        }
        if (role === "vendor") {
          const order = await getOrderByIdForVendor(orderId, Id);
          return res.status(200).json({ order });
        }
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
    getAllOrdersByVendor: async (req, res) => {
      try {
        const vendorId = req.user.id;
        const orders = await getAllOrderForVendor(vendorId);
        return res.status(200).json({ orders });
      } catch (err) {
        return res.status(500).json({ Message: err.message });
      }
    },
  },
};
