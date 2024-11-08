import User from '../models/User.js';

export function index(req, res, next) {
    res.locals.error = '';
    res.locals.email = '';
    res.render('login');
}

export async function postLogin(req, res, next) {
    try {
        const { email, password } = req.body;

        // Buscamos el usuario en la base de datos
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user || !(await user.comparePassword(password))) {
            res.locals.error = 'Invalid credentials';
            res.locals.email = email;
            return res.render('login');
        }

        // Si las credenciales son correctas, se crea la sesión
        req.session.userId = user._id;
        req.session.userName = user.email;

        // Log para verificar que la sesión se crea correctamente
        console.log('Session after login:', req.session); // Verifica la sesión

        res.redirect('/');
    } catch (error) {
        next(error);
    }
}

export function logout(req, res, next) {
    req.session.regenerate(err => {
        if (err) return next(err);
        res.redirect('/');
    });
}
