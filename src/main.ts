// src/main.ts
let currentQibla: number | null = null;

async function fetchQibla(lat: number, lon: number): Promise<void> {
    try {
        const res = await fetch(`https://api.aladhan.com/v1/qibla/${lat}/${lon}`);
        const json = await res.json();
        const dir = json.data.direction as number;
        currentQibla = dir;

        const resultEl = document.getElementById('result')!;
        resultEl.innerHTML = `
      <p>Turn <strong>${dir.toFixed(2)}°</strong> from North to face Qibla</p>
      <img id="compass-img" src="https://api.aladhan.com/v1/qibla/${lat}/${lon}/compass"
           alt="Compass" style="width:300px;transition:transform 0.3s;" />
    `;
    } catch (err) {
        console.error(err);
        alert('Could not fetch Qibla direction. Please try again later.');
    }
}

document.getElementById('use-location')!.addEventListener('click', () => {
    if (!navigator.geolocation) {
        alert('Geolocation not supported in this browser. Please enter your coordinates manually.');
        return;
    }
    navigator.geolocation.getCurrentPosition(
        (pos) => fetchQibla(pos.coords.latitude, pos.coords.longitude),
        (err) => {
            switch (err.code) {
                case err.PERMISSION_DENIED:
                    alert('Location permission was denied. Please enable it in your browser settings or enter coordinates manually.');
                    break;
                case err.POSITION_UNAVAILABLE:
                    alert('Location information is unavailable. Please enter coordinates manually.');
                    break;
                case err.TIMEOUT:
                    alert('Location request timed out. Try again or enter coordinates manually.');
                    break;
                default:
                    alert('An unknown error occurred while fetching location. Enter coordinates manually.');
            }
        },
        {timeout: 10000}
    );
});

document.getElementById('coord-form')!.addEventListener('submit', (e) => {
    e.preventDefault();
    const latStr = (document.getElementById('lat-input') as HTMLInputElement).value.trim();
    const lonStr = (document.getElementById('lon-input') as HTMLInputElement).value.trim();
    const lat = parseFloat(latStr);
    const lon = parseFloat(lonStr);
    if (isNaN(lat) || isNaN(lon)) {
        alert('Please enter valid numeric coordinates.');
        return;
    }
    fetchQibla(lat, lon);
});

// Handle device orientation for mobile
if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', (event) => {
        const img = document.getElementById('compass-img') as HTMLImageElement | null;
        if (img && currentQibla !== null) {
            const heading = event.alpha ?? 0;
            const rotate = currentQibla - heading;
            img.style.transform = `rotate(${rotate}deg)`;
        }
    });
}
