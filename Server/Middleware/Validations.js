import { signup, signIn } from '../helper/validationRules';
import { validate } from '../helper/helper';

export const validateSignup = (req, res, next) => {
  const {
    email,
    firstName,
    lastName,
    password,
    type,
  } = req.body;

  const data = {
    firstName,
    lastName,
    email,
    password,
    type,
  };

  validate(data, signup, res, next);
};

export const validateSignIn = (req, res, next) => {
  const {
    email,
    password,
  } = req.body;

  const data = {
    email,
    password,
  };

  validate(data, signIn, res, next);
};
