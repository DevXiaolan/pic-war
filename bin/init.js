#!/usr/bin/env node

'use strict';

const fs = require('fs');
const HOME = process.env['HOME'];
const helpers = require('../libs/helpers');

const basePath = __dirname + '/../';

if(!fs.existsSync(HOME+'/.pw')){
  fs.mkdirSync(HOME+'/.pw');
  helpers.copyR(basePath+'/files', HOME+'/.pw');
}