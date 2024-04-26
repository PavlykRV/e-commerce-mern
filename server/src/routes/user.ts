import { Router } from 'express';
import { verifyTokenAndAdmin, verifyTokenAndAuthorization } from './verifyToken';
import { UserModel } from '../models/User';

const router = Router();

// ************************** //
// User Update
// ************************** //
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC as string).toString();
  }

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true },
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

// ************************** //
// User Delete
// ************************** //
router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    await UserModel.findByIdAndDelete(req.params.id);
    res.status(200).json('User has been deleted');
  } catch (err) {
    res.status(500).json(err);
  }
});

// ************************** //
// User find
// ************************** //
router.get('/find/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const storedUser = await UserModel.findById(req.params.id);

    if (storedUser) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: storedPassword, ...restUser } = storedUser._doc;

      res.status(200).json({ ...restUser });
    } else {
      res.status(200).json('User not exist');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// ************************** //
// Users find
// ************************** //
router.get('/find', verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query ? await UserModel.find().sort({ _id: -1 }).limit(10) : await UserModel.find();

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ************************** //
// User stats
// ************************** //
router.get('/stats', verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();

  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await UserModel.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: '$createdAt' },
        },
      },
      {
        $group: {
          _id: '$month',
          total: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

export { router };
