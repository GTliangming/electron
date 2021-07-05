import { MessageBoxOptions } from "electron";

const { ipcRenderer } = require("electron");

export const confirmMessageBox = (key: string, options: MessageBoxOptions) => {
    ipcRenderer.send("comfirm-success-info", {
        options,
        confirmMessageBox
    });
};

// options: {
//     title: "游戏结束!",
//     type: "info",
//     message: `游戏结束,${winer}获胜！`,
//     buttons: ["重新开始游戏", "继续游戏"]
//   } as MessageBoxOptions,