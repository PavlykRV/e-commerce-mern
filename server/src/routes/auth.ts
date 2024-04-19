import { Router } from 'express';
import { UserModel } from '../models/User';

const router = Router();

router.post('/register', (req, res) => {
  const newUser = new UserModel({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });

  console.log('newUser:', newUser);
  res.send(JSON.stringify(newUser));
});

export { router };
