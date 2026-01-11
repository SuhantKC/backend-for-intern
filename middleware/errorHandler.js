import { ZodError } from 'zod';

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    if (err instanceof ZodError || err.name === 'ZodError' || err.constructor.name === 'ZodError' || (Array.isArray(err.issues) || Array.isArray(err.errors))) {
        const errors = {};
        const issues = err.issues || err.errors || [];
        issues.forEach((e) => {
            const path = e.path ? e.path.join('.') : 'unknown';
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
