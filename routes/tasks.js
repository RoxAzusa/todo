var express = require('express');
var router = express.Router();
const sql = require('../sql.js');
const utils = require('../utilities.js');
const middlewares = require('../middleweares');

router.use(middlewares.authenticationMiddleware);

// Déclaration des routes

/* Liste des todo */
router.get('/', function(req, res) {
    try {
        let query = `SELECT id, title, due_date, done, user FROM ${process.env.DB_TABLE_TO_DO}`;

        // Filter per current user
        query += ` WHERE user_id = ${req.user.id}`;
        sql.sqlQuery(query, (results) => {
            console.log(results);
            res.json(results);
        })
    } catch (error) {
        console.log(error); 
    }
});

/* Détail d'un todo */
router.get('/:id', function(req, res) {
    try {
        utils.getObjectOr404(req.params.id, process.env.DB_TABLE_TO_DO, res).then(object => {
            console.log(object);
            res.json(object);
        })
    } catch (error) {
        console.log(error); 
    }
  });

/* Création d'un todo */
router.post('/', function(req, res) {
    const newTask = req.body;
    try {
        let query = `INSERT INTO ${process.env.DB_TABLE_TO_DO} (title, creation_date, due_date, done, description, user) VALUES ("${newTask.title}", "${sql.processDate(new Date())}", "${sql.processDate(newTask.due_date)}", "${utils.transformBoolean(newTask.done)}", "${newTask.description}", "${newTask.user}");`;

        // Filter per current user
        query += ` WHERE user_id = ${req.user.id}`;
        sql.sqlQuery(query, (results) => {
            console.log(results);
            res.json(results);
        })
    } catch (error) {
        console.log(error); 
    }    
});

/* Mise à jour d'un todo */
router.patch('/:id', function(req, res) {
    utils.getObjectOr404(req.params.id, process.env.DB_TABLE_TO_DO, res).then(object => {
        if(object) {
            delete object.id;
            Object.assign(object, req.body);
            try {
                let query = `UPDATE ${process.env.DB_TABLE_TO_DO} SET title="${object.title}", due_date="${sql.processDate(object.due_date)}", done="${utils.transformBoolean(object.done)}", description="${object.description}", user="${object.user}" WHERE id=${req.params.id}`;

                // Filter per current user
                query += ` AND user_id = ${req.user.id}`;
                sql.sqlQuery(query, () => {
                    res.status(200);
                    res.json(object);
                });
            }
            catch (exception) {
                console.log(object);
                res.status(500);
                res.send("Error on update : " + exception);
            }
        }
    });
});

/* Suppression d'un todo */
router.delete('/:id', function(req, res) {
    utils.getObjectOr404(req.params.id, process.env.DB_TABLE_TO_DO, res).then(object => {
        if(object) {
            try {
                let query = `DELETE FROM ${process.env.DB_TABLE_TO_DO} WHERE id='${req.params.id}';`;

                // Filter per current user
                query += ` AND user_id = ${req.user.id}`;
                sql.sqlQuery(query, () => {
                    res.status(204);
                    res.json();
                });
            } catch (exception) {
                res.status(500);
                res.send('Error on deletion : ' + exception);
            }
        }
    });
});

module.exports = router;