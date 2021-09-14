const yargs = require("yargs");
var fs = require("fs");
var jsonvalidate = require("jsonschema").validate;
//const { DOMParser } = require('xmldom')
glob = require("glob");
// var xmlvalidator = require('xsd-schema-validator');

//Specifies the format of the BOM. This helps to identify the file as CycloneDX since BOMs do not have a filename convention nor does JSON schema support namespaces.
// read file sample.json file

/*  "description": "The version of the CycloneDX specification a BOM is written to (starting at version 1.2)",
"examples": ["1.3"]
*/

/* "description": "Every BOM generated should have a unique serial number, even if the contents of the BOM being generated have not changed over time. The process or tool responsible for creating the BOM should create random UUID's for every BOM generated.",
 "examples": ["urn:uuid:3e671687-395b-41f5-a30f-a58921a69b79"],
 "pattern": "^urn:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"
*/

/*
"description": "The version allows component publishers/authors to make changes to existing BOMs to update various aspects of the document such as description or licenses. When a system is presented with multiple BOMs for the same component, the system should use the most recent version of the BOM. The default version is '1' and should be incremented for each version of the BOM that is published. Each version of a component should have a unique BOM and if no changes are made to the BOMs, then each BOM will have a version of '1'.",
"default": 1,
"examples": [1]
*/

const jsonvalidator = (file, schemafile) => {
  let schemaStr = fs.readFileSync(schemafile, "utf8");
  let schema = JSON.parse(schemaStr);
  fs.readFile(file, function (err, fileContents) {
    console.log(file);
    if (file.endsWith(".json")) {
      let data = JSON.parse(fileContents);
      console.log(`This is ${data.bomFormat}`);
      //console.log(`Parsed JSON: ${JSON.stringify(data, null, '  ')}`);
      let validatorResult = jsonvalidate(data, schema);
      //console.log(`Validator result: ${validatorResult}`);
      if (validatorResult.errors.length) {
        console.log(
          "Validation errors:\n\t" + validatorResult.errors.join("\n\t")
        );
      } else {
        console.log(
          `Input file '${file}' successfully validated against schema file '${schemafile}'`
        );
      }
    }
  });
};

yargs.command({
  command: "all",
  builder: {
    directory: { type: "string" },
    schemafile: {
      type: "string",
    },
  },
  handler: function (args) {
    console.log(args);
    glob("rules/*", function (err, files) {
      // read the folder or folders if you want: example json/**/*.json
      if (err) {
        console.log(
          "cannot read the folder, something goes wrong with glob",
          err
        );
      }
      files.forEach(function (file) {
        jsonvalidator(file, args.schemafile);
      });
    });
  },
});

yargs
  .command(
    "file [dataFile] [schemaFile]", // Command name, plus positional arguments
    "help", // Command description for `--help` output
    (yargs) => {
      // Add extra arguments to `file`
      yargs
        .positional("dataFile", {
          describe: "Input data file",
          default: "rules/7z1900-x64.exe_sbom.json",
        })
        .positional("schemaFile", {
          describe: "JSON/XML schema file",
          default: "schemas/bom-1.2.schema.json",
        });
    },
    (argv) => {
      jsonvalidator(argv.dataFile, argv.schemaFile);
      // else if(argv.dataFile.endsWith(".xml"))
      // {
      //   const xmlStr = new DOMParser().parseFromString(fileContents,
      //     'text/xml')

      //   validator.validateXML(xmlStr, argv.schemaFile, function(err, result) {
      //     if (err) {
      //       throw err;
      //     }
      //     if (result.valid){
      //       console.log("Validation errors:\n\t" + validatorResult.errors.join('\n\t'));
      //     } else {
      //       console.log(`Input file '${argv.dataFile}' successfully validated against schema file '${argv.schemaFile}'`);
      //     }
      //    // true
      //   })
      // }
    }
  )
  .help();

// Need to access `yargs.argv`, otherwise yargs won't do anything.
yargs.argv;
