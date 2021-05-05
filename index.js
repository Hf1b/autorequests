const base = 'https://discord.com/api/v9'
const headers = {
  Authorization: 'token'
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
    let query = await prompt('Запрос: ')
    let request = await fetch(base + query, { headers })
    let output = await request.json()

    console.log(output)
  }
})()