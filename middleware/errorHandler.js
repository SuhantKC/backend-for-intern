import { ZodError } from 'zod';

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    if (err instanceof ZodError) {
        const errors = {};
        err.errors.forEach((e) => {
            const path = e.path.join('.');
            errors[path] = e.message;
        });

        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors,
        });
    }

    res.status(500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
};

export default errorHandler;
