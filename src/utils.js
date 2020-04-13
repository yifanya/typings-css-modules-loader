const path = require('path');
const camelCase = require('camelcase');
const vm = require('vm');
const fs = require('fs');

const getModuleFromString = (bundle) => {
  const wrapper = [
    '(function (exports, require, module, __filename, __dirname) { ',
    '\n});'
  ];
  const m = { exports: {} };
  const script = new vm.Script(`${wrapper[0]}\n${bundle}\n${wrapper[1]}`,{
    displayErrors: true
  });
  const result = script.runInThisContext();
  result.call(m.exports, m.exports, require, m);
  return m
}

const getCssModuleKeys = content => {
  const keyRegex = /"([^\\"]+)":/g;
  let match;
  const cssModuleKeys = [];

  while ((match = keyRegex.exec(content))) {
    if (cssModuleKeys.indexOf(match[1]) < 0) {
      cssModuleKeys.push(match[1]);
    }
  }
  return cssModuleKeys;
};

const filenameToTypingsFilename = filename => {
  const dirName = path.dirname(filename);
  const baseName = path.basename(filename);
  return path.join(dirName, `${baseName}.d.ts`);
};

const filenameToPascalCase = filename => {
  return camelCase(path.basename(filename), { pascalCase: true });
};

const generateGenericExportInterface = (cssModuleKeys, pascalCaseFileName) => {
  const interfaceName = `I${pascalCaseFileName}`;
  const moduleName = `${pascalCaseFileName}Module`;

  const interfaceProperties = cssModuleToTypescriptInterfaceProperties(
    cssModuleKeys,
    "    "
  );
  return `declare namespace ${moduleName} {
  export interface I${pascalCaseFileName} {
${interfaceProperties}
  }
}

declare const ${moduleName}: ${moduleName}.${interfaceName} & {
  locals: ${moduleName}.${interfaceName};
};

export = ${moduleName};`;
};

const cssModuleToTypescriptInterfaceProperties = (cssModuleKeys, indent) => {
  return [...cssModuleKeys]
    .sort()
    .map(key => `${indent || ""}'${key}': string;`)
    .join("\n");
};

const createDTsInterface = (filename, content) => {
  if (fs.existsSync(filename)) {
    const currentInput = fs.readFileSync(filename, "utf-8");

    // compare file contents ignoring whitespace
    if (currentInput.replace(/\s+/g, "") !== content.replace(/\s+/g, "")) {
      fs.writeFileSync(filename, content, "utf8");
    }
  } else {
    fs.writeFileSync(filename, content, "utf8");
  }
};


module.exports = {
  getCssModuleKeys,
  filenameToTypingsFilename,
  filenameToPascalCase,
  generateGenericExportInterface,
  getModuleFromString,
  createDTsInterface
}
