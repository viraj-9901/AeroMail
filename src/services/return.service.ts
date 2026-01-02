import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError";
import { ReturnRequest } from "../models/return_request.model";
import { EmailJobData, OrderInput, UserPayload } from '../types/express';
import { returnQueue } from "../config/queue.config";

export const submitReturn = async (payload: any) => {
    let returnRequest = await ReturnRequest.create({
        orderId: new mongoose.Types.ObjectId(payload.orderId),
        reason: payload.reason,
        userId: new mongoose.Types.ObjectId(payload.userId),
        collected: false
    });

    const jobData: EmailJobData = {
        userEmail: payload.userEmail,
        subject: `Return Request Submitted: ${returnRequest._id}`,
        html: `
            <h1>Return Request Received</h1>
            <p>Your return request for order ${payload.orderId} has been submitted.</p>
            <p>Reason: ${payload.reason}</p>
            <p>We will process it shortly.</p>
        `
    }

    await returnQueue.add('sendReturnSubmitEmail', jobData);

    return returnRequest;
}

export const collectReturn = async (returnId: string, userEmail: string) => {
    const returnRequest = await ReturnRequest.updateOne({_id: returnId}, { collected: true });

    if(!returnRequest) {
        throw new ApiError(404, "Return request not found");
    }

    const jobData: EmailJobData = {
        userEmail: userEmail,
        subject: `Return Collected: ${returnId}`,
        html: ` 
            <h1>Return Processed!</h1>
            <p>Your return #${returnId} has been collected and processed.</p>
            <p>Refund will be initiated within 3-5 business days.</p>
        `
    }

    await returnQueue.add('sendReturnCollectedEmail', jobData);

    return returnRequest;
}