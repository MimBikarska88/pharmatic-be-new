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
  //const session = await mongoose.startSession();
  //session.startTransaction();
  try {
    const newOrder = new Order();
    const items = [];
    console.log(Cart);
    for (const item of Cart) {
      const id = item._id;
      const exists = await PharmaceuticalProduct.findById(id);
      if (!exists) {
        throw new Error(`There's no such product as ${item.medicationName}`);
      } else {
        const cartQuantity = item.quantity;
        if (cartQuantity > exists.quantity) {
          throw new Error(
            `Only ${exists.quantity} pieces of ${item.medicationName} are available`
          );
        }
        exists.quantity -= cartQuantity;
        await exists.save();
        const orderItem = new OrderItem({
          product: item._id,
          quantity: cartQuantity,
        });
        const savedOrderItem = await orderItem.save();
        items.push(savedOrderItem._id);
      }
    }

    newOrder.customer = customerId;
    newOrder.items = items;
    newOrder.createdOn = Date.now();
    newOrder.status = OrderStatusEnum.Created;
    newOrder.number = getRandomNumber(ORDER_DIGITS);
    const created = await newOrder.save();
    //await session.commitTransaction();
    return created;
  } catch (err) {
    console.log(err);
    //await session.abortTransaction();
    throw new Error("Order processing failed");
  } /*finally {
    await session.endSession();
  } */
};

const getDetailedOrdersForCustomer = async (customerId) => {
  const customer = await Customer.findById(customerId);
  if (!customer) {
    throw new Error("Such customer does not exist");
  }
  const orders = await Order.$where(
    (customer) => customer.toString() === customerId
  )
    .populate({
      path: "items",
      populate: {
        path: "product",
      },
    })
    .lean();
  return orders;
};
module.exports = {
  processOrder,
  getDetailedOrdersForCustomer,
};
