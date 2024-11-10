// Importa mongoose para interactuar con la base de datos MongoDB
import mongoose from 'mongoose'

// Escucha los errores de conexión con la base de datos
mongoose.connection.on('error', (err) => {
  // Muestra el error de conexión en la consola
  console.log('Error de conexión', err)
})

// Función para establecer la conexión con MongoDB
export default function connectMongoose() {
  // Realiza la conexión a MongoDB en la dirección local (127.0.0.1) y la base de datos 'nodepop'
  return mongoose.connect('mongodb://127.0.0.1:27017/nodepop')
    .then((mongoose) => {
      // Retorna la conexión una vez establecida
      return mongoose.connection
    })
}