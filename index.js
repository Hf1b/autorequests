const fs = require('fs')

if(!fs.existsSync('token.txt')) {
  console.error('Укажите токен в файле token.txt')
  process.exit()
}

const token = fs.readFileSync('token.txt').toString().trim()

const base = 'https://discord.com/api/v9'
const headers = {
  Authorization: token
}

const fetch = require('node-fetch')

const prompt = message => {
  return new Promise((res,rej) => {
    process.stdout.write(message)
    process.stdin.once('data', data => {
      let output = data.toString().trim()
      res(output)
    })
  })
}

;(async()=> {
  console.log('База:', base)
  console.log('Для выхода нажмите Ctrl+C или напишите exit')
  while(true) {
    let query = (await prompt('Запрос: ')).split(' ')
    if(query.length == 0 || !query[0]) continue
    if(query[0] == 'exit') process.exit()

    if(!query[0].startsWith('/')) query[0] = '/' + query[0]

    let request = await fetch(base + query[0], { headers })
    let output = await request.json()
    if(query.length > 1) {
      let keys = query[1].split('.')
      for(let key of keys) {
        if(!output[key]) break
        output = output[key]
      }
    }

    console.log(output)
  }
})()