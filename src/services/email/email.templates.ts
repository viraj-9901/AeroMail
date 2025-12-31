import { EmailType } from "./email.types";

export const EmailTemplates: Record<
  EmailType,
  (data: any) => { subject: string; html: string }
> = {
  [EmailType.USER_REGISTERED]: (data) => ({
    subject: "Welcome to Our Platform 🎉",
    html: `
      <h2>Welcome, ${data.name}</h2>
      <p>Your account has been successfully created.</p>
      <p>We’re excited to have you on board.</p>
    `,
  }),

  [EmailType.ORDER_PLACED]: (data) => ({
    subject: `Order Confirmed – #${data.orderId}`,
    html: `
      <h2>Order Placed Successfully</h2>
      <p>Hi ${data.name},</p>
      <p>Your order <strong>#${data.orderId}</strong> has been placed.</p>
      <p>Total Amount: ₹${data.totalAmount}</p>
    `,
  }),

  [EmailType.ORDER_DELIVERED]: (data) => ({
    subject: `Order Delivered – #${data.orderId}`,
    html: `
      <h2>Order Delivered 🚚</h2>
      <p>Hi ${data.name},</p>
      <p>Your order <strong>#${data.orderId}</strong> has been delivered.</p>
      <p>We hope you enjoy your purchase!</p>
    `,
  }),
};
