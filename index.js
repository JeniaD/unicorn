const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const { startProxy, getLogs, setIntercepting } = require('./proxy');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'renderer.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('public/index.html');
}

app.whenReady().then(() => {
  createWindow();
  startProxy();

  // HTTP API
  const api = express();
  api.use(bodyParser.json());

  api.get('/logs', (req, res) => res.json(getLogs()));

  api.post("/toggle-intercept", (req, res) => {
    const { enabled } = req.body;
    setIntercepting(enabled);
    res.json({ status: 'ok' });
  })

  api.listen(3000, () => console.log('API listening on port 3000'));
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

