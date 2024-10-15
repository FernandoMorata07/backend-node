// server.js
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

// Controladores
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

// Middleware

app.use(
    cors({
        origin: 'http://localhost:3000', // Asegúrate de que sea la URL correcta de tu frontend
    })
);
app.use(express.json());
app.use(morgan('dev'));

// Conexión a MongoDB
mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB conectado'))
    .catch((err) => console.error('Error al conectar a MongoDB:', err));

// Rutas de usuario
app.post('/user', newUserController);
app.get('/user/:id', authUser, getUserController);
app.post('/login', loginController);
app.get('/user', authUser, getMeController);
app.get('/user/:id/links', getUserLinksController);
app.put('/user/edit', authUser, editUser);
app.put('/user/bio', authUser, editBio);
app.put('/users/password', authUser, editUserPass);
app.delete('/users', authUser, deleteUser);

// Rutas de Links
app.post('/', authUser, newLinkController);
app.get('/', authUser, getLinksController);
app.get('/link/:id', authUser, getSingleLinkController);
app.delete('/link/:id', authUser, deleteLinkController);

// Rutas de votos
app.post('/votos/:idLink', authUser, addVotes);

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
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor funcionando perfectamente en el puerto ${PORT} 🤩`);
});
