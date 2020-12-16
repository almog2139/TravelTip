
import { locationService } from './services/location-service.js'
import { utilService } from './services/util-service.js'
console.log('locationService', locationService);

var gGoogleMap;
var gIdUser = 101;

window.onload = () => {
    initMap()
        .then(() => {
            addMarker({ lat: 32.0749831, lng: 34.9120554 });
        })
        .catch(console.log('INIT MAP ERROR'));

    getUserPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
            console.log('User lat:', pos.coords.latitude);
            console.log('User lng:', pos.coords.longitude);
        })
        .catch(err => {
            console.log('err!!!', err);
        })

    document.querySelector('.search-btn').addEventListener('click', (ev) => {
        console.log('Aha!', ev.target);
        panTo(35.6895, 139.6917);
    })
    let button = document.querySelector('.my-location')
    button.addEventListener('click', (ev) => {
        getUserPosition()
            .then(pos => {
                console.log('User position is:', pos.coords);
                console.log('User lat:', pos.coords.latitude);
                console.log('User lng:', pos.coords.longitude);
                initMap(lat, lng)
            })
            .catch(err => {
                console.log('err!!!', err);
            })
        
         

    })
}


export function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap');
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gGoogleMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            addMarker({ lat, lng });
            console.log('Map!', gGoogleMap);

            gGoogleMap.addListener("click", (ev) => {
                console.log(ev.latLng.lat(), ev.latLng.lng());
                var lat = ev.latLng.lat()
                var lng = ev.latLng.lng();
                const placeName = prompt('place name?')
                locationService.saveUserLocation(gIdUser++, lat, lng, placeName)
                // saveToStorage(KeyLocation, gLoctions)

                renderTable()

            });

        })
}





function renderTable() {
    var loctions = utilService.loadFromStorage('locationDB');
    if (!loctions) return
    else {
        var strHtmlS = loctions.map(function (loc) {
            console.log(loc);
            return `
        <tr>
        <td>${loc.idxUser}</td>
        <td>${loc.lat}</td>
        <td>${loc.lng}</td>
        <td>${loc.placeName}</td>
        <td>
        <button  class="btnDelete">Delete Location</button>
         <button  class="btnGetLocation">Go   Location</button>
        </td>
        </tr>
      `
        });
    }
    var elTable = document.querySelector('.tbody');
    elTable.innerHTML = strHtmlS.join(' ');
    // document.querySelector('.btnDelete').addEventListener('click',(ev)=>{

    // })
    addDeleteListener()
    addGoLocationListener()
}
function addDeleteListener() {
    // document.querySelector('.btnDelete').addEventListener('click',(ev)=>{


    // })
    let buttons = document.querySelectorAll('.btnDelete')
    console.log(buttons)
    buttons.forEach((button, idx) => {
        button.addEventListener('click', (ev) => {
            locationService.removeLocation(idx)
            renderTable()
        })
    })

}
function addGoLocationListener() {

    let buttons = document.querySelectorAll('.btnGetLocation')
    console.log(buttons)
    buttons.forEach((button, idx) => {
        button.addEventListener('click', (ev) => {
            const locationsUserSaveing = locationService.goUserSaveLocation(idx)
            const lat = locationsUserSaveing.lat
            const lng = locationsUserSaveing.lng
            console.log(lat, lng);
            initMap(lat, lng)

            renderTable()
        })
    })

}

// function onGetUserPos() {

//     let buttons = document.querySelector('.my-location')
//     button.addEventListener('click', (ev) => {
//         getUserPosition()
//             .then(pos => {
//                 console.log('User position is:', pos.coords);
//                 console.log('User lat:', pos.coords.latitude);
//                 console.log('User lng:', pos.coords.longitude);
//             })
//             .catch(err => {
//                 console.log('err!!!', err);
//             })
//         initMap(lat, lng)

//     })


// }




function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gGoogleMap,
        title: 'Hello World!'
    });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gGoogleMap.panTo(laLatLng);
}

function getUserPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}


function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyCaQVlcIeYewnFSmm3xkL2d3HHy9xhYbz4';
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}



