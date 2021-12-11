
const https = require('https');
const lodash = require('lodash');
const fs = require('fs')
const crypto = require('crypto');
const { API_URL } = require('./constants');

https.get(`${API_URL}`, (res) => {
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  })

  res.on('end', () => {
    const data = JSON.parse(body);
    const finalResult = [];
    const parsedList = data.data.split(', ').map((i) => i.split('='));

    for (let i = 0; i < parsedList.length; i+=2) {
      const pair = lodash.fromPairs([parsedList[i], parsedList[i+1]]);
      finalResult.push(pair);
    }
    const ageFilteredList = finalResult.filter((item) => parseInt(item.age) === 32);
    writeToFile(ageFilteredList)    
  })
});


const writeToFile = (list) => {
  try {
    let writeStream = fs.createWriteStream('output.txt');
    for (let item of list) {
      writeStream.write(`${item.key}\n`, 'utf8')
    }

    writeStream.on('finish', () => {
      outputFileHash()
    })
    writeStream.end()
  } catch(error) {
    console.log(error)
  }
}

const outputFileHash = () => {
  const fileBuffer = fs.readFileSync('output.txt');
  const fileHash = crypto.createHash('sha1').update(fileBuffer).digest('hex')
  const hashWithTokenX = `${fileHash}y97cwqhbvad`.replace(/(..)./g, "$1X")
  return hashWithTokenX;
}


