#!/usr/bin/env node
const rimraf = require("rimraf");
var fs = require("fs");
const sharp = require("sharp");
const [, , ...args] = process.argv;
const [sourceFile, destinationPath] = args;
const fileName = sourceFile.split("/").slice(-1)[0].split(".")[0];
const sizes = [16, 32, 48, 128];
const create = (s) =>
  new Promise((rs, rj) => {
    sharp(sourceFile)
      .rotate()
      .resize(s, s)
      .toFile(`${destinationPath}/${fileName}x${s}.png`)
      .then((d) => rs())
      .catch((e) => {
        rj(e);
      });
  });

const cli = async () => {
  await new Promise((rs, rj) =>
    rimraf(destinationPath, { disableGlob: true }, () => rs())
  );
  if (!fs.existsSync(destinationPath)) {
    fs.mkdirSync(destinationPath);
  }
  await Promise.all(sizes.map((s) => create(s)));
};

cli();
