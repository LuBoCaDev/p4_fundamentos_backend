// Importando mongoose y el objeto Schema de mongoose para definir el esquema del modelo
import mongoose, { Schema } from 'mongoose';

// Definición del esquema para el modelo de Producto
const productSchema = new mongoose.Schema(
  {
    // Nombre del producto, requerido y de tipo cadena
    name: {
      type: String,
      required: true,
    },
    
    // Propietario del producto, referenciando el modelo 'User', requerido
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    
    // Precio del producto, requerido y de tipo numérico
    price: {
      type: Number,
      required: true,
    },
    
    // Imagen asociada al producto, de tipo cadena y requerida
    image: {
      type: String,
      required: true,
    },
    
    // Etiquetas relacionadas con el producto, es un arreglo de cadenas
    tags: {
      type: [String],
    },
  }
);

// Creación del modelo Product a partir del esquema definido
const Product = mongoose.model('Product', productSchema);

// Exportando el modelo para poder utilizarlo en otras partes de la aplicación
export default Product;