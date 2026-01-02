import mongoose, { Document, Model, Schema } from "mongoose";
import { config } from "../config/env";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import type { StringValue } from 'ms';

interface IAuthBase {
    email: string;
    emailVerified: boolean;
    password: string;
    status: string;
    role: string;
    lastLoginAt?: Date;
    loginAttempts: number;
    lockUntil?: Date;
    resetToken?: string;
    resetTokenExpiry?: Date;
}

export interface IAuth extends IAuthBase, Document {
    comparePassword(password: string): Promise<boolean>;
    generateAccessToken(): string;
    generateRefreshToken(): string;
}

type IAuthModel = Model<IAuth>;

const authSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        minLength: [6, "Password must be at least 6 characters long"],
        required: true
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    lastLoginAt: {
        type: Date,
        default: null
    },
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: {
        type: Date,
        default: null
    },

}, { timestamps: true })

authSchema.index({ email: 1, status: 1 });

authSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});

authSchema.methods.comparePassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
}

authSchema.methods.generateAccessToken = function () {
    return Jwt.sign(
        {
            _id: this._id.toString(),
            email: this.email,
            referenceNumber: this.referenceNumber
        },
        config.ACCESS_TOKEN_SECRET,
        {
            expiresIn: config.ACCESS_TOKEN_EXPIRY as StringValue
        }
    )
}

authSchema.methods.generateRefreshToken = function () {
    return Jwt.sign(
        {
            _id: this._id,
            email: this.email,
            referenceNumber: this.referenceNumber
        },
        config.REFRESH_TOKEN_SECRET,
        {
            expiresIn: config.REFRESH_TOKEN_EXPIRY as StringValue
        }
    )
}

export const Auth: IAuthModel = mongoose.model<IAuth>("Auth", authSchema);