import express from 'express'
import createError from 'http-errors'
import logger from 'morgan'
import connectMongoose from './lib/connectMongoose.js'
import * as sessionManager from './lib/sessionManager.js'
import * as homeController from './controllers/homeController.js'
import * as loginController from './controllers/loginController.js'
import * as productsController from './controllers/productsController.js'

await connectMongoose()
console.log('Conectado a MongoDB.')

const app = express()

app.locals.appName = 'Nodepop'

app.set('views', 'views')
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))

app.use(sessionManager.middleware, sessionManager.useSessionInViews)

app.get('/', homeController.index)
app.get('/login', loginController.index)
app.post('/login', loginController.postLogin)
app.all('/logout', loginController.logout)

app.get('/products/new', sessionManager.isLoggedIn, productsController.index)
app.post('/products/new', sessionManager.isLoggedIn, productsController.postNew)
app.get('/products/delete/:productId', sessionManager.isLoggedIn, productsController.deleteProduct)

app.get('/param_in_route/:num?', homeController.paranInRouteExample)
app.get('/param_in_route_multiple/:product/size/:size([0-9]+)/color/:color',
  homeController.paranInRouteMultipleExample
)
app.get('/param_in_query', homeController.paramInQuery)
app.post('/create-example', homeController.createExample)
app.get('/validate-query-example',
  homeController.validateQueryExampleValidations,
  homeController.validateQueryExample
)

app.use((req, res, next) => {
  next(createError(404))
})

app.use((err, req, res, next) => {

  if (err.array) {
    err.message = 'Invalid request: ' + err.array()
      .map(e => `${e.location} ${e.type} ${e.path} ${e.msg}`)
      .join(', ')
    err.status = 422
  }

  res.status(err.status || 500)

  res.locals.message = err.message
  res.locals.error = process.env.NODEPOP_ENV === 'development' ? err : {}

  res.render('error')
})

export default app