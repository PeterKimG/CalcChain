const bufferText = Buffer.from('hello world', 'utf8');
console.log(bufferText);


const text = bufferText.toString('hex');
console.log(text);

console.log(bufferText.toString());

console.log('0x'+Buffer.from('hello world').toString('hex'));