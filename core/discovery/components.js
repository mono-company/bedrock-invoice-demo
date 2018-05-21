'use strict';

const glob = require('glob');
const path = require('path');
const _ = require('lodash');
const fs = require('fs');
const frontMatter = require('front-matter');
const marked = require('marked');
const chalk = require('chalk');
const config = require('../../bedrock.config');
const paths = require('../paths');

const TEMPLATES_BASE_DIRECTORY = paths.content.templates.components;

function discover() {
  const files = glob.sync(path.join(TEMPLATES_BASE_DIRECTORY, '**/*.pug')).map(file => file.replace(/\//g, path.sep));
  let componentGroups = {};

  // Check if old `_patterns/` directory is still in use
  if (fs.existsSync(paths.content.templates.patterns)) {
    console.log(chalk.white.bgRed.bold('This project still uses the old `content/templates/_patterns/` directory.\nThis directory has been renamed to `content/templates/_components/`.\nPlease rename the folder in this project.\n'));
  }
  
  if (!config.styleguide) {
    return [];
  }

  for (const file of files) {
    const filename = file.replace(TEMPLATES_BASE_DIRECTORY, '').replace('.pug', '');
    const parts = filename.split(path.sep);
    const groupId = parts[0];
    const componentName = parts[1];
    const category = componentGroups[groupId];

    if (!category) {
      componentGroups[groupId] = {
        category: {
          id: groupId.split('-')[0],
          humanized: config.styleguide.componentCategories[groupId.split('-')[0]]
        },
        group: {
          id: groupId
        },
        components: []
      };

      try {
        const docsPath = path.join(TEMPLATES_BASE_DIRECTORY, groupId, '_docs.md');
        const docsContent = fs.readFileSync(docsPath, 'utf8');
        const parsedDocs = frontMatter(docsContent);

        parsedDocs.body = marked(parsedDocs.body);
        componentGroups[groupId].docs = parsedDocs;
      } catch (err) {

      }
    }

    const componentData = {
      filename,
      name: componentName,
    };


    try {
      const componentDocsPath = path.join(TEMPLATES_BASE_DIRECTORY, groupId, componentName + '.md');
      const componentDocsContent = fs.readFileSync(componentDocsPath, 'utf8');
      const parsedDocs = frontMatter(componentDocsContent);

      parsedDocs.body = marked(parsedDocs.body);
      componentData.docs = parsedDocs;
    } catch (err) {

    }

    componentGroups[groupId].components.push(componentData);
  }

  return {
    byGroup: componentGroups,
    byCategory: _.groupBy(componentGroups, (component) => component.category.humanized || 'No category')
  };

}

module.exports = {
  discover: discover
};
