import IAuth from "../../models/auth.model"

declare global {
    namespace Express {
        interface Request {
            authUser?: IAuth;
        }
    }
}

export { };

export interface UserPayload {
  email: string;
  userId: string;
}

export interface CreateUserInput {
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface ProductInput {
  name: string;
  price: number;
  description?: string;
}

export interface OrderItemInput {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface OrderInput {
  userId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  status: OrderStatus;
}

export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  DELIVERED = "DELIVERED"
}

export interface ReturnInput {
  orderId: string;
  reason: string;
}

export interface EmailJobData {
  userEmail: string;
  subject: string;
  html: string;
}