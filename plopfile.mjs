import fs from "fs";
import path from "path";

const getDirectories = (srcPath) =>
  fs
    .readdirSync(srcPath)
    .filter((file) => fs.statSync(path.join(srcPath, file)).isDirectory());

const modules = getDirectories("src/modules");

const modulePrompts = [
  {
    when: () => modules.length > 0,
    type: "list",
    name: "componentScope",
    message: "Select the component scope",
    choices: [
      {
        name: "Global",
        value: "global",
      },
      {
        name: "Module - i.e. specific to a 'modules/*' folder",
        value: "module",
      },
    ],
  },
  {
    when: (context) => context.componentScope === "module",
    type: "list",
    name: "module",
    message: "Choose a module from 'src/modules'",
    choices: modules,
  },
];

export default function plopConfig(plop) {
  plop.setHelper("path", (module = "") => {
    if (module) return `modules/${module}/`;
    return "";
  });

  plop.setGenerator("Component", {
    description: "Make a new component",
    prompts: [
      ...modulePrompts,
      {
        type: "input",
        name: "name",
        message: "Component Name",
      },
    ],
    actions: [
      {
        type: "addMany",
        destination: "src/{{path module}}components/{{pascalCase name}}",
        base: "plop-templates/component",
        templateFiles: "plop-templates/component/*.hbs",
      },
    ],
  });
}
