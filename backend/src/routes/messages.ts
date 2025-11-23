import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Messages endpoint' });
});

export default router;