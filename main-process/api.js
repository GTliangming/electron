const { ipcMain, dialog } = require("electron");
const fs = require("fs");
const glob = require("glob");




// ipcMain.on("comfirm-success-info", function (event, { options }) {
//     dialog.showMessageBox(options).then(res => {
//         const result = res.response === 0 ? true : false;
//         event.sender.send("success-info", { choose: result })
//     })
// });