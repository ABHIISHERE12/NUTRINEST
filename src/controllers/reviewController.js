const Review = require("../models/Review");
const Product = require("../models/Product");

exports.addReview = async (req, res, next) => {
  try {
    const { rating, text } = req.body;
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      username: req.user.username,
      rating,
      text,
    });
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};

exports.getRecentReviews = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 3;
    const reviews = await Review.find({ product: req.params.id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("username rating text createdAt");
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};
