const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");

const OrderItemSchema = new Schema({
  product: {
    type: Types.ObjectId,
    ref: "PharmaceuticalProduct",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});
const OrderItem = mongoose.model("OrderItem", OrderItemSchema);

const OrderStatusEnum = {
  Created: 1,
  Confirmed: 2,
  Canceled: 3,
  Delivered: 4,
  Completed: 5,
};
Object.freeze(OrderStatusEnum);

// no need for it to be in another table so it remains just a schema
module.exports.OrderItemSchema = OrderItemSchema;

const OrderSchema = new Schema({
  customer: {
    type: Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  status: {
    type: Number,
    enum: Object.values(OrderStatusEnum),
    required: true,
  },
  number: {
    type: Number,
    required: true,
    unique: true,
  },
  createdOn: {
    type: Date,
    default: null,
  },
  confirmedOn: {
    type: Date,
    default: null,
  },
  canceledOn: {
    type: Date,
    default: null,
  },
  deliveredOn: {
    type: Date,
    default: null,
  },
  completedOn: {
    type: Date,
    default: null,
  },
  items: {
    type: [Types.ObjectId],
    ref: "OrderItem",
  },
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = { Order, OrderStatusEnum, OrderItem };
