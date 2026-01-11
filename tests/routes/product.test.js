// tests/routes/product.test.js
import request from 'supertest';
import app from '../../server.js';

// Mock auth middleware to bypass authentication for protected routes
jest.mock('../../middleware/auth.js', () => jest.fn((req, res, next) => next()));

// Mock productController functions
jest.mock('../../controllers/productController.js', () => ({
    getProducts: jest.fn((req, res) => res.status(200).json({ products: [] })),
    getProductById: jest.fn((req, res) => res.status(200).json({ id: req.params.id })),
    createProduct: jest.fn((req, res) => res.status(201).json({ message: 'Product created' })),
    updateProduct: jest.fn((req, res) => res.status(200).json({ message: 'Product updated' })),
    deleteProduct: jest.fn((req, res) => res.status(200).json({ message: 'Product deleted' })),
}));

describe('Product routes', () => {
    test('GET /api/products should return product list', async () => {
        const res = await request(app).get('/api/products');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('products');
    });

    test('GET /api/products/:id should return product details', async () => {
        const res = await request(app).get('/api/products/1');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id', '1');
    });

    test('POST /api/products should create product', async () => {
        const res = await request(app)
            .post('/api/products')
            .send({ name: 'Test', price: 10, category: 'cat', stock: 5, description: 'desc' });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('message', 'Product created');
    });

    test('PATCH /api/products/:id should update product', async () => {
        const res = await request(app)
            .patch('/api/products/1')
            .send({ name: 'Updated' });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Product updated');
    });

    test('DELETE /api/products/:id should delete product', async () => {
        const res = await request(app).delete('/api/products/1');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Product deleted');
    });
});
