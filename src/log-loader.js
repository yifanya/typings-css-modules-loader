const loaderUtils = require('loader-utils');

module.exports = function(source) {
  console.log('~~~~~~')
  console.log('\x1B[36m%s\x1B[0m', source);
  return source;
}