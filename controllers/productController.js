import prisma from '../db.js';

export const getProducts = async (req, res, next) => {
    try {
        const products = await prisma.product.findMany();
        res.status(200).json({ success: true, data: products });
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
        const { name, price, category, stock, description } = req.body;

        if (!name || price === undefined || !category || stock === undefined || !description) {
            return res.status(400).json({ success: false, message: 'Missing product fields' });
        }

        const product = await prisma.product.create({
            data: { name, price, category, stock, description },
        });

        res.status(201).json({ success: true, data: product });
    } catch (error) {
        next(error);
    }
};

export const updateProduct = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const { name, price, category, stock, description } = req.body;

        const existing = await prisma.product.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const product = await prisma.product.update({
            where: { id },
            data: { name, price, category, stock, description },
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
