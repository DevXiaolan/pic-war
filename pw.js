#!/usr/bin/env node
"use strict";

const yargs = require('yargs');
const EOL = require('os').EOL;
const colors = require('colors');
const Render = require('./libs/render');
const manager = require('./libs/manager');

let argv = yargs.argv;
let params = argv['_'];

if(params.length<1){
  console.log(`${EOL}pw list ${'列出所有斗图招式'.gray}`);
  process.exit(-1);
}
const bg = params.shift();
switch (bg) {
  case 'add':
    manager.add();
    break;
  case 'edit':
    manager.edit();
    break;
  case 'list':
    console.log('commands list:'.yellow);
    console.log(manager.list());
    console.log(`"${'pw {command} -h'.green}" for more detail`);
    break;
  default:
    let instance = new Render(bg, params);
    if(argv.h){
      instance.usage();
    }else {
      instance.painting();
      console.log('done! do "ctrl+v" on any IM window'.green);
    }
    break;
}

process.exit(-1);
