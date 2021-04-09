const Electron = require('electron');
const Path = require('path');
const Fs = require('fs');
module.exports = {
    _data: null,
    get data () {
        return this._data;
    },
    init () {
        this._data = this.getConfig();
    },
    _getConfigPath () {
        let userData = Electron.app.getPath('userData');
        let file = Path.join(userData, 'translate.json');
        if (!Fs.existsSync(file)) {
            Fs.writeFileSync(file, JSON.stringify({}, null, 4));
        }
        return file;
    },
    getConfig () {
        let file = this._getConfigPath();
        let data = {};
        try {
            data = JSON.parse(Fs.readFileSync(file, 'utf-8'));
        } catch (e) {

        }
        return data;
    },
    setData (key, value, bSave) {
        this._data[key] = value;
        this.save();
    },
    save () {
        let file = this._getConfigPath();
        Fs.writeFileSync(file, JSON.stringify(this._data, null, 4));
    }
};
