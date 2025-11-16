import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middlewares/aurhMiddleware.js";
import { requireAdmin } from "../middlewares/roleMiddleware.js";

const prisma = new PrismaClient();
const router = express.Router();

router.use(authMiddleware);

/* ----------------------- CREATE ORDER ----------------------- */
router.post("/orderitems", async (req, res) => {
  const userId = req.userId;

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true }
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Validate stock availability
    for (const item of cartItems) {
      if (item.quantity > item.product.stock) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${item.product.title}. Available: ${item.product.stock}, Requested: ${item.quantity}` 
        });
      }
    }

    // calculate total amount
    const total = cartItems.reduce((acc, item) => {
      return acc + item.product.price * item.quantity;
    }, 0);

    const order = await prisma.order.create({
      data: {
        userId,
        total,
        orderItems: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity
          }))
        }
      },
      include: { 
        orderItems: {
          include: { product: true }
        }
      }
    });

    await prisma.cartItem.deleteMany({ where: { userId } });

    return res.status(201).json({
      message: "Order placed",
      order
    });
  } catch (error) {
    console.error("Create order error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

/* ----------------------- GET USER ORDERS ----------------------- */
router.get("/orderitems", async (req, res) => {
  const userId = req.userId;

  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: {
            product: true
          }
        }
      }
    });

    return res.status(200).json({ orders });
  } catch (error) {
    console.error("Get orders error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

/* ----------------------- UPDATE ORDER STATUS (ADMIN) ----------------------- */
router.put("/order/:id/status", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatus = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];

  if (!validStatus.includes(status)) {
    return res.status(400).json({ message: "Invalid order status" });
  }

  try {
    const order = await prisma.order.findUnique({ where: { id } });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status }
    });

    return res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder
    });
  } catch (error) {
    console.error("Order status update error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/* ----------------------- CANCEL ORDER ----------------------- */
router.put("/order/:id/cancel", async (req, res) => {
  const { id } = req.params;

  try {
    const order = await prisma.order.findUnique({ where: { id } });

    if (!order || order.userId !== req.userId) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "PENDING") {
      return res
        .status(400)
        .json({ message: "Only pending orders can be cancelled" });
    }

    const cancelledOrder = await prisma.order.update({
      where: { id },
      data: { status: "CANCELLED" }
    });

    return res.status(200).json({
      message: "Order cancelled",
      order: cancelledOrder
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

/* ----------------------- GET ORDER DETAILS ----------------------- */
router.get("/order/:id", async (req, res) => {
  const orderId = req.params.id;

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: { product: true }
        },
        user: true
      }
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const items = order.orderItems.map((item) => ({
      product: {
        id: item.product.id,
        title: item.product.title,
        price: item.product.price,
        imageUrl: item.product.imageUrl
      },
      quantity: item.quantity,
      price: item.product.price,
      subtotal: item.product.price * item.quantity
    }));

    return res.status(200).json({
      id: order.id,
      status: order.status,
      total: order.total,
      createdAt: order.createdAt,
      items
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
