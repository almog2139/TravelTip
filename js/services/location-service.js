import {utilService} from './util-service.js'

export const locationService = {
    getLocations,
    getGoogleGeo,
    removeLocation,
    saveUserLocation,
    goUserSaveLocation
}


const  gLocations = [{ idxUser:100,lat: 17, lng: 19, placeName: 'Puki Home'}];

function getLocations() {
    return Promise.resolve(gLocations)
}

function getGoogleGeo() {
    return fetch('http://www.filltext.com/?rows=10&city={city}&population={numberRange|1000,7000}')
        .then((res) => res.json())
        .then(cities => {
            utilService.saveToStorage('citiesDB', cities)
            gCities = cities;
            return cities;
        })
        .catch((err) => { console.log('Had issues:', err) })
}
function saveUserLocation(idxUser,lat,lng,placeName) {
    gLocations.push({idxUser,lat,lng,placeName})
    utilService.saveToStorage('locationDB', gLocations)

}
function removeLocation(Idx){
    
    gLocations.splice(Idx,1)
    utilService.saveToStorage('locationDB', gLocations)
}
function goUserSaveLocation(idx){
    var lat=gLocations[idx].lat;
    var lng=gLocations[idx].lng;
    return {lat,lng};


}