const { Customer } = require("../models/Customer");
const { populate } = require("../models/MedicationClass");
const { OrderItem, OrderStatusEnum, Order } = require("../models/Order");
const { PharmaceuticalProduct } = require("../models/PharmaceuticalProduct");
const { Vendor } = require("../models/Vendor");
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
  const custId = new mongoose.Types.ObjectId(customerId);
  console.log(custId);
  let orders = await Order.find({ customer: custId })
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

const getOrderById = async (customerId, orderId) => {
  console.log(customerId);
  console.log(orderId);
  const customer = await Customer.findById(customerId);
  if (!customer) {
    throw new Error("Customer doesn't exist");
  }
  const order = await Order.findOne({ number: orderId })
    .populate({ path: "customer", select: ["phoneNumber", "detailedAddress"] })
    .populate({
      path: "items",
      populate: {
        path: "product",
        populate: {
          path: "vendor",
          select: "companyName",
        },
      },
    })
    .lean();
  if (!order) {
    throw Error("Order not found!");
  }
  if (order.customer._id.toString() !== customerId) {
    throw Error("Not authorized to view order details!");
  }
  return {
    ...order,
    items: order.items.map((item) => {
      return { ...item.product, quantity: item.quantity };
    }),
  };
};

const changeOrderStatus = async (orderId, customerId, newOrderStatus) => {
  const customer = await Customer.findById(customerId);
  if (!customer) {
    throw Error("Customer doesn't exist");
  }
  const order = await Order.findById(orderId);
  if (!order) {
    throw Error("Order does not exist");
  }
  if (order.status === OrderStatusEnum.Canceled) {
    throw Error("Order is cancelled already and its status can't be changed!");
  }
  if (
    order.status === OrderStatusEnum.Created &&
    ![OrderStatusEnum.Canceled, OrderStatusEnum.Created].includes(
      newOrderStatus
    )
  ) {
    throw Error(
      "Order status must be changed from created to confirmed first!"
    );
  }
  if (
    order.status === OrderStatusEnum.Confirmed &&
    ![OrderStatusEnum.Canceled, OrderStatusEnum.Delivered].includes(
      newOrderStatus
    )
  ) {
    throw Error(
      "Order status can be changed from confirmed to delivered or canceled ONLY!"
    );
  }
  if (
    order.status === OrderStatusEnum.Delivered &&
    newOrderStatus !== OrderStatusEnum.Completed
  ) {
    throw Error(
      "Order status can be changed from delivered to completed ONLY!"
    );
  }
  if (newOrderStatus === OrderStatusEnum.Confirmed) {
    order.status = newOrderStatus;
    order.confirmedOn = Date.now();
  }
  if (newOrderStatus === OrderStatusEnum.Canceled) {
    order.status = newOrderStatus;
    order.canceledOn = Date.now();
  }
  if (newOrderStatus === OrderStatusEnum.Delivered) {
    order.status = newOrderStatus;
    order.deliveredOn = Date.now();
  }
  if (newOrderStatus === OrderStatusEnum.Completed) {
    order.status = newOrderStatus;
    order.canceledOn = Date.now();
  }
  const updatedOrder = await order.save();
  return updatedOrder;
};

const getAllOrderForVendor = async (vendorId) => {
  const existing = await Vendor.findById(vendorId);
  if (!existing) throw Error("Such vendor doesn't exist");
  const vendorObjectId = new mongoose.Types.ObjectId(vendorId);

  const pipeline = [];
  pipeline.push({
    $lookup: {
      from: "orderitems",
      localField: "items",
      foreignField: "_id",
      as: "newItems",
      pipeline: [
        {
          $lookup: {
            from: "pharmaceuticalproducts",
            localField: "product",
            foreignField: "_id",
            as: "productInfo",
          },
        },
        {
          $unwind: { path: "$productInfo" },
        },
        {
          $match: {
            "productInfo.vendor": vendorObjectId,
          },
        },
        {
          $project: {
            productInfo: 1,
          },
        },
      ],
    },
  });
  pipeline.push({
    $replaceRoot: {
      newRoot: {
        $mergeObjects: [{ $arrayElemAt: ["$newItems", 0] }, "$$ROOT"],
      },
    },
  });
  pipeline.push({
    $project: {
      createdOn: 1,
      number: 1,
      status: 1,
      newItems: 1,
    },
  });
  const results = await Order.aggregate(pipeline).exec();
  return results.filter((order) => order.newItems.length > 0);
};
const getOrderByIdForVendor = async (orderNumber, vendorId) => {
  const existing = await Vendor.findById(vendorId);
  if (!existing) throw Error("Such vendor doesn't exist");

  const pipeline = [];
  const vendorObjectId = new mongoose.Types.ObjectId(vendorId);

  pipeline.push({
    $match: {
      number: Number(orderNumber),
    },
  });
  pipeline.push({
    $lookup: {
      from: "customers",
      localField: "customer",
      foreignField: "_id",
      as: "customerInfo",
    },
  });
  pipeline.push({ $unwind: { path: "$customerInfo" } });
  pipeline.push({
    $lookup: {
      from: "orderitems",
      localField: "items",
      foreignField: "_id",
      as: "newItems",
      pipeline: [
        {
          $lookup: {
            from: "pharmaceuticalproducts",
            localField: "product",
            foreignField: "_id",
            as: "productInfo",
          },
        },
        {
          $unwind: { path: "$productInfo" },
        },
        {
          $match: {
            "productInfo.vendor": vendorObjectId,
          },
        },
        {
          $project: {
            productInfo: 1,
            quantity: 1,
          },
        },
      ],
    },
  });
  pipeline.push({
    $replaceRoot: {
      newRoot: {
        $mergeObjects: [{ $arrayElemAt: ["$newItems", 0] }, "$$ROOT"],
      },
    },
  });
  pipeline.push({
    $project: {
      createdOn: 1,
      number: 1,
      status: 1,
      newItems: 1,
      "customerInfo._id": 1,
      "customerInfo.detailedAddress": 1,
      "customerInfo.phoneNumber": 1,
    },
  });
  const orders = await Order.aggregate(pipeline).exec();
  if (orders.length > 0) {
    const { newItems, customerInfo, ...rest } = orders[0];
    return {
      ...rest,
      items: newItems.map((item) => ({
        quantity: item.quantity,
        ...item.productInfo,
      })),
      customer: customerInfo,
    };
  } else {
    return null;
  }
};
module.exports = {
  processOrder,
  getDetailedOrdersForCustomer,
  getOrderById,
  changeOrderStatus,
  getAllOrderForVendor,
  getOrderByIdForVendor,
};
