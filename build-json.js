#!/usr/bin/env node

/*global console, require*/
var dir, fs, glob, path, promisify, result, yaml;

promisify = require("promisify-node");
fs = promisify("fs");
yaml = require("js-yaml");
path = require("path");
glob = promisify("glob");

// Skeleton
result = {
    "AWSTemplateFormatVersion": "2010-09-09",
    "Resources": {}
};

// Find resource files and add them to the resul.
dir = "./cloud-formation/"
glob(path.resolve(dir, "*.yaml")).then((paths) => {
    function readNextFile() {
        var fullPath, name;

        if (paths.length) {
            fullPath = paths.shift();
            name = path.basename(fullPath).replace(/\.yaml$/, "");

            return fs.readFile(fullPath).then((content) => {
                try {
                    result.Resources[name] = yaml.safeLoad(content.toString());
                } catch (err) {
                    console.error("Error parsing " + fullPath);
                    throw err;
                }

                return readNextFile();
            });
        }
    }

    return readNextFile();
}).then(() => {
    var str;

    str = JSON.stringify(result, null, 4);
    str = str.replace("YYYY-MM-DD_HH:MM:SS", "2016-03-31_19:46:16");
    console.log(str);
}, (err) => {
    console.error(err);
});
