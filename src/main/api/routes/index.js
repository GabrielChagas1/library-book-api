const {Router} = require('express');
const { usuariosRoutes } = require('./usuario.routes');

const routes = Router();

routes.use('/usuarios', usuariosRoutes)

module.exports = {routes}