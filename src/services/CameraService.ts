import axios from "axios";
import L from 'leaflet';
// import * as sampleModule from 'leaflet-geotag-photo';


const cameraService = {
    option: {
        draggable: false,
        control: false,
        cameraIcon: L.icon({
            iconUrl: '/1.png',
            iconSize: [38, 38],
            iconAnchor: [19, 35]
        }),
        targetIcon: L.icon({
            iconUrl: '/marker.svg',
            iconSize: [0, 0],
            iconAnchor: [16, 16]
        }),

        angleIcon: L.icon({
            iconUrl: '/marker.svg',
            iconSize: [0, 0],
            iconAnchor: [16, 16]
        }),
        outlineStyle: {
            color: '#03e9f4',
            opacity: 0,
            weight: 2,
            dashArray: '1, 1',
            lineCap: 'round',
            lineJoin: 'round'
        },
        fillStyle: {
            weight: 0,
            fillOpacity: 0.3,
            fillColor: '#032b2d'
        },
    },
    getPoints: async (bounds) => {
        let requestData = {
            northEastLat: bounds._northEast.lat,
            northEastLng: bounds._northEast.lng,
            southWestLat: bounds._southWest.lat,
            southWestLng: bounds._southWest.lng
        };
        const headers = {
            'Content-Type': 'application/json',
        };
        return await axios.post('http://localhost:8080/api/getCameras', requestData, {headers: headers})
              .then(res => res.data)
    },
    // pointsHandler: (points, option) => {
    //     let result = {};
    //     points.forEach((pointObject) => {
    //         let point = L.geotagPhoto.camera(pointObject, option)
    //         point.properties = pointObject.properties;
    //         result[point.properties.ulid] = point
    //     });
    //     return result;
    // }
}


export default cameraService;