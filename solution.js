//Node.js v14.17.6

const fs = require("fs");
const path = require("path");

// Ajv
const Ajv = require("ajv");
const ajv = new Ajv(); //Ajv({ allErrors: true }); //new Ajv();

// String to XML
//const parseString = require("xml2js").parseString;

//validation for XML over XSD

let validator = require("xsd-schema-validator");

/*


var xmlStr = '<foo:bar />';

validator.validateXML(xmlStr, 'resources/foo.xsd', function(err, result) {
  if (err) {
    throw err;
  }

  result.valid; // true
});

*/

//router to files and schema
const URLFolder = path.join(__dirname, "jxfiles");
const URLjxschema = path.join(__dirname, "schema");

//load schema json and xml
function readSchema() {
  let schemaJson;
  let schemaXSD;
  let contFiles = 0;
  return new Promise((res, rej) => {
    fs.readdir(URLjxschema, (errReadFolder, filesNames) => {
      if (!errReadFolder)
        filesNames.forEach((fileName) => {
          fs.readFile(
            path.join(URLjxschema, fileName),
            "utf8",
            (errReadFile, file) => {
              if (!errReadFile) {
                if (path.extname(fileName) == ".json") {
                  schemaJson = JSON.parse(file);
                }
                if (path.extname(fileName) == ".xsd") {
                  schemaXSD = path.join(URLjxschema, fileName);
                }
              }
              contFiles++; //else console.log(errReadFile);
              if (filesNames.length == contFiles) {
                //console.log([schemaJson, schemaXSD]);
                res([schemaJson, schemaXSD]);
              }
            }
          );
        });
    });
  });
}
//
//load Files
//
function readFiles() {
  let elemtsJson = [];
  let elemtsXml = [];
  let contElemtInFolder = 0;
  return new Promise((res, rej) => {
    fs.readdir(URLFolder, (errReadFolder, filesNames) => {
      if (!errReadFolder)
        filesNames.forEach((fileName) => {
          fs.readFile(
            path.join(URLFolder, fileName),
            "utf8",
            (errReadFile, file) => {
              if (!errReadFile) {
                if (path.extname(fileName) == ".json") {
                  elemtsJson.push([fileName, JSON.parse(file)]);
                }
                if (path.extname(fileName) == ".xml") {
                  elemtsXml.push([fileName, file]);
                }
              } //else console.log(errReadFile);
              contElemtInFolder++;
              if (filesNames.length == contElemtInFolder) {
                //console.log([elemtsJson, elemtsXml]);
                res([elemtsJson, elemtsXml]);
              }
            }
          );
        });
    });
  });
}

const dataa = readSchema();
const rftov = readFiles();

dataa.then((value) => {
  const schemaJSO = value[0];
  const schemaXSD = value[1];

  console.log(schemaXSD);

  rftov.then((result) => {
    let jsoRes = result[0];
    let xmlRes = result[1];

    jsoRes.forEach((element) => {
      let valid = ajv.validate(schemaJSO, element[1]);
      if (valid) {
        console.log(element[0], true);
      } else {
        console.log(element[0], false);
      }
    });

    xmlRes.forEach((ele) => {
      validator.validateXML(ele[1], schemaXSD, function (err, result) {
        if (err) {
          //console.log(err);
        }
        console.log(ele[0], result.valid);
      });
    });
  });
});
