import axios from "axios";
import L from 'leaflet';

const pointService = {

    headers: {
        'Content-Type': 'application/json',
    },

    getPoints: async function(bounds) {
        let requestData = {
            northEastLat: bounds._northEast.lat,
            northEastLng: bounds._northEast.lng,
            southWestLat: bounds._southWest.lat,
            southWestLng: bounds._southWest.lng
        };
        return await axios.post('http://localhost:8080/api/points', requestData, {headers: this.headers})
            .then(res => res.data.data.original)
            .catch(error => console.log(error));
    },

    addPointRequest: async function (requestData){
        return await axios.post('http://localhost:8080/api/add', requestData, {headers: this.headers})
            .then(res => res)
            .catch(error => console.log(error));
    },

    updatePointRequest: async function (requestData) {
        return await axios.post('http://localhost:8080/api/update', requestData, {headers: this.headers})
            .then(res => res)
            .catch(error => console.log(error));
    },

    addPointToArr: (selectedPoint) => {
        return {
            properties: selectedPoint.properties
        }
    },
}

export default pointService;