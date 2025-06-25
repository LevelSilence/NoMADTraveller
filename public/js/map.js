document.addEventListener("DOMContentLoaded", function () {
    const mapDiv = document.getElementById("map");
    if (!mapDiv) return;

    const lng = parseFloat(mapDiv.dataset.lng) || 0;
    const lat = parseFloat(mapDiv.dataset.lat) || 0;
    const key = mapDiv.dataset.key;
    const title = mapDiv.dataset.title || "Listing Location";

    const map = new maplibregl.Map({
        container: 'map',
        style: `https://api.maptiler.com/maps/streets/style.json?key=${key}`,
        center: [lng, lat],
        zoom: 17
    });

    const redPin = document.createElement('img');
    redPin.src = '/images/image.png';
    redPin.alt = 'Location Marker';
    redPin.style.width = '30px';
    redPin.style.height = '30px';
    redPin.style.cursor = 'pointer';

    const marker = new maplibregl.Marker({
        element: redPin,
        anchor: 'bottom'
    })
        .setLngLat([lng, lat])
        .addTo(map);

    const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        anchor: 'bottom'
    }).setHTML(`
        <div style="text-align: center;">
            <div style="font-weight: 600; font-size: 16px;">${title.split(" Exact location")[0]}</div>
            <div style="font-size: 12px; color: #555;">Exact location after Booking</div>
        </div>
    `);

    redPin.addEventListener('mouseenter', () => {
        popup.setLngLat([lng, lat]).addTo(map);
    });

    redPin.addEventListener('mouseleave', () => {
        popup.remove();
    });
});
