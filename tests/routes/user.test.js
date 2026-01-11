// tests/routes/user.test.js
import request from 'supertest';
import app from '../../server.js';

// Mock auth middleware to bypass authentication
jest.mock('../../middleware/auth.js', () => jest.fn((req, res, next) => next()));

// Mock userController functions
jest.mock('../../controllers/userController.js', () => ({
    getUsers: jest.fn((req, res) => res.status(200).json({ users: [] })),
    updateMe: jest.fn((req, res) => res.status(200).json({ message: 'Profile updated' })),
    deleteUser: jest.fn((req, res) => res.status(200).json({ message: 'User deleted' })),
}));

describe('User routes', () => {
    test('GET /api/users should return users list', async () => {
        const res = await request(app).get('/api/users');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('users');
    });

    test('PATCH /api/users/me should update profile', async () => {
        const res = await request(app)
            .patch('/api/users/me')
            .send({ username: 'newname' });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Profile updated');
    });

    test('DELETE /api/users/1 should delete user', async () => {
        const res = await request(app).delete('/api/users/1');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'User deleted');
    });
});
