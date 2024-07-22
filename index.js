const path = require ('path');
const express = require ('express');
const dotenv = require ('dotenv');
const morgan = require ('morgan');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const mongoose = require('mongoose');

const ApiError = require('./utils/apiError');
const globalError = require('./middlewares/errorMiddleware');
const mountRoutes = require('./routes');
const { webhookCheckout } = require('./services/orderService');

// Define the database URI
const DB_URI = 'mongodb+srv://hussin74:hh01027804627hh@cluster0.bprakii.mongodb.net/udemy-ecommerce?retryWrites=true&w=majority&appName=Cluster0';

// Connect with db
mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('DB connection successful'))
  .catch((err) => console.error('DB connection error:', err));

// Update Mongoose to use the updated version's features
mongoose.set('strictQuery', true);

// express app
const app = express();

// Enable other domains to access your application
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 
};

app.use(cors(corsOptions));

// compress all responses
app.use(compression());

// Checkout webhook
app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  webhookCheckout
);

// Middlewares
app.use(express.json({ limit: '20kb' }));
app.use(express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Limit each IP to 100 requests per window (here, per 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message:
    'Too many accounts created from this IP, please try again after an hour',
});

// Apply the rate limiting middleware to all requests
app.use('/api', limiter);

// Middleware to protect against HTTP Parameter Pollution attacks
app.use(
  hpp({
    whitelist: [
      'price',
      'sold',
      'quantity',
      'ratingsAverage',
      'ratingsQuantity',
    ],
  })
);

// Mount Routes
mountRoutes(app);

// Handle root requests
app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

app.all('*', (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global error handling middleware for express
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App running running on port ${PORT}`);
});

// Handle rejection outside express
process.on('unhandledRejection', (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});
