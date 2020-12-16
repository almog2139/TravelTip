import { utilService } from './util-service.js'

export const locationService = {
    getLocations,
    removeLocation,
    saveUserLocation,
    goUserSaveLocation,
    getUserSearch,
    getPosSelect
}


const gLocations = [{ idxUser: 100, lat: 17, lng: 19, placeName: 'Puki Home' }];

function getLocations() {
    return Promise.resolve(gLocations)
}


function getUserSearch(location) {
    return fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=AIzaSyCaQVlcIeYewnFSmm3xkL2d3HHy9xhYbz4`)
        .then((res) => res.json())
        .then(locatinAddress => {
            return locatinAddress.results
        })
        .catch((err) => { console.log('Had issues:', err) })
}

function getPosSelect(lat, lng) {
    return fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyCaQVlcIeYewnFSmm3xkL2d3HHy9xhYbz4`)

    .then(res => res.json())
        // .then(res => {
        //     console.log(res.results[0].formatted_address);
        // })
        .then(res => {
            return res.results[0]
        })


}





function saveUserLocation(idxUser, lat, lng, placeName) {
    gLocations.push({ idxUser, lat, lng, placeName })
    utilService.saveToStorage('locationDB', gLocations)

}

function removeLocation(Idx) {

    gLocations.splice(Idx, 1)
    utilService.saveToStorage('locationDB', gLocations)
}

function goUserSaveLocation(idx) {
    var lat = gLocations[idx].lat;
    var lng = gLocations[idx].lng;
    return { lat, lng };


}