import { Order, OrderStatus } from "../models/order.model";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError";
import { orderQueue } from "../config/queue.config";
import { EmailJobData, OrderInput, UserPayload } from '../types/express';

export const createOrder = async (payload: any) => {
  const totalAmount = payload.items.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );

  let order = await Order.create({
    userId: new mongoose.Types.ObjectId(payload.userId),
    items: payload.items,
    totalAmount,
  });

  const jobData: EmailJobData = {
    userEmail: payload.useEmail,
    subject: "Order Confirmation",
    html: `
      <h1>Order Confirmation</h1>
      <p>Your order for ${order.items.length} items has been submitted successfully.</p>
      <p>Order ID: ${order._id}</p>
    `
  }

  await orderQueue.add('sendOrderSubmitEmail', jobData);

  return order;
};

export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus,
  userEmail: string
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

  const jobData: EmailJobData = {
    userEmail: userEmail,
    subject: "Order Status Updated",
    html: `
      <h1>Order Status Updated</h1>
      <p>Your order with ID: ${order._id} has been updated to status: ${order.status}.</p>
    `
  }

  await orderQueue.add('sendOrderStatusUpdateEmail', jobData);

  return order;
};

export const cancelOrder = async (orderId: string, userEmail: string) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.status === OrderStatus.CANCELLED) {
    throw new ApiError(400, "Order already cancelled");
  }

  order.status = OrderStatus.CANCELLED;
  await order.save();

  const jobData: EmailJobData = {
    userEmail: userEmail,
    subject: "Order Cancelled",
    html: ` 
      <h1>Order Cancelled</h1>
      <p>Your order with ID: ${order._id} has been cancelled successfully.</p>
    `
  }

  await orderQueue.add('sendOrderCancellationEmail', jobData);

  return order;
};
