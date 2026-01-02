import { Request, Response } from "express";
import * as ProductService from "../services/product.service";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const createProduct = asyncHandler(async(req: Request, res: Response) => {
    const product = await ProductService.createProduct(req.body);
    res.status(201).json(new ApiResponse(201, product, "Product created"));
})

export const listProducts = asyncHandler(async(req: Request, res: Response) => {
    const products = await ProductService.listProducts();
    res.status(200).json(new ApiResponse(200, products, "Products retrived"));
})

export const deleteProduct = asyncHandler(async(req: Request, res: Response) => {
    let productId = req.params.id;

    if(!productId) {
        return res.status(400).json(new ApiResponse(400, {}, "Product ID is required"));
    }

    const product = await ProductService.deleteProduct(productId);

    product && res.status(200).json(new ApiResponse(200, product, "Product deleted"));
})