const Electron = require('electron')

const zh = 'zh-Hans';
const en = 'en';
let timerID = null;
new Vue({
    el: "#app",
    data () {
        return {
            word: '',
            translate: '',
            from: zh,
            to: en,
            fixed: true,
        }
    },
    created () {
        console.log('created')
    },
    methods: {
        onInputChange () {
            if (timerID !== null) {
                clearTimeout(timerID)
                timerID = null;
            }
            timerID = setTimeout(() => {
                this.translate = ''
                if (this.word.length > 0) {
                    this.onTranslate();
                } else {
                }
            }, 400)
        },
        onTranslate () {
            const { translate } = require('bing-translate-api')

            translate(this.word, this.from, this.to, true).then(ret => {
                this.translate = ret.translation;
                console.log(this.translate)
            }).catch(e => {
                console.error(e);
            })
        },
        closePanel () {
            Electron.ipcRenderer.send('close-window');
        },
        onFixed () {
            this.fixed = true;
            Electron.ipcRenderer.send('fixed-window');
        },
        unFixed () {
            this.fixed = false;
            Electron.ipcRenderer.send('un-fixed-window');
        },
        onChangeLanguage () {
            let tmp = this.from;
            this.from = this.to;
            this.to = tmp;
        },
        getFromLanguage () {
            return this._getLanguage(this.from)
        },
        getToLanguage () {
            return this._getLanguage(this.to);
        },
        _getLanguage (lan) {
            let map = {};
            map[zh] = '中文';
            map[en] = '英文';
            return map[lan] || '未知';
        }
    }
})
