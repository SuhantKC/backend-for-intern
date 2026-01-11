// tests/routes/product.test.js
import request from 'supertest';
import app from '../../server.js';
import prisma from '../../db.js';

// Mock auth middleware to bypass authentication for protected routes
jest.mock('../../middleware/auth.js', () => jest.fn((req, res, next) => next()));

// Mock Prisma client
jest.mock('../../db.js', () => ({
    product: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
    },
}));

describe('Product routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('GET /api/products should return product list', async () => {
        prisma.product.findMany.mockResolvedValue([]);
        prisma.product.count.mockResolvedValue(0);

        const res = await request(app).get('/api/products');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body).toHaveProperty('data');
    });

    test('POST /api/products should create product', async () => {
        const productData = { name: 'Test', price: 10, category: 'cat', stock: 5, description: 'desc' };
        prisma.product.create.mockResolvedValue({ id: 1, ...productData });

        const res = await request(app)
            .post('/api/products')
            .send(productData);
        expect(res.status).toBe(201);
        expect(res.body.data).toHaveProperty('id');
    });

    test('POST /api/products validation failure - invalid price', async () => {
        const res = await request(app)
            .post('/api/products')
            .send({ name: 'Test', price: 'invalid', category: 'cat', stock: 5, description: 'desc' });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.errors).toHaveProperty('price');
        expect(res.body.errors.price).toMatch(/Price must be a number|expected number/);
    });

    test('PATCH /api/products/:id validation failure - negative stock', async () => {
        prisma.product.findUnique.mockResolvedValue({ id: 1 });

        const res = await request(app)
            .patch('/api/products/1')
            .send({ stock: -1 });

        expect(res.status).toBe(400);
        expect(res.body.errors).toHaveProperty('stock', 'Stock cannot be negative');
    });
});
