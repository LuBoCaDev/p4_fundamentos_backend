// Importa mongoose y bcrypt para manejar el esquema y la encriptación de contraseñas
import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'

// Define el esquema de usuario
const userSchema = new Schema({
	// El campo 'email' debe ser único
	email: { type: String, unique: true },
	// El campo 'password' guarda la contraseña del usuario
	password: String
})

// Método estático para encriptar la contraseña
// Este método se usa cuando se crea o modifica una contraseña
userSchema.statics.hashPassword = function(clearPassword) {
	return bcrypt.hash(clearPassword, 7) // 7 es el número de rondas de encriptación
}

// Método de instancia para comparar la contraseña proporcionada con la almacenada
// Se usa cuando el usuario intenta iniciar sesión
userSchema.methods.comparePassword = function(clearPassword) {
	return bcrypt.compare(clearPassword, this.password)
}

// Crea y exporta el modelo de usuario basado en el esquema definido
const User = mongoose.model('User', userSchema)

// Exporta el modelo para su uso en otras partes de la aplicación
export default User