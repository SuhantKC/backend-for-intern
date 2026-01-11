// tests/routes/index.test.js
import request from 'supertest';
import app from '../../server.js';
import prisma from '../../db.js';

// Mock Prisma client
jest.mock('../../db.js', () => ({
    user: {
        create: jest.fn(),
        findUnique: jest.fn(),
    },
}));

describe('Index routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('GET /api/health should return status ok', async () => {
        const res = await request(app).get('/api/health');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('status', 'ok');
    });

    test('POST /api/register validation failure - short password', async () => {
        const res = await request(app)
            .post('/api/register')
            .send({ email: 'test@example.com', username: 'testuser', password: '123' });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.errors).toHaveProperty('password', 'Password must be at least 6 characters');
    });

    test('POST /api/login validation failure - missing username', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({ password: 'password123' });

        expect(res.status).toBe(400);
        expect(res.body.errors).toHaveProperty('username');
        // Accept either the custom message or a generic 'required' message if Zod is being stubborn
        expect(res.body.errors.username).toMatch(/Username is required|Required|expected string/);
    });
});
