const { Customer } = require("../models/Customer");
const { OrderItem, OrderStatusEnum, Order } = require("../models/Order");
const { PharmaceuticalProduct } = require("../models/PharmaceuticalProduct");
const { getRandomNumber } = require("../utils/utils");
const mongoose = require("mongoose");
const ORDER_DIGITS = 8;
const processOrder = async (req, customerId) => {
  const customer = await Customer.findById(customerId);
  if (!customer) {
    throw new Error("Such customer does not exist");
  }
  const { Cart } = req.body;
  const newOrder = new Order();
  const items = [];
  for (const item of Cart) {
    const id = item._id;
    const exists = await PharmaceuticalProduct.findById(id);
    if (!exists) {
      throw Error(`There's no such product as ${item.medicationName}`);
    } else {
      const cartQuantity = item.quantity;
      if (cartQuantity > exists.stock) {
        throw Error(
          `Only ${exists.stock} pieces of ${exists.medicationName} are available`
        );
      }
      try {
        exists.stock -= cartQuantity;
        await exists.save();

        const orderItem = new OrderItem({
          product: item._id,
          quantity: cartQuantity,
        });
        const savedOrderItem = await orderItem.save();
        items.push(savedOrderItem._id);
      } catch (err) {
        throw Error("Order processing failed");
      }
    }
  }

  try {
    newOrder.customer = customerId;
    newOrder.items = items;
    newOrder.createdOn = Date.now();
    newOrder.status = OrderStatusEnum.Created;
    newOrder.number = getRandomNumber(ORDER_DIGITS);
    const created = await newOrder.save();
    return created;
  } catch (err) {
    throw Error("Order processing failed");
  }
};

const getDetailedOrdersForCustomer = async (customerId) => {
  const customer = await Customer.findById(customerId);
  if (!customer) {
    throw new Error("Such customer does not exist");
  }
  let orders = await Order.$where(
    (customer) => customer.toString() === customerId
  )
    .populate({
      path: "items",
      populate: {
        path: "product",
      },
    })
    .sort({ createdOn: -1 })
    .lean();
  // might be redundant to have all products
  orders = orders.map((order) => ({
    ...order,
    createdOn: order.createdOn ? order.createdOn.toLocaleString() : null,
    confirmedOn: order.confirmedOn
      ? order.confirmedOn.toLocaleDateString()
      : null,
    deliveredOn: order.deliveredOn
      ? order.deliveredOn.toLocaleDateString()
      : null,
    completedOn: order.completedOn
      ? order.completedOn.toLocaleDateString()
      : null,
    items: order.items.map((item) => ({
      quantity: item.quantity,
      ...item.product,
    })),
  }));
  return orders;
};
module.exports = {
  processOrder,
  getDetailedOrdersForCustomer,
};
