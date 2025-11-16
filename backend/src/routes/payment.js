import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middlewares/aurhMiddleware.js";

const prisma = new PrismaClient();
const router = express.Router();
router.use(authMiddleware);

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

/* ------------------ CREATE PAYMENT ORDER ------------------ */
router.post("/create", async (req, res) => {
  const { orderId } = req.body;
  const userId = req.userId;

  try {
    // Check order exists and belongs to user
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true }
    });

    if (!order || order.userId !== userId) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if order is already paid
    if (order.status !== "PENDING") {
      return res.status(400).json({ message: "Order is already processed" });
    }

    // Check if payment already exists
    if (order.payment) {
      return res.status(400).json({ message: "Payment already initiated for this order" });
    }

    // Create Razorpay Order
    const options = {
      amount: order.total * 100, // Razorpay works in paise
      currency: "INR",
      receipt: orderId
    };

    const razorpayOrder = await razorpay.orders.create(options);

    return res.status(200).json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency
    });
  } catch (error) {
    console.error("Create Razorpay order Error:", error);
    res.status(500).json({ message: "Payment creation failed" });
  }
});

/* ------------------ VERIFY PAYMENT ------------------ */
router.post("/verify", async (req, res) => {
  const { 
    orderId, 
    razorpay_order_id, 
    razorpay_payment_id, 
    razorpay_signature 
  } = req.body;

  try {
    // Signature check
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    // Check if order exists and is still pending
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { 
        orderItems: {
          include: { product: true }
        },
        payment: true
      }
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "PENDING") {
      return res.status(400).json({ message: "Order is already processed" });
    }

    // Check if payment already exists
    if (order.payment) {
      return res.status(400).json({ message: "Payment already processed for this order" });
    }

    // Re-validate stock availability before reducing
    for (const item of order.orderItems) {
      if (item.quantity > item.product.stock) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${item.product.title}. Available: ${item.product.stock}, Required: ${item.quantity}` 
        });
      }
    }

    // Save payment details in Payment table
    const payment = await prisma.payment.create({
      data: {
        orderId: orderId,
        amount: order.total,
        method: "CARD", // Razorpay auto-detects but we store generic type
        status: "SUCCESS",
        transactionId: razorpay_payment_id
      }
    });

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: "PAID" }
    });

    // Reduce stock
    for (const item of order.orderItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: { decrement: item.quantity }
        }
      });
    }

    return res.status(200).json({
      message: "Payment verified & order confirmed",
      payment,
      order: updatedOrder
    });

  } catch (error) {
    console.error("Payment verification error:", error);
    return res.status(500).json({ message: "Payment verification failed" });
  }
});

export default router;
