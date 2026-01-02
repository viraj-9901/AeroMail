import { Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import * as ReturnService from "../services/return.service";

export const submitReturn = asyncHandler(async (req: Request, res: Response) => {
    const returnRequest = await ReturnService.submitReturn(req.body);
    res.status(201).json(new ApiResponse(201, returnRequest, "Return request submitted"));
});

export const collectReturn = asyncHandler(async (req: Request, res: Response) => {
    const returnRequest = await ReturnService.collectReturn(req.params.id, req.authUser.email);
    res.status(200).json(new ApiResponse(200, returnRequest, "Return collected"));
})