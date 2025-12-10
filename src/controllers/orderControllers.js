const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const razorpay = require("../utils/razorpayHelper");
const crypto = require("crypto");

exports.createOrder = async (req, res, next) => {
  try {
    const {
      paymentMethod,
      address,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = req.body;
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    // calculate total
    let total = 0;
    const items = cart.items.map((i) => {
      const price = i.product.price;
      total += price * i.quantity;
      return {
        product: i.product._id,
        quantity: i.quantity,
        priceAtPurchase: price,
      };
    });

    // If RAZORPAY, create server-side order or verify payment
    if (paymentMethod === "RAZORPAY") {
      // If the frontend already created order and returned payment details to server for verification:
      if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
        // create a razorpay order and return it -> frontend should complete payment
        const order = await razorpay.orders.create({
          amount: Math.round(total * 100),
          currency: "INR",
          receipt: `rcpt_${Date.now()}`,
          payment_capture: 1,
        });
        return res.json({ razorpayOrder: order, total });
      } else {
        // verify signature
        const generatedSignature = crypto
          .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
          .update(`${razorpayOrderId}|${razorpayPaymentId}`)
          .digest("hex");
        if (generatedSignature !== razorpaySignature) {
          return res
            .status(400)
            .json({ message: "Payment verification failed" });
        }
      }
    }

    // create order
    const newOrder = await Order.create({
      user: req.user._id,
      items,
      address,
      paymentMethod,
      paymentResult:
        paymentMethod === "RAZORPAY"
          ? { razorpayPaymentId, razorpayOrderId }
          : {},
      totalAmount: total,
      status: paymentMethod === "RAZORPAY" ? "paid" : "pending",
    });

    // clear cart
    await Cart.findOneAndDelete({ user: req.user._id });

    res.status(201).json(newOrder);
  } catch (err) {
    next(err);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};
