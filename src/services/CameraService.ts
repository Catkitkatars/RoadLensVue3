import axios from "axios";
import L from 'leaflet';
// import * as sampleModule from 'leaflet-geotag-photo';


const cameraService = {
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

}


export default cameraService;