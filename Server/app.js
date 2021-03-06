/* eslint-disable import/no-extraneous-dependencies */
import '@babel/polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';
import trimmer from 'express-body-trimmer';
import session from 'express-session';
import Auth from './routes/auth';
import Account from './routes/accounts';
import Transaction from './routes/transactions';
import setPassportMiddleware from './Middleware/passport/strategies';

const app = express();

app.use(cors());

dotenv.config();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(trimmer());
app.use(session({ secret: process.env.SECRET }));
setPassportMiddleware(passport, app);

app.use('/api/v1/auth', Auth);
app.use('/api/v1/accounts', Account);
app.use('/api/v1/transactions', Transaction);

// Home route
app.get('/', (req, res) => res.status(200).send({
  message: 'Welcome To Banka',
}));

app.use((req, res, next) => {
  const error = new Error('You are trying to access a wrong Route');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 400);
  res.json({
    status: 'error',
    error: error.message,
  });
  next();
});


const PORT = process.env.PORT || 3200;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});


export default app;
