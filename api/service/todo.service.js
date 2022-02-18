const dao = require('../daos/index')
const constants = require('../app-constants').APP_CONSTANTS;
const utils = require('./utils');
const ObjectID = require('mongodb').ObjectID

exports.addTodoTask = function (doc) {
    return new Promise(async function (resolve, reject) {
        try {
            if (doc) {
                    doc['status'] = 'ACTIVE';    
                    doc['createdDate'] = new Date();
                    await dao.insert(doc, "todo");
                    var todoTask = await dao.checkIfExists(doc, "todo")
                    resolve(utils.createResponse('todoTask', todoTask, "constants.SUCCESS", "200", null));
                }
            else {
                reject(utils.createErrorResponse(400, "errorConstants.INVALIDPAYLOAD"));
                return;
            }
        }
        catch (ex) {
            reject(utils.createErrorResponse(500, "errorConstants.INTERNALSERVERERROR"));
        }

    });
}

exports.getAllTodos = function (doc, options) {
    return new Promise(async function (resolve, reject) {
        /* */
        var todos;
        try {

            if (doc) {
                var notEqual = {};
                notEqual[constants.MONGO_NOT_EQUAL] = "DELETED";

                var criteria = {};
                criteria['status'] = notEqual;//constants.ACTIVE;

                var totalRecords = await dao.getCollectionCountWithCriteria('todo', criteria);

                todos = await dao.getCollectionWithCriteriaAndProjections('todo', criteria, {}, options);

                var res = { todos: todos, totalRecords: totalRecords };

                if (todos && todos.length > 0) {
                    resolve(utils.createResponse('result', res, constants.SUCCESS, null, null))
                }
                else {
                    reject(utils.createErrorResponse(204, "RESOURCENOTFOUND"));
                }
            }
            else {
                winston.error("Invalid Payload");
                reject(utils.createErrorResponse(400, "INVALIDPAYLOAD"));
                return;
            }
        }
        catch (err) {
            reject(utils.createErrorResponse(500, "INTERNALSERVERERROR"));
        }
    });
}

exports.todoCompleted = function (doc) {
    return new Promise(async function (resolve, reject) {
        try {
            if (doc && doc.todoId) {
            var todoId = doc.todoId;
            var criteria = {};
            criteria["_id"] = todoId;


            if (!todoId) {
                reject(utils.createErrorResponse(400, 'Invalid Task Id'));
                return;
            }

            var todo = await dao.findOneWithCriteriaAndProjections('todo', criteria, {});

            if (!todo) {
                reject(utils.createErrorResponse(400, 'Todo not found'));
                return;
            }

            updatedDoc = {}
            updatedDoc["status"] = doc.status;
            updatedDoc['UPDATEDDATE'] = new Date();
            updatedDoc["UPDATEDBY"] = "ADMIN"

            await dao.updateCollection("todo", criteria, doc, false);

            var updateTodo = await dao.findOneWithCriteriaAndProjections('todo', criteria, {});
            resolve(utils.createResponse("completed todo", updateTodo, constants.SUCCESS, constants.SUCCESSCODE, null));
            return;
        }
        else {
            winston.error("invalid payload todo Idmissing");
            reject(utils.createErrorResponse(400, 'INVALIDPAYLOAD'));
            return;
        }

        }
        catch (err) {
            console.log(err);
            reject(utils.createErrorResponse(500, 'INTERNALSERVERERROR'));
        }
    });
}