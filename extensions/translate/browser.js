let win = null;
const Electron = require('electron');
let config = require('./config');

function closeWin () {
    if (win) {
        win.close();
        win = null;
    }
}

exports.load = () => {
    console.log('load');
    let msg = {
        'close-window': (event, arg) => {
            closeWin();
        },
        'fixed-window': () => {
            if (win) {
                win.setAlwaysOnTop(true);
            }
        },
        'un-fixed-window': () => {
            if (win) {
                win.setAlwaysOnTop(false);
            }
        },
        'save-from-to': (event, from, to) => {
            config.setData('from', from);
            config.setData('to', to);
            config.save();
        },
        'get-config': (event) => {
            if (event.sender) {
                event.sender.send('get-config', config.data);
            }
        }
    };
    for (let key in msg) {
        Electron.ipcMain.on(key, msg[key]);
    }
    config.init();
};

exports.unload = () => {
    console.log('unload');
};
exports.methods = {
    open_panel () {
        if (win) {
            win.show();
            win.focus();
            return;
        }
        const Path = require('path');
        const Electron = require('electron');
        let options = {
            width: 300,
            height: 100,
            minWidth: 300,
            minHeight: 100,
            frame: false,
            webPreferences: {
                nodeIntegration: true,
            }
        };
        if (config.data.hasOwnProperty('width')) {
            options.width = config.data.width;
        }
        if (config.data.hasOwnProperty('height')) {
            options.height = config.data.height;
        }
        // if (config.data.hasOwnProperty('x')) {
        //     options.x = config.data.x;
        // }
        // if (config.data.hasOwnProperty('y')) {
        //     options.y = config.data.y;
        // }

        win = new Electron.BrowserWindow(options);
        win.setAlwaysOnTop(true);
        let html = Path.join(__dirname, 'index.html');
        win.loadURL(`file://${html}`);
        win.on('closed', () => {
            win = null;
        });
        win.on('blur', () => {
            closeWin();
            // if (!win.isAlwaysOnTop()) {
            // }
        });
        win.on('resize', () => {
            let size = win.getSize();
            config.setData('width', size[0]);
            config.setData('height', size[1]);
            config.save();
        });
        // win.webContents.openDevTools();
        win.show();
    }
};
