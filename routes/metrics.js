let express = require('express');
let router = express.Router();

const Joi = require('joi');
const joiHandler = require('../handlers/joiHandler');

const pool = require('../handlers/dbHandler');

const metricSchema = Joi.object().keys({
    uuid: Joi.string().required().guid({version: ['uuidv4']}).messages({
        "any.required": 'The input must be a valid UUID',
    }),
    time: Joi.number().required(),
}).options({abortEarly: false});

router.post('/', function (req, res, next) {
    if (!joiHandler.validate(res, req.body, metricSchema)) return;

    const {uuid, time} = req.body;

    const callback = function (error, results, fields) {
        if (error) {
            return res.status(400).json({
                message: 'Failed to log metric.',
                error: error.message
            })
        }

        return res.status(200).json({
            message: 'Successfully logged metric.'
        })
    }

    // If < 0, this means the app was just launched
    if (time < 0 ) {
        pool.query('INSERT INTO metrics (uuid, appLaunches, timeSpent) VALUES(?, ?, ?) ON DUPLICATE KEY UPDATE appLaunches=appLaunches +1',
            [uuid, 1, 0], callback);
    } else {
        pool.query('UPDATE metrics SET timeSpent=timeSpent+? WHERE uuid=?',
            [time, uuid], callback);
    }
});

module.exports = router;
