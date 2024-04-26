import { Router } from 'express';
import { OrderModel } from '../models/Order';
import { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization } from './verifyToken';

const router = Router();

// ************************** //
// Order Create
// ************************** //

router.post('/', verifyToken, async (req, res) => {
  const newOrder = new OrderModel(req.body);

  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ************************** //
// Order Update
// ************************** //
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true },
    );
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json(error);
  }
});

// ************************** //
// Order Delete
// ************************** //
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    await OrderModel.findByIdAndDelete(req.params.id);
    res.status(200).json('Order has been deleted');
  } catch (err) {
    res.status(500).json(err);
  }
});

// ************************** //
// User orders find
// ************************** //
router.get('/find/:userId', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const userOrders = await OrderModel.find({ userId: req.params.userId });

    res.status(200).json(userOrders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ************************** //
// Orders find
// ************************** //
router.get('/', verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await OrderModel.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ************************** //
// Orders stats
// ************************** //
router.get('/income', verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await OrderModel.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      { $project: { month: { $month: '$createdAt' }, sales: '$amount' } },
      {
        $group: {
          _id: '$month',
          total: { $sum: '$sales' },
        },
      },
    ]);

    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});

export { router };
