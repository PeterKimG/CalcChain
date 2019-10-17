const { createStore } = require('key-store')
 
const store = createStore('/keystore/key.txt', '0x0000')
 
store.saveKey('test-key', 'arbitrary password', { privateKey: 'super secret private key' })
 
const { privateKey } = store.getPrivateKeyData('test-key', 'arbitrary password')
 
console.log(`Stored private key: ${privateKey}`)
console.log(`All stored keys' IDs: ${store.getKeyIDs().join(', ')}`)