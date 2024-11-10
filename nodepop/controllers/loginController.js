import User from '../models/User.js'

// Función para renderizar la vista de login
export function index(req, res, next) {
  // Inicializar variables locales para el manejo de errores y email
  res.locals.error = ''
  res.locals.email = ''

  // Renderizar la página de login
  res.render('login')
}

// Función para manejar el post del login
export async function postLogin(req, res, next) {
  try {
    // Extraer email y password del cuerpo de la solicitud
    const { email, password } = req.body

    // Buscar el usuario en la base de datos por el email (en minúsculas)
    const user = await User.findOne({ email: email.toLowerCase() })

    // Comprobar si el usuario no existe o si las credenciales son incorrectas
    if (!user || !(await user.comparePassword(password))) {
      // Establecer mensaje de error y reenviar al formulario de login con los valores ingresados
      res.locals.error = 'Invalid credentials'
      res.locals.email = email
      res.render('login')
      return
    }

    // Si las credenciales son válidas, almacenar el id y nombre de usuario en la sesión
    req.session.userId = user._id
    req.session.userName = user.email

    // Redirigir a la página principal
    res.redirect('/')
  } catch (error) {
    // Manejar cualquier error que ocurra
    next(error)
  }
}

// Función para manejar el logout
export function logout(req, res, next) {
  // Regenerar la sesión para limpiar la información del usuario
  req.session.regenerate(err => {
    if (err) {
      // Si ocurre un error al regenerar la sesión, se pasa al siguiente middleware de error
      return next(err)
    }

    // Redirigir a la página principal después del logout
    res.redirect('/')
  })
}
