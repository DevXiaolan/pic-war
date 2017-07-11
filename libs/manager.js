/**
 * Created by lanhao on 2017/7/3.
 */

'use strict';

const fs = require('fs');
const HOME = process.env['HOME'];
const readline = require('readline-sync');
const colors = require('colors');

let manager = {};

manager.add = () => {
  console.log('准备创建斗图招式'.yellow);
  let config = {};
  config.path = readline.question('底图的绝对路径:');
  if(!fs.existsSync(config.path) || (!config.path.endsWith('.png') && !config.path.endsWith('.jpg'))){
    console.log('根本没有这种操作！（图片不存在）'.red);
    process.exit(-1);
  }
  config.position = null;
  while( !['top', 'bottom'].includes(config.position)){
    config.position = readline.question('字幕的位置(目前只支持 top, bottom):');
  }

  config.color = '';
  while (!isColor(config.color)){
    config.color = readline.question('字幕颜色(格式：0,0,0 to 255,255,255)');
  }

  config.t = readline.question('字幕模板，使用@@作占位符(如：我可能@@)');

  let list = manager.list();
  config.name = readline.question('这一招的名字：');
  while (list.includes(config.name)){
    config.name = readline.question('这个名字已经用过了：');
  }
  config.usage = makeUsage(config);

  fs.writeFileSync(`${HOME}/.pw/${config.name}.json`, JSON.stringify(config));
  console.log(`Done! Try: ${config.usage}`.green);
};

manager.edit = () => {
  let list = manager.list();
  console.log(list);
  let name = readline.question('你要修改哪一招？');
  if(!list.includes(name)){
    console.log('根本没有这样的操作!'.red);
    process.exit(-1);
  }
  console.log(`准备编辑斗图招式${name}`.yellow);
  let config = require(`${HOME}/.pw/${name}.json`);

  config.path = readline.question(`底图的绝对路径:${'此项不变直接Enter'.gray}`, {defaultInput:config.path});
  if(!fs.existsSync(config.path) || (!config.path.endsWith('.png') && !config.path.endsWith('.jpg'))){
    console.log('根本没有这种操作！（图片不存在）'.red);
    process.exit(-1);
  }

  config.position = readline.question(`字幕的位置(目前只支持 top, bottom, bottom-right, bottom-left):${'此项不变直接Enter'.gray}`, {defaultInput:config.position});
  while( !['top', 'bottom', 'bottom-right', 'bottom-left'].includes(config.position)){
    config.position = readline.question(`字幕的位置(目前只支持 top, bottom, bottom-right, bottom-left):${'此项不变直接Enter'.gray}`, {defaultInput:config.position});
  }

  config.color = readline.question(`字幕颜色(格式：0,0,0 to 255,255,255):${'此项不变直接Enter'.gray}`, {defaultInput:config.color});
  while (!isColor(config.color)){
    config.color = readline.question(`字幕颜色(格式：0,0,0 to 255,255,255):${'此项不变直接Enter'.gray}`, {defaultInput:config.color});
  }

  config.t = readline.question(`字幕模板，使用@@作占位符(如：我可能@@),${'此项不变直接Enter'.gray}`, {defaultInput:config.t});

  config.usage = makeUsage(config);

  fs.writeFileSync(`${HOME}/.pw/${config.name}.json`, JSON.stringify(config));
  console.log(`Done! Try: ${config.usage}`.green);
};

manager.list = () => {
  init();
  let list = [];
  let files = fs.readdirSync(HOME + '/.pw');
  for(let k in files){
    if(! files[k].endsWith('.json')){
      continue;
    }
    list.push(files[k].replace('.json', ''));
  }
  return list;
};

const init = () => {
  if(!fs.existsSync(HOME + '/.pw')) {
    fs.mkdirSync(HOME + '/.pw');
  }
};

/**
 *
 * @param c
 * @returns {boolean}
 */
const isColor = (c) => {
  let [r,g,b] = c.split(',', 3);
  return (!isNaN(Number(r)) && !isNaN(Number(g)) && !isNaN(Number(b)));
};

/**
 *
 * @param cnf
 * @returns {string}
 */
const makeUsage = (cnf) => {
  let count = cnf.t.split('@@').length - 1;
  return `pw ${cnf.name}${' xx'.repeat(count)}`;
};

module.exports = manager;
