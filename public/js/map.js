
    let mapToken=MapToken;
    mapboxgl.accessToken=mapToken;
    
    const coords = JSON.parse(coordinates);
    
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: "mapbox://styles/mapbox/streets-v12",
        center: coords, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });

    map.on('load', function() {
        try {
            const marker = new mapboxgl.Marker()
                .setLngLat(coords)
                .addTo(map);
            console.log('Marker added successfully');
        } catch(error) {
            console.error('Error adding marker:', error);
            console.error('Coordinate value:', coordinate);
        }
    });