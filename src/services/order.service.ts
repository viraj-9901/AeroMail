import { Order, OrderStatus } from "../models/order.model";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError";

export const createOrder = async (payload: any) => {
  const totalAmount = payload.items.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );

  return await Order.create({
    userId: new mongoose.Types.ObjectId(payload.userId),
    items: payload.items,
    totalAmount,
  });
};

export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus
) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.status === OrderStatus.CANCELLED) {
    throw new ApiError(400, "Cancelled order cannot be updated");
  }

  order.status = status;
  await order.save();

  return order;
};

export const cancelOrder = async (orderId: string) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.status === OrderStatus.CANCELLED) {
    throw new ApiError(400, "Order already cancelled");
  }

  order.status = OrderStatus.CANCELLED;
  await order.save();

  return order;
};
