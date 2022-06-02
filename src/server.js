const express = require('express');
const app = express();
const expressWs = require('express-ws')
const { ipcMain, BrowserWindow } = require('electron')
const { nanoid } = require('nanoid')

const wsConnectMap = {}
expressWs(app)
let window = null
const initServe = (win) => {
  window = win
  app.get('/', function (req, res) {
    res.send('hello world');
  });
  app.ws('/action', action)
  app.listen(3058)
}
ipcMain.on('send-action', (event, msg) => {
  console.log('sendMSg',msg)
  for (const key in wsConnectMap) {
    const room = wsConnectMap[key]
    const { ws } = room
    ws.send(msg)
  }
})
const action = function (ws, req) {
  const connectionId = nanoid()
  wsConnectMap[connectionId] = { ws }
  ws.send('connect to success')
  ws.on('message', function (msg) {
    console.log('receiveMessage:',msg)
    try {
      msg = JSON.parse(msg)
    } catch (e) {
    }
      BrowserWindow.getAllWindows()[0].webContents.send(
        'receive',
        msg
      )
  })
  let timer = setInterval(() => {
    ws.send(`keepalive${new Date()}`)
  }, 5000)

  ws.on('close', function (e) {
    console.log('close connection')
    clearInterval(timer)
    timer = undefined
    delete wsConnectMap[connectionId]
  })
}

module.exports = {
  initServe
}