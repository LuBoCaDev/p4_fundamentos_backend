import createError from 'http-errors'
import Product from '../models/Product.js'

export function index(req, res, next) {
  res.render('new-product')
}

export async function postNew(req, res, next) {
  try {
    const userId = req.session.userId
    const { name, age } = req.body


    const product = new Product({
      name,
      owner: userId,
      price,
      image,
      tags
    })

    await product.save()

    res.redirect('/')
  } catch (err) {
    next(err)
  }
}

export async function deleteProduct(req, res, next) {
  const userId = req.session.userId
  const productId = req.params.productId


  const product = await Product.findOne({ _id: productId })

  if (!product) {
    console.warn(`WARNING - el usuario ${userId} está intentando eliminar un producto inexistente`)
    return next(createError(404, 'Not found'))
  }

  if (product.owner.toString() !== userId) {
    console.warn(`WARNING - el usuario ${userId} está intentando eliminar un producto de otro usuario`)
    return next(createError(401, 'Not authorized'))
  }

  await Product.deleteOne({ _id: productId })

  res.redirect('/')
}

export async function editProduct(req, res, next) {
  const userId = req.session.userId
  const productId = req.params.productId
  const { name, price, image, tags } = req.body

  const product = await Product.findOne({ _id: productId })

  if (!product) {
    console.warn(`WARNING - el usuario ${userId} está intentando editar un producto inexistente`)
    return next(createError(404, 'Not found'))
  }

  if (product.owner.toString() !== userId) {
    console.warn(`WARNING - el usuario ${userId} está intentando editar un producto de otro usuario`)
    return next(createError(401, 'Not authorized'))
  }

  product.name = name
  product.price = price
  product.image = image
  product.tags = tags

  await product.save()

  res.redirect('/')
}