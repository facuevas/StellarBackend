let express = require('express');
let router = express.Router();

const Joi = require('joi');
const joiHandler = require('../handlers/joiHandler');

const reportSchema = Joi.object().keys({
  uuid: Joi.string().required().guid({ version: ['uuidv4'] }),
  fullName: Joi.string().required(),
  errorCode: Joi.string().required(),
  errorComment: Joi.string().required()
}).options({ abortEarly: false });

router.post('/', function(req, res, next) {
  if (!joiHandler.validate(res, req.body, reportSchema)) return;

  // TODO: Database stuff

  return res.status(200).json({
    message: 'Successfully logged report.'
  })
});

module.exports = router;
