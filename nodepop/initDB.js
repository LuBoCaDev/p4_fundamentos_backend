const mongoose = require('./config/connectMongoose');
const Product = require('./models/Product');
const User = require('./models/User');    // PENDIENTE

const initialUsers = [
    { username: 'usuario1', password: 'password1' },
    { username: 'usuario2', password: 'password2' }
];

const initialProducts = [
    { name: 'Producto 1', owner: null, price: 10, image: 'url1', tags: ['work'] },
    { name: 'Producto 2', owner: null, price: 20, image: 'url2', tags: ['lifestyle'] },
    { name: 'Producto 3', owner: null, price: 30, image: 'url3', tags: ['motor'] },
];

const initDB = async () => {
    try {
        // Aquí borro lois usuarios y productos existentes. AQUÍ ESTÁN LOS deleteManys!!!
        await User.deleteMany({});
        await Product.deleteMany({});

        // Aquí puedo insertar usuarios. AQUÍ ESTÁN LOS insertManys!!
        const users = await User.insertMany(initialUsers);
        console.log('Usuarios iniciales creados:', users);

        // Aqui asigno los propietarios a los productos (por ejemplo, el primer usuario)
        initialProducts.forEach(product => {
            product.owner = users[0]._id; // Asignar el primer usuario como propietario
        });

        // Aquí insertamos productos. AQUÍ ESTÁN LOS insertManys!!
        const products = await Product.insertMany(initialProducts);
        console.log('Productos iniciales creados:', products);

        // Y aquí cerrar la conexión a la base de datos
        mongoose.connection.close();
    } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
    }
};

initDB();