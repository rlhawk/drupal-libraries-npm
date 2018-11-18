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

// Clean the libraries.
for (var index in config.libraries) {
  if (config.libraries.hasOwnProperty(index)) {
    cleanLibrary(config.libraries[index]);
  }
}

// Copy the libraries.
for (var index in config.libraries) {
  if (config.libraries.hasOwnProperty(index)) {
    copyLibrary(config.libraries[index]);
  }
}

// FUNCTIONS //

function loadConfig(name) {
  let ymlFile = fs.readFileSync(config_path + '/' + name + '.yml', 'utf8');
  let loadedConfig = yaml.load(ymlFile);

  // If this is not the 'paths' configuration, replace any path tokens.
  if (name != 'paths') {
    loadedConfig = replacePathTokens(loadedConfig);
  }

  return loadedConfig;
}

function cleanLibrary(element) {
  let files = [];

  // Ensure src is an array.
  if (typeof element.src == 'string') {
    element.src = [element.src];
  }

  // Determine the files to be deleted.
  element.src.forEach(function (filePath) {
    var fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
    files.push(element.dest + '/' + fileName);
  })

  // Delete the files.
  del(files);
}

function copyLibrary(element) {
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
  paths.push(element.dest);

  // Copy the files.
  return copy(paths, options, function () { });
}

function replacePathTokens(e) {
  var search = /\{([^}]*)\}/gi;

  if (Object.prototype.toString.call(e) === '[object Array]') {
    e.forEach(function (val, index) {
      e[index] = replacePathTokens(val)
    })
  } else if ((typeof e === 'object') && (e !== null)) {
    for (var index in e) {
      if (e.hasOwnProperty(index)) {
        e[index] = replacePathTokens(e[index]);
      }
    }
  } else {
    // Replace any path tokens.
    e = e.replace(search, getPathReplacement);
  }

  return e;
}

function getPathReplacement(match, p1) {
  return config.paths[p1];
}
