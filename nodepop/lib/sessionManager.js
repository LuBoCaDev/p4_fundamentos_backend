// Importar las dependencias necesarias
import session from 'express-session';
import MongoStore from 'connect-mongo';

// Definir la constante para el tiempo de expiración de la sesión por inactividad (2 días)
const INACTIVITY_EXPIRATION_2_DAYS = 1000 * 60 * 60 * 24 * 2;

/**
 * Middleware para gestionar las sesiones del usuario
 * Configura la sesión usando express-session y conecta la sesión a MongoDB
 */
export const middleware = session({
  // Nombre de la cookie de la sesión
  name: 'nodepop-session',
  
  // Secreto para la firma de la cookie (se recomienda un valor más seguro en producción)
  secret: 'kasdu7ads76sd76ds76ds765ds765dsf',
  
  // Indica si se debe guardar una sesión nueva cuando no se haya modificado
  saveUninitialized: true,
  
  // Indica si se debe volver a guardar la sesión aunque no haya cambios
  resave: false,
  
  // Configurar las cookies con el tiempo máximo de inactividad
  cookie: { maxAge: INACTIVITY_EXPIRATION_2_DAYS },
  
  // Configurar el almacenamiento de la sesión en MongoDB
  store: MongoStore.create({
    mongoUrl: 'mongodb://127.0.0.1:27017/nodepop', // URL de la base de datos MongoDB
  }),
});

/**
 * Middleware para hacer la sesión accesible en las vistas
 * Se asigna la sesión a la variable locals de la respuesta
 */
export function useSessionInViews(req, res, next) {
  res.locals.session = req.session; // Hacer la sesión accesible en las vistas
  next(); // Continuar con la siguiente función de middleware
}

/**
 * Middleware para verificar si el usuario está autenticado
 * Si no está autenticado, redirige a la página de login
 */
export function isLoggedIn(req, res, next) {
  // Si no existe un userId en la sesión, redirigir al login
  if (!req.session.userId) {
    res.redirect('/login');
    return; // Detener la ejecución del middleware
  }
  
  // Si el usuario está autenticado, continuar con el siguiente middleware
  next();
}
