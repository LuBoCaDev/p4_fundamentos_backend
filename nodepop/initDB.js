import readline from 'node:readline';
import mongoose from './config/connectMongoose.js';
import Product from './models/Product.js';
import User from './models/User.js';

const ask = (questionText) => {
	return new Promise((resolve) => {
		const consoleInterface = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		});
		consoleInterface.question(questionText, answer => {
			consoleInterface.close();
			resolve(answer);
		});
	});
};

const initUsers = async () => {
	const deleteResult = await User.deleteMany();
	console.log(`Deleted ${deleteResult.deletedCount} users.`);

	const insertResult = await User.insertMany([
		{ email: 'user1@example.com'.toLowerCase(), password: await User.hashPassword('1234') },
		{ email: 'user2@example.com'.toLowerCase(), password: await User.hashPassword('1234') },
	]);	
	console.log(`Created ${insertResult.length} users.`);
};

const initProducts = async () => {
	const users = await User.find({});

	const initialProducts = [
		{ name: 'Producto 1', owner: users[0]._id, price: 10, image: '', tags: ['work'] },
		{ name: 'Producto 2', owner: users[0]._id, price: 20, image: '', tags: ['lifestyle'] },
		{ name: 'Producto 3', owner: users[0]._id, price: 30, image: '', tags: ['motor'] },
	];

	const deleteResult = await Product.deleteMany();
	console.log(`Deleted ${deleteResult.deletedCount} products.`);

	const insertResult = await Product.insertMany(initialProducts);
	console.log(`Created ${insertResult.length} products.`);
};

const initDB = async () => {
	const questionResponse = await ask('Are you sure you want to empty the database and create initial data? (yes/no) ');
	if (questionResponse.toLowerCase() !== 'yes') {
		console.log('Operation aborted.');
		process.exit();
	}

	await initUsers();
	await initProducts();

	// Cerramos la conexión después de completar la inicialización
	await mongoose.connection.close();
	console.log('Database connection closed.');
};

initDB();
