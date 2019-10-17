const fs = require('fs')
const util = require('util')
const createStore = require('key-store')

let filePath = '/keystore'
 
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)
 
async function createFileStore (filePath) {
  const saveKeys = data => writeFile(filePath, JSON.stringify(data), 'utf8')
  const readKeys = async () => JSON.parse(await readFile(filePath, 'utf8'))
 
  return createStore(saveKeys, await readKeys())
}