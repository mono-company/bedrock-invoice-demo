'use strict';

const fs = require('fs');
const _ = require('lodash');
const paths = require('../paths');

function discover() {
  const CATEGORY_REGEX = /\/\*\s(.*)/g;

  const scss = fs.readFileSync(paths.content.scss.colorsDefinition, 'utf-8');
  let colorCategories = [];
  let currentCategory;

  for (const scssLine of scss.split('\n')) {
    const categoryData = CATEGORY_REGEX.exec(scssLine);
    const colorLine = scssLine.split(':');
    let colorData = null;

    if (colorLine.length === 2) {
      colorData = {
        name: colorLine[0].trim(),
        value: colorLine[1].trim().replace(';', '')
      };
    }

    if (categoryData && categoryData[1].indexOf('===') === -1) {
      currentCategory = categoryData[1];
    }

    if (currentCategory) {
      var category = _.find(colorCategories, {name: currentCategory});

      if (!category) {
        category = {
          name: currentCategory,
          colors: []
        };

        colorCategories.push(category);
      }

      if (colorData) {
        category.colors.push(colorData);
      }
    }
  }

  return colorCategories;
}

module.exports = {
  discover: discover
};
