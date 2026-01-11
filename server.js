import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import errorHandler from './middleware/errorHandler.js';
import routes from './routes/index.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './config/swagger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/api', routes);

// Global Error Handler
app.use(errorHandler);

// Export app for testing
export default app;

// Start server only when not in test mode
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
