const { BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const serve = require("electron-serve");
const storage = require("./storage");
const settings = require("./settings");

var cameraWindow = null;

const render = serve({
    directory: path.join(__dirname, "../render/camera"),
    scheme: "camera"
});

const init = (windowIpc) => {
    cameraWindow = new BrowserWindow({
        width: 1,
        height: 1,
        x: storage.getItem("cameraWindowX", undefined),
        y: storage.getItem("cameraWindowY", undefined),
        title: "Floating Camera",
        transparent: true,
        frame: false,
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        },
        alwaysOnTop: true,
        skipTaskbar: true,
    });

    settings.init(windowIpc);

    render(cameraWindow).then(() => {
        cameraWindow.loadURL("camera://-");

        cameraWindow.webContents.on("did-finish-load", () => {
            let size = storage.getItem("size", 256);
            cameraWindow.setMinimumSize(parseInt(size), parseInt(size));
            cameraWindow.setSize(parseInt(size), parseInt(size));
    
            let radius = storage.getItem("radius", 0);
            cameraWindow.webContents.send("set-border-radius", radius);
        });
    });

    cameraWindow.on("close", () => {
        let position = cameraWindow.getPosition();
        storage.setItem("cameraWindowX", position[0]);
        storage.setItem("cameraWindowY", position[1]);
        windowIpc.emit("camera-closed");
    });

    windowIpc.on("settings-closed", () => {
        cameraWindow.close();
    });

    ipcMain.on("set-border-radius", (e, radius) => {
        cameraWindow.webContents.send("set-border-radius", radius);
        storage.setItem("radius", radius);
    });

    ipcMain.on("set-size", (e, size) => {
        cameraWindow.setMinimumSize(parseInt(size), parseInt(size));
        cameraWindow.setSize(parseInt(size), parseInt(size));
        storage.setItem("size", size);
    });

    ipcMain.on("set-device", (e, deviceId) => {
        cameraWindow.webContents.send("set-device", deviceId);
    });
};

const getWindow = () => {
    return cameraWindow;
};

module.exports = {
    init,
    getWindow
}