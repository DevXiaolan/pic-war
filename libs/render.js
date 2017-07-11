/**
 * Created by lanhao on 2017/7/1.
 */

'use strict';
const fs = require('fs');
const HOME = process.env['HOME'];
const colors = require('colors');
const gd = require('node-gd');
const EOL = require('os').EOL;
const open = require('open');

class Render {
  constructor(name, params) {
    if (!fs.existsSync(HOME + `/.pw/${name}.json`)) {
      console.log(`[${name}] is not exist, try "pw list"`.yellow);
      process.exit(-1);
    }
    this.name = name;
    this.config = require(HOME + `/.pw/${name}.json`);
    this.params = params;
  }

  usage() {
    console.log(`${EOL}USAGE: ${this.config.usage}${EOL}`.yellow);
  }

  painting() {
    let config = this.config;

    gd.openFile(config.path.replace('~', HOME), (err, img) => {

      if (err) {
        console.log('load img failed' + EOL);
        process.exit(-1);
      }
      let textSize = Number.parseInt((img.height + img.width) / 36);

      let color = this.color(config.color);
      let txtColor = img.colorAllocate(1 * color[0], 1 * color[1], 1 * color[2]);

      config.t = this.text(config.t);

      let position = this.position(img, textSize);

      img.stringFT(txtColor, __dirname + '/../font.ttf', textSize, 0, position[0], position[1], config.t);

      img.saveFile(HOME + '/newFile.png', (err) => {

        img.destroy();
        if (err) {
          throw err;
        }
        let filename = HOME + '/newFile.png';
        let command = `osascript -e 'set the clipboard to (read (POSIX file "${filename}") as JPEG picture)'`;
        require('child_process').exec(command);
      });
    });
  }

  color(c) {
    if (c == undefined) {
      return [0, 0, 0];
    }
    c = c.split(',');
    if (c.length === 3) {
      return c;
    } else {
      return [0, 0, 0];
    }
  }

  position(img, textSize) {
    let x = 0;
    let y = 0;
    switch (this.config.position) {
      case 'top':
        x = Number.parseInt(img.width * 0.5 - (this.config.t.length+1) * textSize/2);
        y = Number.parseInt(img.height * 0.1);
        return [x, y];
        break;
      case 'bottom-right':
        x = Number.parseInt(img.width * 0.55);
        y = Number.parseInt(img.height * 0.9);
        return [x, y];
        break;
      case 'bottom-left':
        x = Number.parseInt(img.width * 0.5-(this.config.t.length+1) * textSize);
        y = Number.parseInt(img.height * 0.9);
        return [x, y];
        break;
      case 'bottom':
      default:
        x = Number.parseInt(img.width * 0.5 - (this.config.t.length+1) * textSize/2);
        y = Number.parseInt(img.height * 0.9);
        return [x, y];
        break;
    }
  }

  text(t) {
    for (let k in this.params) {
      t = t.replace('@@', this.params[k]);
    }
    return t;
  }
}

module.exports = Render;