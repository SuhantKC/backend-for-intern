import { z } from 'zod';
import prisma from '../db.js';

const UserUpdateSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters').optional(),
    email: z.string().email('Invalid email address').optional(),
});

export const getUsers = async (req, res, next) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;
        const take = parseInt(limit);

        const where = search
            ? {
                OR: [
                    { username: { contains: search } },
                    { email: { contains: search } },
                ],
            }
            : {};

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take,
                select: {
                    id: true,
                    email: true,
                    username: true,
                },
            }),
            prisma.user.count({ where }),
        ]);

        res.status(200).json({
            success: true,
            data: users,
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

export const updateMe = async (req, res, next) => {
    try {
        const validatedData = UserUpdateSchema.parse(req.body);
        const updatedUser = await prisma.user.update({
            where: { id: req.user.id },
            data: validatedData,
            select: {
                id: true,
                email: true,
                username: true,
            },
        });
        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);

        if (id === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'You cannot delete your own account via this route.',
            });
        }

        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        await prisma.user.delete({ where: { id } });
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
};
