const sqlQuery = require('./sql').sqlQuery;

function getObjectOr404(id, table, res) {
    return new Promise((resolve) => {
        sqlQuery(`SELECT * FROM ${table} WHERE id='${id}' LIMIT 1;`, (results) => {
            if(!results.length) {
                res.status(404);
                res.send('Page not found');
                resolve(undefined);
            }
            return resolve(results[0]);
        });
    });
}

function transformBoolean(input) {
    if(input === "true") {
        return true;
    }
    return Boolean(Number(input));
}

module.exports = {
    getObjectOr404, 
    transformBoolean
}