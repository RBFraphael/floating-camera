const size = document.querySelector("input#size");
const round = document.querySelector("input#round");
const deviceSelector = document.querySelector("select#device");

size.addEventListener("change", (e) => {
    electron.send("set-size", size.value);
});
size.addEventListener("input", (e) => {
    if(size.value){
        electron.send("set-size", size.value);
    }
});

round.addEventListener("input", (e) => {
    if(round.value){
        electron.send("set-border-radius", round.value);
    }
});
round.addEventListener("change", (e) => {
    if(round.value){
        electron.send("set-border-radius", round.value);
    }
});

electron.on("load-settings", (e, settings) => {
    size.value = settings.size;
    round.value = settings.radius;
});

electron.on("devices-list", (e, devices) => {
    deviceSelector.innerHTML = "";

    let option = document.createElement("option");
    option.value = "";
    option.textContent = "Select a video device";
    option.disabled = true;
    option.selected = true;
    deviceSelector.appendChild(option);

    devices.forEach((device) => {
        let option = document.createElement("option");
        option.value = device.id;
        option.textContent = device.label;
        deviceSelector.appendChild(option);
    });
});

deviceSelector.addEventListener("change", (e) => {
    let deviceId = deviceSelector.value;
    electron.send("set-device", deviceId);
});