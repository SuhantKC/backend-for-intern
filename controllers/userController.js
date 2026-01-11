import prisma from '../db.js';

export const getUsers = async (req, res, next) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                username: true,
            },
        });
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        next(error);
    }
};

export const updateMe = async (req, res, next) => {
    try {
        const { username, email } = req.body;
        const updatedUser = await prisma.user.update({
            where: { id: req.user.id },
            data: { username, email },
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
