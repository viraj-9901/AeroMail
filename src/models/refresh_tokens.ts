import mongoose, { Schema } from "mongoose";

const refreshTokensSchema = new Schema({
    authUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth",
        required: [true, 'Auth User ID is required'],
        index: true
    },
    refreshToken: {
        type: String
    },
    ipAddress: {
        type: String,
        trim: true
    },
    userAgent: {
        type: String,
        trim: true
    },
    expiredAt: {
        type: Date,
        required: [true, 'Expiration date is required'],
        index: true
    }

}, { timestamps: true });

refreshTokensSchema.index({ authUserId: 1, refreshToken: 1 });

export const RefreshTokens = mongoose.model("RefreshTokens", refreshTokensSchema);
