import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import connectMongoose from './config/connectMongoose.js';
import * as loginController from './controllers/loginController.js';
import * as productsController from './controllers/productsController.js';

import * as sessionManager from './bin/sessionManager.js';

await connectMongoose();
console.log('Conectado a MongoDB.');

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';

const app = express();

// Configuración de la vista
app.set('views', path.join(path.resolve(), 'views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(path.resolve(), 'public')));

// Middlewares de sesión
app.use(sessionManager.middleware, sessionManager.useSessionInViews);

// Rutas públicas
app.get('/', indexRouter.index);
app.get('/login', loginController.index);
app.post('/login', loginController.postLogin);
app.use('/users', usersRouter);

// Rutas privadas (agregar lógica de autenticación si es necesario)
app.get('/product/new', sessionManager.isLoggedIn, productsController.index)
app.get('/product/new', sessionManager.isLoggedIn, productsController.postNew)

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