const { app } = require("electron");
const path = require("path");
const fs = require("fs");

const appDataPath = app.getPath("appData");
const storagePath = path.join(appDataPath, "settings.json");

var storage = {};

const setItem = (key, value = null) => {
    storage[key] = value;
    saveStorage();
};

const getItem = (key, defaultValue = null) => {
    loadStorage();

    if(storage.hasOwnProperty(key)){
        return storage[key];
    }

    return defaultValue;
};

const getAll = () => {
    loadStorage();

    return storage;
};

const removeItem = (key) => {
    loadStorage();

    if(storage.hasOwnProperty(key)){
        delete storage[key];
        saveStorage();
    }
};

const flush = () => {
    storage = {};
    saveStorage();
};

const loadStorage = () => {
    if(fs.existsSync(storagePath)){
        let data = fs.readFileSync(storagePath);
        storage = JSON.parse(data);
    }
};

const saveStorage = () => {
    let data = JSON.stringify(storage);
    fs.writeFileSync(storagePath, data);
};

module.exports = {
    setItem,
    getItem,
    getAll,
    removeItem,
    flush
};