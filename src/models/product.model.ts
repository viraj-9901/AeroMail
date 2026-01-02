import mongoose, { Document, Model, Schema } from "mongoose";

interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
}


type IProductModel = Model<IProduct>;
const productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: [0, "Price must be a positive number"],
    },
});

export const Product: IProductModel = mongoose.model<IProduct>("Product", productSchema);