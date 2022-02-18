const routes = require('express').Router();
const todo = require('../controllers/todo');

routes.use('/api/todo', todo);

module.exports = routes;