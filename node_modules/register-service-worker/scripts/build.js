const fs = require('fs')
const path = require('path')
const buble = require('buble')

const input = fs.readFileSync(path.resolve(__dirname, '../src/index.js'), 'utf-8')
const output = buble.transform(input, {
  transforms: {
    modules: false
  }
})

fs.writeFileSync(path.resolve(__dirname, '../index.js'), output.code)
