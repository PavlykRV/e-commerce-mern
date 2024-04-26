import { Router } from 'express';
import { UserModel } from '../models/User';
import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';

const router = Router();

// ************************** //
// User Registration
// ************************** //
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body || {};

  if (username && email && password) {
    const newUser = new UserModel({
      username,
      email,
      password: CryptoJS.AES.encrypt(password, process.env.PASS_SEC as string).toString(),
    });

    try {
      const registeredUser = await newUser.save();
      if (registeredUser) {
        res.status(200).json(registeredUser);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
});

// ************************** //
// User Login
// ************************** //
router.post('/login', async (req, res) => {
  const { username, password } = req.body || {};
  let encodedPassword = '';

  try {
    const storedUser = await UserModel.findOne({ username });

    if (storedUser) {
      encodedPassword = CryptoJS.AES.decrypt(storedUser?.password, process.env.PASS_SEC as string).toString(
        CryptoJS.enc.Utf8,
      );
    }

    if (storedUser && password === encodedPassword) {
      const accessToken = jwt.sign(
        {
          id: storedUser._id,
          isAdmin: storedUser.isAdmin,
        },
        process.env.JWT_SEC as string,
        { expiresIn: '3d' },
      );

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: storedPassword, ...restUser } = storedUser._doc;

      res.status(200).json({ ...restUser, accessToken });
      return;
    }

    res.status(401).json('Wrong credentials!');
  } catch (error) {
    res.status(500).json(error);
  }
});

export { router };
