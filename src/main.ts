let useCompass = false;
let direction = 0;
let deviceAngle = 0;

const latInput = document.getElementById("lat") as HTMLInputElement;
const lngInput = document.getElementById("lng") as HTMLInputElement;
const output = document.getElementById("output")!;
const compassImg = document.getElementById("compass") as HTMLImageElement;

document.getElementById("manualBtn")?.addEventListener("click", () => {
    if (latInput.value && lngInput.value) {
        fetchQibla(latInput.value, lngInput.value);
    }
});

document.getElementById("locationBtn")?.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude.toString();
            const lng = position.coords.longitude.toString();
            latInput.value = lat;
            lngInput.value = lng;
            fetchQibla(lat, lng);
            useCompass = true;
        },
        () => alert("Unable to get your location")
    );
});

function fetchQibla(lat: string, lng: string) {
    fetch(`https://api.aladhan.com/v1/qibla/${lat}/${lng}`)
        .then((res) => res.json())
        .then((data) => {
            direction = data.data.direction;
            output.textContent = `Qibla Direction: ${direction.toFixed(2)}°`;
            compassImg.src = `https://api.aladhan.com/v1/qibla/${lat}/${lng}/compass`;
            compassImg.style.display = "block";
            updateRotation();
        });
}

function updateRotation() {
    if (useCompass) {
        compassImg.style.transform = `rotate(${direction - deviceAngle}deg)`;
    } else {
        compassImg.style.transform = "none";
    }
}

if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", (event) => {
        if (event.alpha !== null) {
            deviceAngle = event.alpha;
            updateRotation();
        }
    });
}