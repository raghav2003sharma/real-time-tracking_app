const socket = io();

//obtaining the location of current user
if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
        const {latitude,longitude} = position.coords;
        socket.emit('send-Location',{latitude,longitude});
},
(error)=>{
    console.log(error);
},
{
    enableHighAccuracy:true,
    timeout:5000,//refresh time
    maximumAge:0//catching zero
})
}
//Initializing the map with leaflet
const map = L.map("map").setView([0,0],15);
//adding the tile layer into the map
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);
//adding the marker to the map
const marker ={};
socket.on('receive-Location',(data)=>{
    const {id,latitude,longitude} = data;
    map.setView([latitude,longitude],12);//setting the view of the map

//if marker already exists then set the lat and lng for the marker
    if(marker[id]){
        marker[id].setLatLng([latitude,longitude]);
    }
        else{
            marker[id] = L.marker([latitude,longitude]).addTo(map);
        }
});

//removing the marker when user is disconnected
socket.on('uset-disconnected',(id)=>{
    if(socket[id]){
    map.removeLayer(marker[id]);
    delete marker[id];
    }
});