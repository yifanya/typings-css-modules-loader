const colors = require("colors");
colors.setTheme({
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});

module.exports = (level, inform) => console[level](`${inform}`[level]);
