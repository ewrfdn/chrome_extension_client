const net = require("net");
const { ipcMain, BrowserWindow } = require("electron");

let window = null;
export function init(win) {
  window = win;

  const socket = new net.Socket();

  const port = 3059;

  const hostname = "127.0.0.1";

  socket.setEncoding = "UTF-8";
  ipcMain.on("send-action", (event, msg) => {
    console.log("sendMSg", msg);
    socket.write(msg);
  });
  socket.connect(port, hostname, function () {});

  socket.on("data", function (msg) {
    msg = msg.toString("utf-8");
    console.log("receiveMessage:", msg);
    try {
      msg = JSON.parse(msg);
    } catch (e) {}
    BrowserWindow.getAllWindows()[0].webContents.send("receive", msg);
  });

  socket.on("error", function (error) {
    console.log("error:" + error);
  });

  socket.on("close", function () {
    console.log("close");
  });
}
