// tests/routes/index.test.js
import request from 'supertest';
import app from '../../server.js';

// Mock authController functions
jest.mock('../../controllers/authController.js', () => ({
    register: jest.fn((req, res) => res.status(201).json({ message: 'User registered' })),
    login: jest.fn((req, res) => res.status(200).json({ token: 'dummy-token' })),
}));

describe('Index routes', () => {
    test('GET /api/health should return status ok', async () => {
        const res = await request(app).get('/api/health');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('status', 'ok');
    });

    test('POST /api/register should return 201', async () => {
        const res = await request(app)
            .post('/api/register')
            .send({ email: 'test@example.com', username: 'test', password: 'pass' });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('message', 'User registered');
    });

    test('POST /api/login should return 200 with token', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({ username: 'test', password: 'pass' });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token', 'dummy-token');
    });
});
