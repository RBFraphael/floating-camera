
const { BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("path");
const serve = require("electron-serve");
const storage = require("./storage");
const camera = require("./camera");

var settingsWindow = null;

const render = serve({
    directory: path.join(__dirname, "../render/settings"),
    scheme: "settings"
});

const init = (windowIpc) => {
    settingsWindow = new BrowserWindow({
        width: 384,
        height: 210,
        x: storage.getItem("settingsWindowX", undefined),
        y: storage.getItem("settingsWindowY", undefined),
        title: "Floating Camera",
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    });

    Menu.setApplicationMenu(Menu.buildFromTemplate([]));

    render(settingsWindow).then(() => {
        settingsWindow.loadURL("settings://-");

        settingsWindow.webContents.on("did-finish-load", () => {
            let size = storage.getItem("size", 256);
            let radius = storage.getItem("radius", 0);

            settingsWindow.webContents.send("load-settings", {
                size, radius
            });
        });
    });

    settingsWindow.on("close", () => {
        let position = settingsWindow.getPosition();
        storage.setItem("settingsWindowX", position[0]);
        storage.setItem("settingsWindowY", position[1]);
        windowIpc.emit("settings-closed");
    });

    windowIpc.on("camera-closed", () => {
        settingsWindow.close();
    });

    ipcMain.on("devices-list", (e, devices) => {
        settingsWindow.webContents.send("devices-list", devices);
    });
};

const getWindow = () => {
    return settingsWindow;
};

module.exports = {
    init,
    getWindow
}