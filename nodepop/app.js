import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import connectMongoose from './config/connectMongoose.js';  // Importación de un default export
import * as loginController from './controllers/loginController.js';
import * as productsController from './controllers/productsController.js';
import * as homeController from './controllers/homeController.js';
import * as sessionManager from './config/sessionManager.js';
import usersRouter from './routes/users.js'; // Importación de usersRouter

// Conectamos a MongoDB antes de iniciar el servidor
await connectMongoose();
console.log('Conectado a MongoDB.');

const app = express();

// Configuración de la vista
app.set('views', path.join(path.resolve(), 'views'));
app.set('view engine', 'ejs');

// Middleware para pasar appName a todas las vistas
app.use((req, res, next) => {
  res.locals.appName = 'Nodepop';  // Aquí definimos la variable global
  next();
});

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(path.resolve(), 'public')));

// Middlewares de sesión
app.use(sessionManager.middleware); 
app.use(sessionManager.useSessionInViews); 

// Rutas públicas
app.get('/', homeController.index);  // Usamos el controlador de home para la ruta '/'
app.get('/login', loginController.index);
app.post('/login', loginController.postLogin);
app.use('/users', usersRouter);  // Esta línea está correctamente definida

// Rutas privadas
app.get('/product/new', sessionManager.isLoggedIn, productsController.index);
app.post('/product/new', sessionManager.isLoggedIn, productsController.postNew);

app.all('/logout', loginController.logout);

// Catch 404 y manejador de errores
app.use((req, res, next) => {
  next(createError(404));
});

// Manejo de errores
app.use((err, req, res, next) => {
  // Errores de validación
  if (err.array) {
    err.message = 'Invalid request: ' + err.array()
      .map(e => `${e.location} ${e.type} ${e.path} ${e.msg}`)
      .join(', ');
    err.status = 422;
  }

  res.status(err.status || 500);

  // Set locals para mostrar el error solo en desarrollo
  res.locals.message = err.message;
  res.locals.error = process.env.NODEAPP_ENV === 'development' ? err : {};

  // Renderizar la vista de error
  res.render('error');
});

export default app;
