#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

let packageJson;

// read the package.json and store the values of dev dependencies in an object
try {
  packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
} catch(err) {
  console.error(`Cannot open package.json:`, err);
  process.exit(1);
}

// check if there are any devDependencies
if(!packageJson.devDependencies) {
  console.error(`There are no devDependencies in package.json.`);
  process.exit(0);
}

// create an array with the keys in the packageJson.devDependencies and point to a new variablet
devDependencies = Object.keys(packageJson.devDependencies)
console.log(`This app includes the following development dependencies:
---
` + devDependencies.join(' '))
