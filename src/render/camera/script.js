const cameraWrapper = document.querySelector("div#camera-wrapper");
const video = document.querySelector("video#camera");
var stream = null;

navigator.mediaDevices.enumerateDevices().then((devices) => {
    let videoDevices = devices.filter((d) => d.kind == "videoinput").map((d) => ({
        label: d.label,
        id: d.deviceId
    }));
    electron.send("devices-list", videoDevices);
});

electron.on("set-border-radius", (e, radius) => {
    cameraWrapper.style.borderRadius = `${radius}%`;
});

electron.on("set-device", (e, deviceId) => {
    if(stream){
        stream.getTracks().forEach((track) => {
            track.stop();
        });
    }

    let constraints = {
        video: {
            deviceId: { exact: deviceId },
            width: { ideal: 1024 },
            height: { ideal: 1024 },
            frameRate: { ideal: 60 }
        }
    };

    navigator.mediaDevices.getUserMedia(constraints).then((receivedStream) => {
        stream = receivedStream;
        video.srcObject = stream;
    }).catch((err) => {
        console.error(err);
    });
});