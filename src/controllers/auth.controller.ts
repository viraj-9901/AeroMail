import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import * as AuthService from "../services/auth.service";

const cookieOptions = {
  httpOnly: true,
  secure: true,
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const user = await AuthService.registerUser(req.body);

  res
    .status(201)
    .json(new ApiResponse(201, { user }, "User registered successfully"));
});

export const registerAdmin = asyncHandler(async (req: Request, res: Response) => {
  const user = await AuthService.registerAdmin(req.body);
  res
    .status(201)
    .json(new ApiResponse(201, { user }, "Admin registered successfully"));
})

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { loginIdentifier, password } = req.body;

  const { user, accessToken, refreshToken } =
    await AuthService.loginUser(loginIdentifier, password, {
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

  res
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  if (req.authUser?._id) {
    await AuthService.logoutUser(req.authUser._id);
  }

  res
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out"));
});

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    await AuthService.forgotPassword(req.body.email);

    res
      .status(200)
      .json(new ApiResponse(200, {}, "Reset token sent"));
  }
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, resetToken, password } = req.body;

    await AuthService.resetPassword(email, resetToken, password);

    res
      .status(200)
      .json(new ApiResponse(200, {}, "Password reset successful"));
  }
);

export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const token =
      req.cookies.refreshToken || req.body.refreshToken;

    const { accessToken, refreshToken } =
      await AuthService.refreshAccessToken(token, {
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      });

    res
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .status(200)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Token refreshed"
        )
      );
  }
);
