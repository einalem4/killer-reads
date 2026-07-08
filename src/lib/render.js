// Renders the original views/*.handlebars templates using the real `handlebars`
// package (not express-handlebars, which is Express-only middleware). Cloudflare
// Workers disallows dynamic code generation (new Function/eval), which is how
// Handlebars.compile() works, so templates are precompiled ahead of time by
// scripts/build-templates.mjs into src/generated/templates.js and executed here
// with the eval-free `handlebars/runtime` build.
import Handlebars from 'handlebars/runtime';
import { layoutSpec, viewSpecs, partialSpecs } from '../generated/templates.js';
import helpers from '../../utils/helpers.cjs';

Object.entries(helpers).forEach(([name, fn]) => Handlebars.registerHelper(name, fn));
Object.entries(partialSpecs).forEach(([name, spec]) => {
  Handlebars.registerPartial(name, Handlebars.template(spec));
});

const layoutTemplate = Handlebars.template(layoutSpec);
const viewTemplates = Object.fromEntries(
  Object.entries(viewSpecs).map(([name, spec]) => [name, Handlebars.template(spec)])
);

export function renderPage(viewName, data = {}) {
  const body = viewTemplates[viewName](data);
  return layoutTemplate({ ...data, body });
}
