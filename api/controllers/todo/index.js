const express = require('express')
const router = express.Router()
const constants = require('../../app-constants').APP_CONSTANTS;
const service = require('../../service/todo.service');

router.post('/addTodoTask', async (req, res, next) => {
    try {
        var doc = req.body;
        var response = await service.addTodoTask(doc);
        res.json(response);
    }
    catch (err) {
        if (err.error)
            res.status(err.error.code).send(err);
        else
            res.status(500).send(err);
    }

})

router.get('/getAllTodos', async (req, res, next) => {

    try {
        var doc = req.query;
        var sort = { catName: 1 };
        var page = doc.page;
        var options = { sort: sort, skip: page ? +page * 10 - 10 : 0, limit: 10 };

        var response = await service.getAllTodos(doc, options);
        res.json(response);
    }
    catch (err) {
        res.status(err.error.code).send(err);
    }
})

router.put('/todoCompleted', async (req, res, next) => {
    var doc = req.body;
    try {
        res.json(await service.todoCompleted(doc));
    }
    catch (err) {
        res.status(err.error.code).send(err);
    }
})

module.exports = router