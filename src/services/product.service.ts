import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError";
import { Product } from "../models/product.model";

export const createProduct = async (payload: any) => {
    return await Product.create({
        name: payload.name,
        description: payload.description,
        price: payload.price
    });
}

export const listProducts = async() => {
    return await Product.find().lean();
}

export const deleteProduct = async(productId: string) => {
    const product = await Product.deleteOne({
        _id: productId
    });
    if(!product) {
        return null;
    }
    return product;
}