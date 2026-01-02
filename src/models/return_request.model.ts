import mongoose, { Schema, Document, Model } from "mongoose";

interface IReturnRequest extends Document {
    orderId: mongoose.Types.ObjectId;
    reason: string;
    userId: mongoose.Types.ObjectId;
    collected: boolean;
}

type IReturnRequestModel = Model<IReturnRequest>;

const returnRequestSchema = new Schema({
    orderId: {
        type: Schema.Types.ObjectId,
        ref: "Order",
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    collected: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export const ReturnRequest: IReturnRequestModel = mongoose.model<IReturnRequest>("ReturnRequest", returnRequestSchema);