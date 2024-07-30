const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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

// no need for it to be in another table so it remains just a schema
module.exports.OrderItemSchema = OrderItemSchema;

const OrderSchema = new Schema({
  customer: {
    type: Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  status: {
    type: String,
    enum: ["Created", "Confirmed", "Canceled", "Delivered", "Completed"],
    required: true,
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
    ref: "OrderItemSchema",
  },
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
