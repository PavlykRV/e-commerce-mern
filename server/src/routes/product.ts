import { Router } from 'express';
import { verifyTokenAndAdmin } from './verifyToken';
import { ProductModel } from '../models/Product';

const router = Router();

// ************************** //
// Product Create
// ************************** //

router.post('/', verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new ProductModel(req.body);

  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ************************** //
// Product Update
// ************************** //
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true },
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json(error);
  }
});

// ************************** //
// Product Delete
// ************************** //
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    await ProductModel.findByIdAndDelete(req.params.id);
    res.status(200).json('Product has been deleted');
  } catch (err) {
    res.status(500).json(err);
  }
});

// ************************** //
// Product find
// ************************** //
router.get('/find/:id', async (req, res) => {
  try {
    const storedProduct = await ProductModel.findById(req.params.id);

    res.status(200).json(storedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ************************** //
// Products find
// ************************** //
router.get('/find', async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;

    if (qNew) {
      products = await ProductModel.find().sort({ createdAt: -1 }).limit(5);
    } else if (qCategory) {
      products = await ProductModel.find({ categories: { $in: [qCategory] } });
    } else {
      products = await ProductModel.find();
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

export { router };
