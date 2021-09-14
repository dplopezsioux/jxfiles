var validator = require("xsd-schema-validator");
var path = require("path");

var xmlStr = `<?xml version="1.0"?>  
<employee  
xmlns="http://www.javatpoint.com"  
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
xsi:schemaLocation="http://www.javatpoint.com employee.xsd">  
  
  <firstname>vimal</firstname>  
  <lastname>jaiswal</lastname>  
  <email>vimal@javatpoint.com</email>  
</employee>  `;

validator.validateXML(
  xmlStr,
  path.join(__dirname, "schema", "schemaxml.xsd"),
  function (err, result) {
    if (err) {
      throw err;
    }

    console.log(result.valid);
  }
);
