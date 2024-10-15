require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

const {
    newUserController,
    getUserController,
    loginController,
    getMeController,
    getUserLinksController,
} = require('./controllers/users');

const editUser = require('./controllers/editUser');
const editBio = require('./controllers/editBio');
const editUserPass = require('./controllers/editUserPass');
const addVotes = require('./controllers/addVotes');

const deleteUser = require('./controllers/deleteUser');

const {
    getLinksController,
    newLinkController,
    getSingleLinkController,
    deleteLinkController,
} = require('./controllers/links');
const { authUser } = require('./middlewares/auth');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Conectar a MongoDB
const uri = process.env.MONGODB_URI; // Asegúrate de que la variable esté definida en .env
mongoose
    .connect(uri)
    .then(() => console.log('MongoDB conectado'))
    .catch((error) => console.error('Error al conectar a MongoDB:', error));

// Rutas de usuario
app.post('/user', newUserController);
app.get('/user/:id', authUser, getUserController);
app.post('/login', loginController);
app.get('/user', authUser, getMeController);
app.get('/user/:id/links', getUserLinksController);
// Modificar email o username
app.put('/user/edit', authUser, editUser);
// Modificar la biografía del usuario
app.put('/user/bio', authUser, editBio);
// Modificar la contraseña del usuario
app.put('/users/password', authUser, editUserPass);
// Eliminar un usuario
app.delete('/users', authUser, deleteUser);

// Rutas de Links
app.post('/', authUser, newLinkController);
app.get('/', authUser, getLinksController);
app.get('/link/:id', authUser, getSingleLinkController);
app.delete('/link/:id', authUser, deleteLinkController);

// Rutas de votos
// Votar un enlace
app.post('/votos/:idLink', authUser, addVotes);

// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method'
    );
    res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, DELETE'
    );
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// Middleware de 404
app.use((req, res) => {
    res.status(404).send({
        status: 'error',
        message: 'Not found',
    });
});

// Middleware de gestión de errores
app.use((error, req, res, next) => {
    console.error(error);
    res.status(error.httpStatus || 500).send({
        status: 'error',
        message: error.message,
    });
});

// Lanzamos el servidor
const puerto = 4000;
app.listen(puerto, () => {
    console.log(`Servidor funcionando perfectamente en el puerto ${puerto} 🤩`);
});
