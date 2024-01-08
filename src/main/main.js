const { app, BrowserWindow } = require("electron");
const camera = require("./camera");
const { EventEmitter } = require("events");

const windowIpc = new EventEmitter();

const init = () => {
    camera.init(windowIpc);
};

app.on("ready", () => {
    init();
});

app.on("window-all-closed", () => {
    app.quit();
});