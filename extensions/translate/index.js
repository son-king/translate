const Electron = require('electron');

const zh = 'zh-Hans';
const en = 'en';
let timerID = null;
let tipsTimerID = null;
new Vue({
    el: '#app',
    data () {
        return {
            word: '',
            translate: '',
            from: zh,
            to: en,
            fixed: true,
            tips: '',
            loading: false,
        };
    },
    created () {
        console.log('created');
        Electron.ipcRenderer.on('get-config', (event, data) => {
            if (!data) return;

            function valid (lan) {
                let arr = [zh, en];
                return arr.find(el => el === lan);
            }

            if (data.hasOwnProperty('from') && valid(data.from)) {
                this.from = data.from;
            }
            if (data.hasOwnProperty('to') && valid(data.to)) {
                this.to = data.to;
            }
        });
        Electron.ipcRenderer.send('get-config');
    },
    mounted () {
        this.$nextTick(() => {
            let word = this.$refs.word;
            if (word) {
                word.focus();
            }
        });
    },
    methods: {
        onInputChange () {
            if (timerID !== null) {
                clearTimeout(timerID);
                timerID = null;
            }
            timerID = setTimeout(() => {
                this.translate = '';
                if (this.word.length > 0) {
                    this.onTranslate();
                } else {
                }
            }, 400);
        },
        onHelp(){
            let url = "http://tidys.gitee.io/doc/#/docs/translate/index";
            Electron.shell.openExternal(url);
        },
        onTranslate () {
            const { translate } = require('bing-translate-api');
            this.loading = true;
            translate(this.word, this.from, this.to, true).then(ret => {
                this.loading = false;
                if (this.word.length > 0) {
                    this.translate = ret.translation;
                    console.log(this.translate);
                } else {
                    // 翻译过程中删除了word，就丢弃掉翻译结果
                    this.translate = '';
                }
            }).catch(e => {
                console.error(e);
                this.loading = false;
            });
        },
        onClickTranslateResult () {
            if (this.translate) {
                Electron.clipboard.writeText(this.translate);
                this.onTips('成功复制到剪切板！');
            }
        },
        _format (data) {
            if (data.toString().length === 1) {
                return `0${data}`;
            }
            return data;
        },
        onTips (str) {
            let time = new Date();
            let h = this._format(time.getHours());
            let m = this._format(time.getMinutes());
            let s = this._format(time.getSeconds());
            this.tips = `[${h}:${m}:${s}] ${str}`;
            if (tipsTimerID) {
                clearTimeout(tipsTimerID);
            }
            tipsTimerID = setTimeout(() => {
                this.tips = '';
            }, 1500);
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
            this.onInputChange();
            Electron.ipcRenderer.send('save-from-to', this.from, this.to);
        },
        getFromLanguage () {
            return this._getLanguage(this.from);
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
});
