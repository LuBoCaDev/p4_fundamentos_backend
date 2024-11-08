import mongoose, { Schema } from 'mongoose'

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  tags: { type: [String] }
},)

const Product = mongoose.model('Product', productSchema)

export default Product
