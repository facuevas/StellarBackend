const express = require("express");
const router = express.Router();

const Joi = require("joi");
const joiHandler = require("../handlers/joiHandler");

const pool = require("../handlers/dbHandler");

const reportSchema = Joi.object()
  .keys({
    uuid: Joi.string()
      .required()
      .guid({ version: ["uuidv4"] }),
    fullName: Joi.string().required(),
    errorCode: Joi.string().required(),
    errorComment: Joi.string().required(),
  })
  .options({ abortEarly: false });

// Creates a new report table row
router.post("/new", (req, res) => {
  if (!joiHandler.validate(res, req.body, reportSchema)) return;

  const { uuid, fullName, errorCode, errorComment } = req.body;

  pool.query(
    "INSERT INTO report (uuid, fullName, errorCode, errorComment) VALUES(?, ?, ?, ?)",
    [uuid, fullName, errorCode, errorComment],
    (error) => {
      if (error) {
        return res.status(400).json({
          message: "Failed to log report.",
          error: error.message,
        });
      }

      return res.status(200).json({
        message: "Successfully logged report.",
      });
    }
  );
});

// Returns all rows from the report table
router.get("/all", (req, res) => {
  pool.query(
    "SELECT uuid, fullName, errorCode, errorComment FROM report",
    (error, results) => {
      if (error) {
        return res.status(400).json({
          message: "Failed to get all rows from report table.",
          error: error.message,
        });
      }
      return res.status(200).json(results);
    }
  );
});

// Returns a single row from the report table based on uuid
router.get("/:uuid", (req, res) => {
  const { uuid } = req.params;
  pool.query(
    "SELECT uuid, fullName, errorCode, errorComment FROM report WHERE uuid = ?",
    [uuid],
    (error, results) => {
      if (error) {
        return res.status(400).json({
          message: `ID ${uuid} was not found.`,
          error: error.message,
        });
      }
    }
  );
  return res.status(200).json(results);
});

// Deletes a row based on the UUID.
router.delete("/:uuid", (req, res) => {
  const { uuid } = req.params;
  pool.query("DELETE FROM report WHERE uuid = ?", [uuid], (error) => {
    if (error) {
      return res.status(400).json({
        message: `ID ${uuid} was not found.`,
        error: error.message,
      });
    }
    return res.status(200).json({
      message: "Report successfully deleted.",
    });
  });
});

// Needs work
// Currently, when pushing a single update (whether it is fullName, errorCode, or errorComment),
// it will only update the field that was passed in the request body
// and set all other fields as null.
// A possible fix is to query the uuid first, store the results, and then pass the values
// that weren't edited to the query.
router.put("/edit", (req, res) => {
  if (!joiHandler.validate(res, req.body, reportSchema)) return;
  const { uuid, fullName, errorCode, errorComment } = req.body;
  pool.query(
    "UPDATE report SET fullName=?, errorCode=?, errorComment=? WHERE uuid = ?",
    [fullName, errorCode, errorComment, uuid],
    (error) => {
      if (error) {
        return res.status(400).json({
          message: "Error updating.",
          error: error.message,
        });
      }
      return res.status(200).json({
        message: "Report successfully updated.",
      });
    }
  );
});

module.exports = router;
