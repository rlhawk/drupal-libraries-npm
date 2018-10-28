'use strict';

var fs = require('fs-extra'),
  yaml = require('js-yaml'),
  del = require('del'),
  copy = require('copyfiles');

// CONFIGURATION //

var config = {};

// Define the path to the configuration directory.
var config_path = './npm_config';

// Load paths configuration.
config.paths = loadConfig('paths');

// Load libraries configuration.
config.libraries = loadConfig('libraries');

// Copy library files.
del(config.paths.libraries_dir).then(paths => {
  config.libraries.forEach(function (element) {
    copy_libraries(element);
  });
});

// FUNCTIONS //

function loadConfig(name) {
  let ymlFile = fs.readFileSync(config_path + '/' + name + '.yml', 'utf8');
  return yaml.load(ymlFile);
}

function copy_libraries(element) {
  let paths = [];

  // Ensure src is an array.
  if (typeof element.src == 'string') {
    element.src = [element.src];
  }

  // Add the source paths.
  paths.push(...element.src);

  // Add the destination path.
  paths.push(config.paths.libraries_dir + '/' + element.dest);

  // Copy the files, flattening all the output into one directory.
  return copy(paths, true, function () { });
}
