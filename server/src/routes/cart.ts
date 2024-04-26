import { Router } from 'express';
import { CartModel } from '../models/Cart';
import { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization } from './verifyToken';

const router = Router();

// ************************** //
// Cart Create
// ************************** //

router.post('/', verifyToken, async (req, res) => {
  const newCart = new CartModel(req.body);

  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ************************** //
// Cart Update
// ************************** //
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart = await CartModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true },
    );
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json(error);
  }
});

// ************************** //
// Cart Delete
// ************************** //
router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    await CartModel.findByIdAndDelete(req.params.id);
    res.status(200).json('Cart has been deleted');
  } catch (err) {
    res.status(500).json(err);
  }
});

// ************************** //
// Cart find
// ************************** //
router.get('/find/:userId', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const userCart = await CartModel.findOne({ userId: req.params.userId });

    res.status(200).json(userCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ************************** //
// Carts find
// ************************** //
router.get('/', verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await CartModel.find();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});

export { router };
