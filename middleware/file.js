const { handleRequest } = require("./request");

const checkFile = (type, requiredFields) =>
  handleRequest((req, res, next) => {
    const labelLog = "[middleware/file.ts] [checkFile]";
    let isValid = true;

    switch (type) {
      case "SINGLE": {
        const file = req.file;
        console.log(`${labelLog} file -> ${JSON.stringify(file)}`);

        if (!file) {
          isValid = false;
        }
        break;
      }

      case "MULTIPLE": {
        const files = req.files;
        console.log(`${labelLog} files -> ${JSON.stringify(files)}`);

        if (!files || files.length === 0) {
          isValid = false;
        }
        break;
      }

      case "FIELDS": {
        const fields = Object.keys(req.files || {});
        console.log(
          `${labelLog} file in fields -> ${JSON.stringify(req.files)}`
        );

        if (fields.length === 0) {
          isValid = false;
        }

        if (requiredFields && requiredFields.length > 0) {
          for (const field of requiredFields) {
            const files = req.files[field];
            if (!files || files.length === 0) {
              isValid = false;
              break;
            }
          }
        }
        break;
      }

      default:
        break;
    }

    if (!isValid) {
      const message = "File is required";
      console.log(`${labelLog} ${message}`);

      return res.status(400).json({
        message,
        code: 39000,
      });
    }

    return next();
  });

module.exports = checkFile;
