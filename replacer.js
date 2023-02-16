#!/usr/bin/env node

import fs from 'fs'


// It is a somewhat ugly hack. Unfortunately this is the only easy way for now 
// to be able to include images and be able to view them at the preview.
// Basically, what is done here is that we make the `check-md` ignore URLs which end with `.png`
const fileData = fs.readFileSync('./node_modules/check-md/index.js')
    .toString()
    .replace(String.raw`(ignoreFootnotes && char.startsWith('[^')) || (urlObj.pathname && urlObj.pathname.endsWith('.png'))`, String.raw`ignoreFootnotes && char.startsWith('[^')`)
    .replace(String.raw`ignoreFootnotes && char.startsWith('[^')`, String.raw`(ignoreFootnotes && char.startsWith('[^')) || (urlObj.pathname && urlObj.pathname.endsWith('.png'))`);

fs.writeFileSync('./node_modules/check-md/index.js', fileData);
