let Path = require('path');
let pack = require('cc-plugin-packer');
pack({
    version: '3.x', // 插件版本：2.x / 3.x
    plugin: Path.join(__dirname, '../extensions/translate'),
    // 过滤插件的文件，相对于plugin目录的相对路径
    filterFiles: [
        'README.md',
        'readme.js' // 无效的文件
    ],
    // 不压缩的JS代码
    dontMinJs: [
        'vue.min.js',
    ],
    // 默认的插件打包文件存放位置，默认在project/out
    out: Path.join(__dirname, '../out'),
    // 打包完毕后是否在文件夹中显示
    show: true,
});
