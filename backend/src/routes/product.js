import express from "express";
import { PrismaClient } from "@prisma/client";
import { productSchema } from "../middlewares/ValidateUser.js";
import { authMiddleware } from "../middlewares/aurhMiddleware.js";
import { requireAdmin } from "../middlewares/roleMiddleware.js";

const prisma = new PrismaClient();
const router = express.Router();

/* ------------------ GET SINGLE PRODUCT ------------------ */
router.get("/product/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        imageUrl: true,
        stock: true,
        Category: true,
        createdAt: true,
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Product item not found" });
    }

    return res.status(200).json({ product });
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

/* ------------------ GET ALL PRODUCTS ------------------ */
router.get("/products", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        imageUrl: true,
        stock: true,
        Category: true,
      },
    });

    return res.json({ products });
  } catch (error) {
    console.error("PROBULK ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

/* ------------------ AUTH REQUIRED BELOW ------------------ */
router.use(authMiddleware);

/* ------------------ ADD PRODUCT (ADMIN ONLY) ------------------ */
router.post("/product", requireAdmin, async (req, res) => {
  try {
    const parsed = productSchema.safeParse(req.body);

    if (!parsed.success) {
      return res
        .status(403)
        .json({ message: "Invalid inputs", errors: parsed.error.flatten() });
    }

    const { title, price, stock, description, imageUrl, Category } = parsed.data;

    const product = await prisma.product.create({
      data: {
        title,
        description,
        price,
        imageUrl,
        stock,
        Category,
      },
    });

    return res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("POST PRODUCT ERROR:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});


/* ------------------ UPDATE PRODUCT ------------------ */
router.put("/product/:id", requireAdmin, async (req, res) => {
  const id = req.params.id;

  try {
    const parsed = productSchema.partial().safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: parsed.error.flatten(),
      });
    }

    const exists = await prisma.product.findUnique({ where: { id } });

    if (!exists) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: parsed.data,
    });

    return res.status(200).json({
      message: "Product updated successfully",
      product: updated,
    });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/* ------------------ DELETE PRODUCT ------------------ */
router.delete("/product/:id", requireAdmin, async (req, res) => {
  const id = req.params.id;

  try {
    const exists = await prisma.product.findUnique({
      where: { id },
    });

    if (!exists) {
      return res.status(404).json({ message: "Product not found" });
    }

    await prisma.product.delete({ where: { id } });

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
