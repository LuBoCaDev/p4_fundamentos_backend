// Importación de módulos
import express from 'express'
import createError from 'http-errors'
import logger from 'morgan'
import connectMongoose from './lib/connectMongoose.js'
import * as sessionManager from './lib/sessionManager.js'
import * as homeController from './controllers/homeController.js'
import * as loginController from './controllers/loginController.js'
import * as productsController from './controllers/productsController.js'

// Conexión a la base de datos MongoDB
await connectMongoose()
console.log('Conectado a MongoDB.')

// Inicialización de la aplicación Express
const app = express()

// Establecer propiedades locales para la aplicación
app.locals.appName = 'Nodepop'

// Configuración de las vistas y motor de plantillas (EJS)
app.set('views', 'views')
app.set('view engine', 'ejs')

// Middleware para registrar solicitudes HTTP
app.use(logger('dev'))

// Middleware para procesar datos JSON y URL encoded
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Middleware para archivos estáticos (imágenes, estilos, scripts)
app.use(express.static('public'))

// Gestión de sesiones
app.use(sessionManager.middleware, sessionManager.useSessionInViews)

// Rutas principales de la aplicación
app.get('/', homeController.index)                         // Ruta para la página principal
app.get('/login', loginController.index)                   // Ruta para la página de inicio de sesión
app.post('/login', loginController.postLogin)              // Ruta para procesar el inicio de sesión
app.all('/logout', loginController.logout)                 // Ruta para cerrar sesión

// Rutas protegidas por sesión para la gestión de productos
app.get('/products', sessionManager.isLoggedIn, productsController.listProducts) // Listar productos
app.get('/products/new', sessionManager.isLoggedIn, productsController.index)  // Página para crear un nuevo producto
app.post('/products/new', sessionManager.isLoggedIn, productsController.postNew) // Crear un nuevo producto
app.get('/products/delete/:productId', sessionManager.isLoggedIn, productsController.deleteProduct) // Eliminar producto

// Rutas con parámetros en la URL
app.get('/param_in_route/:num?', homeController.paranInRouteExample) // Ejemplo de parámetro opcional en ruta
app.get('/param_in_route_multiple/:product/size/:size([0-9]+)/color/:color', 
  homeController.paranInRouteMultipleExample // Ejemplo de múltiples parámetros con validaciones
)

// Ruta con parámetros en la query string
app.get('/param_in_query', homeController.paramInQuery) // Ejemplo de parámetros en la query string
app.post('/create-example', homeController.createExample) // Ejemplo de creación de recurso

// Ruta para validar query string con validaciones
app.get('/validate-query-example', 
  homeController.validateQueryExampleValidations, // Validación de la query
  homeController.validateQueryExample // Procesamiento después de la validación
)

// Middleware para manejar errores 404 (ruta no encontrada)
app.use((req, res, next) => {
  next(createError(404)) // Si no se encuentra la ruta, se pasa el error 404
})

// Middleware para manejo global de errores
app.use((err, req, res, next) => {
  // Si el error contiene validaciones, procesarlas
  if (err.array) {
    err.message = 'Invalid request: ' + err.array()
      .map(e => `${e.location} ${e.type} ${e.path} ${e.msg}`)
      .join(', ') // Formatear el mensaje de error con detalles
    err.status = 422 // Establecer el código de estado para error de validación
  }

  // Establecer el estado de la respuesta
  res.status(err.status || 500)

  // Proveer el mensaje de error y la información del error (solo en desarrollo)
  res.locals.message = err.message
  res.locals.error = process.env.NODEPOP_ENV === 'development' ? err : {}

  // Renderizar la vista de error
  res.render('error')
})

// Exportar la aplicación para ser utilizada en otros archivos
export default app
