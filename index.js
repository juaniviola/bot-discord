const Discord = require('discord.js')
const client = new Discord.Client()
const rp = require('request-promise')
const cheerio = require('cheerio')
require('dotenv').config()

client.on('ready', () => {
  console.log(`ready: ${client.user.tag}`)
})

client.on('message', async (msg) => {
  if (msg.content === 'hola') {
    msg.reply('Hola vieja!')
  }

  if (msg.content.includes('!help')) {
    msg.reply(`
      Para usar los comandos debes anteponer el signo [!]
      [me] informacion sobre mi
      [author] redes sociales del creador del bot
      [clima] clima en buenos aires
      [dolar] precio del dolar en pesos
    `)
  }

  if (msg.content.includes('!author')) {
    msg.channel.send('https://twitter.com/juaniviola')
    msg.channel.send('https://instagram.com/juaniviola')
    msg.channel.send('https://github.com/juaniviola')
  }

  if (msg.content.includes('!dolar')) {
    let dolar    

    try {
      dolar = await getDolarPrice()
      msg.reply(`El dolar esta a $${dolar}.`)
    } catch (err) {
      console.error(err)
      msg.reply('No tengo idea')
    }
  }

  if (msg.content.includes('!clima')) {
    const clima = await getClima()
    msg.reply(`${clima.estado} en Buenos Aires, con una ${clima.temperatura} y una humedad del ${clima.humedad}`)
  }

  if (msg.content.includes('!me')) {
    msg.channel.send(`Hola ${msg.author} soy un bot y estoy programado para destruir la tierra :)`)
  }
})

const getDolarPrice = async () => {
  const options = {
    uri: 'https://precio-dolar.com.ar'
  }

  try {
    const result = await rp(options)
    const $ = cheerio.load(result)

    const dolar = $('span', '#exchange-main-description')
                    .text()
                    .split(' ')
    return dolar[dolar.indexOf('$')+2]
  } catch (err) {
    console.error(err)
  }
}

const getClima = async () => {
  const options = {
    uri: 'https://www.meteored.com.ar/tiempo-en_Buenos+Aires-America+Sur-Argentina-Ciudad+Autonoma+de+Buenos+Aires-SABE-1-13584.html'
  }

  try {
    const result = await rp(options)
    const $ = cheerio.load(result)
    const clima = {}

    clima.estado = $('strong', 'span.estado').text()
    clima.temperatura = $('span.sensacion', 'span.temperatura').text()
    clima.humedad = $('strong', 'span span.uv').text()

    return clima
  } catch (err) {
    console.error(err)
  }
}

const token = process.env.TOKEN
client.login(token)
