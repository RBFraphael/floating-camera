const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
    send: ipcRenderer.send,
    on: (channel, callback) => {
        ipcRenderer.on(channel, callback);
    },
});
