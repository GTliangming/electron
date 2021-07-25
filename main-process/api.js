const { ipcMain, dialog } = require("electron");
const fs = require("fs");
const path = require('path');
const https = require('https');
var request = require('request');

const conf = {
    files: [],
    Exts: ['.jpg', '.png', '.jpeg'],
    Max: 5200000, // 5MB == 5242848.754299136
}
// // 生成随机IP， 赋值给 X-Forwarded-For
const getRandomIP = () => {
    return Array.from(Array(4)).map(() => parseInt(Math.random() * 255)).join('.')
}
/**
 * TinyPng 远程压缩 HTTPS 请求的配置生成方法
 */
const requestConf = {
    method: 'POST',
    hostname: 'tinypng.com',
    path: '/web/shrink',
    headers: {
        rejectUnauthorized: false,
        'Postman-Token': Date.now(),
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent':
            'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
    }
};
ipcMain.on("open-directory-dialog", function (event, { properties, id }) {
    dialog.showOpenDialog({
        properties
    }).then(res => {
        if (res) { // 如果有选中
            // 发送选择的对象给子进程
            event.sender.send("selectedItem", { id, path: res.filePaths[0] })
        }
    })
});
ipcMain.on("picture-compression", function (event, res) {
    const { sourcePath, targetPath } = res
    // 读取文件夹
    fs.readdirSync(sourcePath).forEach(file => {
        let fullFilePath = path.join(sourcePath, file)
        // 读取文件信息
        let fileStat = fs.statSync(fullFilePath);
        // 过滤文件安全性/大小限制/后缀名
        if (fileStat.size <= conf.Max && fileStat.isFile() && conf.Exts.includes(path.extname(file))) {
            conf.files.push(fullFilePath)
        };
    });

    console.log("本次执行脚本的配置：", conf);
    console.log("等待处理文件的数量:", conf.files.length)
    if (conf.files.length > 10) {
        conf.files = [];
        event.sender.send("picture-compression-end", { result: false, msg: `单次最多选择10张图片！` })
        return;
    }
    let resultInfo = [];
    conf.files.forEach(imgPath => {
        requestConf.headers['X-Forwarded-For'] = getRandomIP();
        let req = https.request(requestConf, (res) => {
            res.on('data', buf => {
                let obj = JSON.parse(buf.toString());
                if (obj.error) {
                    conf.files = [];
                    event.sender.send("picture-compression-end", { result: false, msg: `压缩失败！\n 当前文件：${imgPath} \n ${obj.message}` })
                } else {
                    console.log(4);
                    // 循环调用,请求图片数据
                    let readStream = request(obj.output.url)
                    readStream.on('error', function (err) {
                        console.log(err);
                        conf.files = [];
                        event.sender.send("picture-compression-end", { result: false, msg: `向目标文件夹写入文件失败！请重试！` })
                        return;
                    })
                    const resultItem = {
                        imgName: imgPath.slice(imgPath.lastIndexOf("/"), imgPath.length + 1),
                        OptimizationRatio: `${((1 - obj.output.ratio) * 100).toFixed(2)}%`,
                        OriginalSize: `${(obj.input.size / 1024).toFixed(2)}KB `,
                        CompressedSize: `${(obj.output.size / 1024).toFixed(2)}KB`,
                    }
                    resultInfo.push(resultItem)
                    console.log("resultInfo", resultInfo)

                    //通过流的方式，把图片写到本地
                    readStream.pipe(fs.createWriteStream(targetPath + resultItem.imgName));
                    conf.files = [];
                    event.sender.send("picture-compression-end", { result: true, msg: `文件压缩成功！`, value: resultInfo })
                }
            });
        });
        console.log(2);
        req.write(fs.readFileSync(imgPath), 'binary');
        req.on('error', e => {
            console.error(e);
        });
        req.end();
    });

});