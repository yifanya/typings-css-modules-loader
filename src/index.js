const loaderUtils = require("loader-utils");
const cssLoader = require("css-loader");
const logger = require("./logger");
const utils = require("./utils");
const path = require("path");

function delegateToCssLoader(ctx, source, map, meta, callback) {
  ctx.async = callback;
  cssLoader.call(ctx, source, map, meta);
}

function loader(source, map, meta) {
  if (this.cacheable) this.cacheable();
  const options = loaderUtils.getOptions(this);
  const asyncCallback = this.async();
  if (!options.modules) {
    return delegateToCssLoader(this, source, map, meta, () => asyncCallback);
  }

  const moduleCallback = (...args) => {
    const content = args[1];
    const classList = utils.getCssModuleKeys(content.substring(content.indexOf("exports.locals")));
    // const cssLoaderResult = utils.getModuleFromString(content);
    // const classMaps = cssLoaderResult.exports.locals || {};
    // const classList = Object.keys(classMaps);
    if (!classList.length) {
      logger('warn', `${path.relative(__dirname, this.resourcePath)} is no content`);
    } else {
      const cssModuleName = utils.filenameToTypingsFilename(this.resourcePath);
      const cssModuleDefinition = utils.generateGenericExportInterface(
        classList,
        utils.filenameToPascalCase(this.resourcePath)
      );
      utils.createDTsInterface(cssModuleName, cssModuleDefinition);
    }
    asyncCallback(...args);
  }
  delegateToCssLoader(this, source, map, meta, () => moduleCallback);
}

module.exports = loader;