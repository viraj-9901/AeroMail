import { Request, Response } from "express";
import * as OrderService from "../services/order.service";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await OrderService.createOrder(req.body);
  res.status(201).json(new ApiResponse(201, order, "Order created"));
});

export const updateOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await OrderService.updateOrderStatus(
    req.params.id,
    req.body.status,
    req.authUser.email
  );

  res.status(200).json(new ApiResponse(200, order, "Order updated"));
});

export const cancelOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await OrderService.cancelOrder(req.params.id, req.authUser.email);
  res.status(200).json(new ApiResponse(200, order, "Order cancelled"));
});
