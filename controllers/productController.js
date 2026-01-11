import { z } from 'zod';
import prisma from '../db.js';

const ProductSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    price: z.number({ invalid_type_error: 'Price must be a number' }).positive('Price must be positive'),
    category: z.string().min(1, 'Category is required'),
    stock: z.number({ invalid_type_error: 'Stock must be a number' }).int().min(0, 'Stock cannot be negative'),
    description: z.string().min(1, 'Description is required'),
});

export const getProducts = async (req, res, next) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;
        const take = parseInt(limit);

        const where = search
            ? {
                OR: [
                    { name: { contains: search } },
                    { description: { contains: search } },
                    { category: { contains: search } },
                ],
            }
            : {};

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                skip,
                take,
            }),
            prisma.product.count({ where }),
        ]);

        res.status(200).json({
            success: true,
            data: products,
            pagination: {
                total,
                page: parseInt(page),
                limit: take,
                totalPages: Math.ceil(total / take),
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getProductById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const product = await prisma.product.findUnique({ where: { id } });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        next(error);
    }
};

export const createProduct = async (req, res, next) => {
    try {
        const validatedData = ProductSchema.parse(req.body);

        const product = await prisma.product.create({
            data: validatedData,
        });

        res.status(201).json({ success: true, data: product });
    } catch (error) {
        next(error);
    }
};

export const updateProduct = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const validatedData = ProductSchema.partial().parse(req.body);

        const existing = await prisma.product.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const product = await prisma.product.update({
            where: { id },
            data: validatedData,
        });

        res.status(200).json({ success: true, data: product });
    } catch (error) {
        next(error);
    }
};

export const deleteProduct = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);

        const existing = await prisma.product.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        await prisma.product.delete({ where: { id } });
        res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        next(error);
    }
};
