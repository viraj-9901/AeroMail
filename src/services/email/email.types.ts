export enum EmailType {
  USER_REGISTERED = "USER_REGISTERED",
  ORDER_PLACED = "ORDER_PLACED",
  ORDER_DELIVERED = "ORDER_DELIVERED",
}

export interface SendEmailPayload {
  to: string;
  type: EmailType;
  data: Record<string, any>;
}
