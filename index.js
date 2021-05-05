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
  console.log('Структура: method GET/POST/PUT/DELETE|endpoint URL|show FLATTEN_ADDRESS|body JSON')
  while(true) {
    let query = (await prompt('Запрос: '))
    if(query == 'exit') process.exit()

    query = query.split(/\s*\|\s*/)
    if(query.length == 0) continue

    let method = 'GET'
    let endpoint
    let objAddress
    let body

    for(let info of query) {
      info = info.split(' ')
      switch(info[0]) {
        case 'method':
          method = info[1]
          break
        case 'endpoint':
          if(!info[1].includes(base)) {
            if(!info[1].startsWith('/')) info[1] = '/' + info[1]
            info[1] = base + info[1]
          }
          endpoint = info[1]
          break
        case 'show':
          objAddress = info[1]
          break
        case 'body':
          try {
            body = JSON.parse(info[1])
          } catch(e) {
            console.error('Не удалось распарсить body.', e.toString())
            continue
          }
          break
        default:
          console.log('Неизвестный параметр', info[0])
      }
    }

    if(!endpoint) {
      console.log('Укажите эндпоинт в следующий раз.')
      continue
    }

    console.log('Метод:', method)
    console.log('Эндпоинт:', endpoint)
    console.log('Показать объект:', objAddress ? objAddress : 'весь')
    console.log('Тело запроса:', body)
    let sure = await prompt('Вы уверены (y/да/n/нет)? ')
    if(!['y', 'да'].includes(sure)) {
      console.log('Запрос отменён.')
      continue
    }

    let request = await fetch(endpoint, { body, headers, method })
    let output = await request.json()
    if(objAddress) {
      let keys = objAddress.split('.')
      for(let key of keys) {
        if(!output[key]) {
          console.log('Предупреждение: отсутсвует ключ', key, 'указанный в objAddress')
          break
        }
        output = output[key]
      }
    }

    console.log(output)
  }
})()