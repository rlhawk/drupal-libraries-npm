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

// Copy the library files.
Object.keys(config.libraries).forEach(function (key, index) {
  copy_libraries(config.libraries[key]);
});

// FUNCTIONS //

function loadConfig(name) {
  let ymlFile = fs.readFileSync(config_path + '/' + name + '.yml', 'utf8');
  let config = yaml.load(ymlFile);

  return config;
}

function copy_libraries(element) {
  let paths = [];

  // The 'flat' option doesn't flatten the file structure, which must be a
  // bug. Luckily, setting 'up' to true has the desired flattening effect.
  let options = {
    flat: true,
    up: true
  };

  // Set any files to exclude.
  if (typeof element.exclude != "undefined") {
    options.exclude = element.exclude;
  }

  // Ensure src is an array.
  if (typeof element.src == 'string') {
    element.src = [element.src];
  }

  // Add the source paths.
  paths.push(...element.src);

  // Add the destination path.
  element.dest = element.dest.replace("{libraries}", config.paths.libraries);
  paths.push(element.dest);

  // Copy the files.
  return copy(paths, options, function () { });
}
