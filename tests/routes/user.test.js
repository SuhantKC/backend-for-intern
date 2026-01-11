// tests/routes/user.test.js
import request from 'supertest';
import app from '../../server.js';
import prisma from '../../db.js';

// Mock auth middleware to bypass authentication
jest.mock('../../middleware/auth.js', () => jest.fn((req, res, next) => {
    req.user = { id: 1 }; // Add mock user for updateMe
    next();
}));

// Mock Prisma client
jest.mock('../../db.js', () => ({
    user: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
    },
}));

describe('User routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('GET /api/users should return users list', async () => {
        prisma.user.findMany.mockResolvedValue([]);
        prisma.user.count.mockResolvedValue(0);

        const res = await request(app).get('/api/users');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body).toHaveProperty('data');
    });

    test('PATCH /api/users/me validation failure - invalid email', async () => {
        const res = await request(app)
            .patch('/api/users/me')
            .send({ email: 'not-an-email' });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.errors).toHaveProperty('email', 'Invalid email address');
    });

    test('PATCH /api/users/me validation failure - short username', async () => {
        const res = await request(app)
            .patch('/api/users/me')
            .send({ username: 'ab' });

        expect(res.status).toBe(400);
        expect(res.body.errors).toHaveProperty('username', 'Username must be at least 3 characters');
    });
});
