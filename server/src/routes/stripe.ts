import { Router } from 'express';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_KEY as string);

const router = Router();

router.post('/payment', (req, res) => {
  stripe.charges
    .create({
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: 'usd',
    })
    .then((response) => res.status(200).json(response))
    .catch((err) => res.status(500).json(err));
});

export { router };
