var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const sql = require('../sql.js');

function generateToken(id) {
    return jwt.sign({'id' : id}, process.env.JWT_SECRET, {expiresIn : '1h'});
}

router.post('/signup', function(req, res) {
    const body = req.body;

    if (!body.email || !body.password || !body.display_name) {
        res.status(400);
        res.send('The fields "email", "password" and "display_name" are mandatory.');
        return;
    }

    if (body.password.lenght < 8) {
        res.status(400);
        res.send('The password must be alleast 8 characters long.');
        return;
    }

    // 12 = nombre d'itération pour générer le mdp. Peut être ammené à augmenter avec le temps
    bcrypt.hash(body.password, 12).then(hashedPassword => {
        try {
            console.log(`INSERT INTO users (email, password, display_name) VALUES ("${body.email}", "${hashedPassword}", "${body.display_name}")`);
            sql.sqlQuery(`INSERT INTO users (email, password, display_name) VALUES ("${body.email}", "${hashedPassword}", "${body.display_name}")`, () => {
                res.status(201);
                res.send("OK");
            });
        } catch (exception) {
            res.status(500);
            res.send('Error on creation : ' + exception);
        }
    });
});

router.post('/login', function (req, res) {
    const body = req.body;
    
    if(!body.email || !body.password) {
        res.status(400);
        res.send('The fields "email" and "password" are mandatory');
        return
    }
    
    // Get the user from the db
    sql.sqlQuery(`SELECT * FROM users WHERE email="${body.email}" LIMIT 1`, (error, results) => {
      if(results.length === 0) {
        res.status(400);
        res.send('Invalid password or email');
            return;
        }

        const user = results[0];
        // Validate password
        console.log(user);
        bcrypt.compare(body.password, user.password).then(isOk => {
            if(!isOk) {
                res.status(400);
                res.send('Invalid password or email');
            } else {
                delete user.password;
                // Generate a JWT token
                return res.json({
                    'token' : generateToken(user.id),
                    'user' : user,
                });
            }
        });
    });
});

router.get('/token-tester', (req, res) => {
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err) {
                res.status(401);
                if(err.name == 'TokenExpiredError') {
                    res.send('Token expired');
                } else {
                    res.send('Invalid token');
                }
                return;
            }
            sql.sqlQuery(`SELECT * FROM user WHERE user.id = ${decoded.id}`, (results) => {
                if(!results.length) {
                    res.status(401);
                    res.send('Unauthorized');
                    return;
                }

                const user = results[0];

                res.send('Welcome '+ user.display_name);
            });
        });
    }
    else {
        res.status('Unauthorized');
    }
});

module.exports = router;