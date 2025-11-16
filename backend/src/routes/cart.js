import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middlewares/aurhMiddleware.js";

const prisma = new PrismaClient();
const router = express.Router();

router.use(authMiddleware);

/* ----------------------- ADD TO CART ----------------------- */
router.post("/cart", async (req, res) => {
    const userId = req.userId;
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
        return res.status(400).json({ message: "Invalid input" });
    }

    try {
        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (quantity > product.stock) {
            return res.status(400).json({ message: "Requested quantity exceeds stock" });
        }

        const existingCartItem = await prisma.cartItem.findFirst({
            where: { userId, productId }
        });

        if (existingCartItem) {
            const newQty = existingCartItem.quantity + quantity;

            if (newQty > product.stock) {
                return res.status(400).json({ message: "Quantity exceeds available stock" });
            }

            const updateItem = await prisma.cartItem.update({
                where: { id: existingCartItem.id },
                data: { quantity: newQty },
            });

            return res.json({ cartItem: updateItem });
        }

        const newCartItem = await prisma.cartItem.create({
            data: { userId, productId, quantity }
        });

        return res.status(201).json({ cartItem: newCartItem });

    } catch (error) {
        console.error("Add to cart failed:", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
});


/* ----------------------- GET ALL CART ITEMS ----------------------- */
router.get("/cart", async (req, res) => {
    const userId = req.userId;

    try {
        const cartItems = await prisma.cartItem.findMany({
            where: { userId },
            include: { product: true }
        });

        const formattedItems = cartItems.map(item => ({
            id: item.id,
            quantity: item.quantity,
            totalPrice: item.product.price * item.quantity,
            product: {
                id: item.product.id,
                title: item.product.title,
                price: item.product.price,
                imageUrl: item.product.imageUrl
            }
        }));

        return res.status(200).json({ cartItems: formattedItems });
    } catch (error) {
        console.error("Get cart failed:", error);
        return res.status(500).json({ message: "Server error" });
    }
});


/* ----------------------- GET ONE CART ITEM ----------------------- */
router.get("/cart/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const cartItem = await prisma.cartItem.findUnique({
            where: { id },
            include: { product: true }
        });

        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        const totalPrice = cartItem.product.price * cartItem.quantity;

        return res.status(200).json({
            id: cartItem.id,
            quantity: cartItem.quantity,
            totalPrice,
            product: {
                id: cartItem.product.id,
                title: cartItem.product.title,
                price: cartItem.product.price,
                imageUrl: cartItem.product.imageUrl
            }
        });
    } catch (error) {
        console.error("Get single cart error:", error);
        return res.status(500).json({ message: "Server error" });
    }
});


/* ----------------------- UPDATE QUANTITY ----------------------- */
router.put("/cart/:id", async (req, res) => {
    const id = req.params.id;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
        return res.status(400).json({ message: "Invalid quantity" });
    }

    try {
        const existingCartItem = await prisma.cartItem.findUnique({
            where: { id },
            include: { product: true }
        });

        if (!existingCartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        if (quantity > existingCartItem.product.stock) {
            return res.status(400).json({ message: "Quantity exceeds stock" });
        }

        const updatedCartItem = await prisma.cartItem.update({
            where: { id },
            data: { quantity }
        });

        return res.status(200).json({
            message: "Cart item updated",
            cartItem: updatedCartItem
        });

    } catch (error) {
        console.error("Update cart error:", error);
        return res.status(500).json({ message: "Server error" });
    }
});


/* ----------------------- DELETE CART ITEM ----------------------- */
router.delete("/cart/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const existingCartItem = await prisma.cartItem.findUnique({ where: { id } });

        if (!existingCartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        await prisma.cartItem.delete({ where: { id } });

        return res.status(200).json({ message: "Cart item deleted successfully" });
    } catch (error) {
        console.error("Delete cart error:", error);
        return res.status(500).json({ message: "Server error" });
    }
});

export default router;
