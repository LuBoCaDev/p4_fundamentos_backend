import readline from 'node:readline';
import connectMongoose from './lib/connectMongoose.js';
import Product from './models/Product.js';
import User from './models/User.js';

// Conexión a MongoDB
const connection = await connectMongoose();
console.log('Connected to MongoDB:', connection.name);

// Preguntar al usuario si desea vaciar la base de datos y crear datos iniciales
const questionResponse = await ask('Are you sure you want to empty the database and create initial data?');
if (questionResponse.toLowerCase() !== 'yes') {
  console.log('Operation aborted.');
  process.exit();
}

// Inicializar usuarios y productos
await initUsers();
await initProducts();

// Cerrar la conexión a la base de datos
connection.close();

// Función para inicializar productos
async function initProducts() {
  // Eliminar todos los productos
  const deleteResult = await Product.deleteMany();
  console.log(`Deleted ${deleteResult.deletedCount} products.`);

  // Buscar usuarios iniciales
  const [admin, user1] = await Promise.all([
    User.findOne({ email: 'admin@example.com' }),
    User.findOne({ email: 'user1@example.com' }),
  ]);

  // Crear productos iniciales
  const insertResult = await Product.insertMany([
    { 
      name: 'Bolígrafo', 
      owner: admin._id, 
      price: 10, 
      image: 'https://media.latiendadelmaestro.es/product/boligrafo-bic-cristal-azul-800x800_kEy63ge.jpg', 
      tags: ['work'] 
    },
    { 
      name: 'Deportivas', 
      owner: admin._id, 
      price: 20, 
      image: 'https://www.lidl.es/media/product/0/0/3/9/8/4/6/zapatillas-deportivas-para-hombre-zoom--5.jpg', 
      tags: ['lifestyle'] 
    },
    { 
      name: 'Casco', 
      owner: admin._id, 
      price: 30, 
      image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSmsDDYv98sw0YdRg5NqDRgdpVtqq5Pfj5t9BNEaFsVVkjXDSD1VRTsFBNA541kHedZS5bAGqEmAOgd5NC5fIsCSg79BC92-vatoJhnYkSmFydftva1gdrVTA', 
      tags: ['motor'] 
    },
    { 
      name: 'Teléfono', 
      owner: admin._id, 
      price: 30, 
      image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/refurb-iphone-13-pro-max-graphite-2023?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1679072989055', 
      tags: ['mobile'] 
    },
  ]);

  console.log(`Created ${insertResult.length} products.`);
}

// Función para inicializar usuarios
async function initUsers() {
  // Eliminar todos los usuarios
  const deleteResult = await User.deleteMany();
  console.log(`Deleted ${deleteResult.deletedCount} users.`);

  // Crear usuarios iniciales
  const insertResult = await User.insertMany([
    { email: 'admin@example.com', password: await User.hashPassword('1234') },
    { email: 'user1@example.com', password: await User.hashPassword('1234') },
  ]);
  console.log(`Created ${insertResult.length} users.`);
}

// Función para hacer preguntas al usuario desde la consola
function ask(questionText) {
  return new Promise((resolve, reject) => {
    const consoleInterface = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    // Realizar la pregunta y devolver la respuesta
    consoleInterface.question(questionText, answer => {
      consoleInterface.close();
      resolve(answer);
    });
  });
}