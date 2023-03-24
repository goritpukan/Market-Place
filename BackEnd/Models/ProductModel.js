const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String },
  cost: { type: Number },
  currency: { type: String },
  description: { type: String },
  city: { type: String },
  photos: { type: String, default: "" },
  category: { type: String },
  owner: { type: String },
  ownerID: { type: String }
});
const Product = mongoose.model('Product', productSchema);

module.exports = Product;