const Joi = require('joi');

/**
 * Validates a schema with Joi.
 *
 * If errors are found, they are added to
 * a list which is sent back to the client.
 *
 * @param res - the response
 * @param body - the json body
 * @param schema - the schema format
 * @returns true if there are no errors, false if there are errors
 */
module.exports.validate = function validate(res, body, schema) {
    const result = schema.validate(body);
    const {error} = result;
    if (error === undefined) {
        return true;
    }

    console.log(result.error);
    const {details} = error;
    const errors = [];

    for (let index = 0; index < details.length; index += 1) {
        errors.push(`${details[index].context.key}: ${details[index].message}`);
    }

    res.status(422).json({
        status: 422,
        message: 'Bad request.',
        errors,
    });

    return false;
};
