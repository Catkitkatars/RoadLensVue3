import axios from "axios";
import L from 'leaflet';

const pointService = {
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
    createPoint: (selectedPoint) => {
        return {
            properties: selectedPoint.properties
        }
    },
    removePoint(points, id) {
        const index = points.findIndex(point => point.properties.ulid === id);
        if (index !== -1) {
            points.splice(index, 1);
        }
    },

}

export default pointService;