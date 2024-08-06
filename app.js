// Imports
const express = require('express');
const createError = require('http-errors');
const morgan = require('morgan');
const path = require('path');
const expressLayout = require('express-ejs-layouts');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
require('dotenv').config();

// Routers
const indexRouter = require('./routes/index');

// Set up the app and import routers
const app = express();
const port = process.env.PORT || 3000;

// Set up view engine and template
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayout);

// Public folder
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// Set up middleware
app.use(methodOverride('_method'));
app.use(morgan('dev'));

// TODO Deployment middleware

// Connect to the database
mongoose.set('strictQuery', false);

const mongoDB = process.env.MONGODB_URI;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
  console.log('Successfully connected to db');
}

const limiter = rateLimit({
  windowsMs: 1 * 60 * 100,
  max: 20,
});

// Call limiter
app.use(limiter);

// Routes
app.use('/', indexRouter);

// Password validation for deleting
const SYSTEM_PASSWORD = process.env.SYSTEM_PASSWORD;

app.post('/check-password', (req, res) => {
  const { password } = req.body;
  if (password === SYSTEM_PASSWORD) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handling
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

// Listen
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
