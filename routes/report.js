const express = require('express');
const router = express.Router();

const Joi = require('joi');
const joiHandler = require('../handlers/joiHandler');

const pool = require('../handlers/dbHandler');

const reportSchema = Joi.object().keys({
    uuid: Joi.string().required().guid({version: ['uuidv4']}),
    fullName: Joi.string().required(),
    errorCode: Joi.string().required(),
    errorComment: Joi.string().required()
}).options({abortEarly: false});

router.post('/', function (req, res, next) {
    if (!joiHandler.validate(res, req.body, reportSchema)) return;

    const {uuid, fullName, errorCode, errorComment} = req.body;

    pool.query('INSERT INTO report (uuid, fullName, errorCode, errorComment) VALUES(?, ?, ?, ?)',
        [uuid, fullName, errorCode, errorComment], function (error, results, fields) {
        if (error) {
            return res.status(400).json({
                message: 'Failed to log report.',
                error: error.message
            })
        }

        return res.status(200).json({
            message: 'Successfully logged report.'
        })
    });
});

module.exports = router;
