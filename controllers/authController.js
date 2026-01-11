import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../db.js';

const RegisterSchema = z.object({
    email: z.string().email('Invalid email address'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const register = async (req, res, next) => {
    try {
        const { email, username, password } = RegisterSchema.parse(req.body);

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
            },
        });

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        res.status(201).json({
            success: true,
            data: { id: user.id, username: user.username, email: user.email, token },
        });
    } catch (error) {
        next(error);
    }
};

const LoginSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
});

export const login = async (req, res, next) => {
    try {
        const { username, password } = LoginSchema.parse(req.body);

        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        res.status(200).json({
            success: true,
            data: { id: user.id, username: user.username, email: user.email, token },
        });
    } catch (error) {
        next(error);
    }
};
