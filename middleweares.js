const jwt = require('jsonwebtoken');
const sql = require('./sql');

function authenticationMiddleware(req, res, next) {
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        const token = req.headers.authorization.split('')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err) {
                res.status(401);
                if(err.name == 'TokenExpiredError') {
                    res.send('Token expired');
                }
                else {
                    res.send('Invalid token');
                }
                return;
            }
            sql.sqlQuery(`SELECT id, email, display_name FROM user WHERE user.id = ${decoded.id};`, (results) => {
                if(!results.length) {
                    res.status(401);
                    res.send('Unauthorized');
                    return;
                }

                const user = results[0];

                req.user = user;
                next();
            });
        });
    }
    else {
        res.status(401);
        res.send('Unauthorized');
    }
}

module.exports = {
    authenticationMiddleware
}