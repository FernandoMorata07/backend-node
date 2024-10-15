require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

// Controladores y middlewares
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

// Ruta para comprobar si el servidor está funcionando
app.get('/', (req, res) => {
    res.send({
        status: 'success',
        message: 'Servidor funcionando correctamente',
    });
});

// Middleware de autenticación solo para rutas que lo requieren
app.use('/user', authUser); // Solo se aplica a las rutas que comienzan con /user
app.use('/link', authUser); // Solo se aplica a las rutas que comienzan con /link

// Rutas de usuario
app.post('/user', newUserController);
app.get('/user/:id', getUserController);
app.post('/login', loginController);
app.get('/user', getMeController);
app.get('/user/:id/links', getUserLinksController);
// Modificar email o username
app.put('/user/edit', editUser);
// Modificar la biografía del usuario
app.put('/user/bio', editBio);
// Modificar la contraseña del usuario
app.put('/users/password', editUserPass);
// Eliminar un usuario
app.delete('/users', deleteUser);

// Rutas de Links
app.post('/link', newLinkController);
app.get('/link', getLinksController);
app.get('/link/:id', getSingleLinkController);
app.delete('/link/:id', deleteLinkController);

// Rutas de votos
app.post('/votos/:idLink', addVotes);

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
const puerto = process.env.PORT || 4000;
app.listen(puerto, () => {
    console.log(`Servidor funcionando perfectamente en el puerto ${puerto} 🤩`);
});
