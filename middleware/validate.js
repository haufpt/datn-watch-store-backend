const Joi = require("joi");
const { handleRequest } = require("./request");

const pick = (schema, keys) => {
  const data = keys.reduce((object, key) => {
    if (schema && Object.prototype.hasOwnProperty.call(schema, key)) {
      object[key] = schema[key];
    }

    return object;
  }, {});

  return data;
};

const validateSchema = (schema) =>
  handleRequest((req, res, next) => {
    const labelLog = "[middleware/validate.js] [validateSchema]";
    const pickSchema = pick(schema, ["params", "query", "body"]);
    const pickRequest = pick(req, Object.keys(pickSchema));

    const { value, error } = Joi.compile(pickSchema)
      .prefs({
        errors: {
          label: "key",
        },
        abortEarly: false,
      })
      .validate(pickRequest);

    if (error) {
      const message = `Schema invalid: ${error.message}`;
      console.log(`${labelLog} ${message}`);
      return res.status(400).send(message);
    }

    Object.assign(req, value);
    return next();
  });

module.exports = { validateSchema };
