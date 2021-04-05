let win = null;
const Electron = require('electron')

function closeWin () {
    if (win) {
        win.close()
        win = null;
    }
}

exports.load = () => {
    console.log('load')
    let msg = {
        'close-window': (event, arg) => {
            closeWin();
        },
        "fixed-window": () => {
            if (win) {
                win.setAlwaysOnTop(true);
            }
        },
        "un-fixed-window": () => {
            if (win) {
                win.setAlwaysOnTop(false);
            }
        }
    }
    for (let key in msg) {
        Electron.ipcMain.on(key, msg[key]);
    }
}

exports.unload = () => {
    console.log('unload')
}
exports.methods = {
    open_panel () {
        if (win) {
            win.show();
            win.focus();
            return;
        }
        const Path = require('path')
        const Electron = require('electron');
        win = new Electron.BrowserWindow({
            width: 800,
            height: 600,
            frame: false,
            webPreferences: {
                nodeIntegration: true,
            }
        });
        win.setAlwaysOnTop(true);
        let html = Path.join(__dirname, 'index.html');
        win.loadURL(`file://${html}`);
        win.on('closed', () => {
            win = null;
        });
        win.on('blur', () => {
            // closeWin();
        })
        win.webContents.openDevTools();
        win.show();
    }
}
