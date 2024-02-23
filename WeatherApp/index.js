let user = document.querySelector('[data-user]');
let search=document.querySelector('[data-searching]');
let userContainer=document.querySelector('.container');

let grantLocation=document.querySelector('.grant-location');
let searchWeather=document.querySelector('.search-form');
let loading=document.querySelector('.loading-buffer');
let yourWeather=document.querySelector('.your-weather');
console.log('check');
//initially
let currentTab=user;
let API_KEY="d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add('currently-tab');
getfromCoorWeather();//maybe it already has access
//one more work
function switching(clickedTab){
    if(clickedTab!=currentTab){
        currentTab.classList.remove("currently-tab");
        currentTab=clickedTab;
        currentTab.classList.add('currently-tab');
        if(!searchWeather.classList.contains('active'))
        {
            yourWeather.classList.remove('active');
            grantLocation.classList.remove('active');
            searchWeather.classList.add('active');
        }
        else
        {
            //phele in search now in weather
            searchWeather.classList.remove('active');
            yourWeather.classList.remove('active');
            //in weather so display
            //already saved
            getfromCoorWeather();
        }
    }
}
console.log('check');
user.addEventListener('click',()=>{
    //pass clicked
    switching(user);
});
search.addEventListener('click',()=>{
    switching(search);
})
//if coor present or not
function getfromCoorWeather(){
    let coordinates= sessionStorage.getItem('user-coordinate');
    if(!coordinates)
    {
        grantLocation.classList.add('active');
    }
    else
    {
        let coordinatesNeeded=JSON.parse(coordinates);
        fetchWeatherInfo(coordinatesNeeded);
    }
}
console.log('check');
async function fetchWeatherInfo(coordinatesNeeded)
{
    let {lat,lon}=coordinatesNeeded;
    //grant container invisible
    grantLocation.classList.remove('active');
    //loader visible
    loading.classList.add('active');
    //API CALL
    try
    {
        let apiresult=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        let converted=await apiresult.json();
        loading.classList.remove('active');
        yourWeather.classList.add('active');
        renderWeatherInfo(converted);
    }
    catch(e)
    {
        loading.classList.remove('active');
        // console.log('Error');
    }
};
console.log('check');
function renderWeatherInfo(weatherdata)
{
    //first fetch element
    let cityName=document.querySelector('[data-cityName]');
    let countryIcon=document.querySelector('[data-countryFlag]');
    let description=document.querySelector('[data-weatherDesc]');
    let weatherIcon=document.querySelector('[data-weatherIcon]');
    let temp=document.querySelector('[data-temperature]');
    let wind=document.querySelector('[data-windspeed]');
    let humidity=document.querySelector('[data-humidity]');
    let cloud=document.querySelector('[data-cloudFormation]');

    cityName.innerText=weatherdata?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${weatherdata?.sys?.country.toLowerCase()}.png`;
    description.innerText=weatherdata?.weather?.[0]?.description;  
    weatherIcon.src=`http://openweathermap.org/img/w/${weatherdata?.weather?.[0]?.icon}.png`;
    temp.innerText=`${weatherdata?.main?.temp} °C`;
    wind.innerText=`${weatherdata?.wind?.speed} m/s`;
    humidity.innerText=`${weatherdata?.main?.humidity}%`;
    cloud.innerText=`${weatherdata?.clouds?.all}%`;
}
// function renderWeatherInfo(weatherdata) {
//     let cityName = document.querySelector('[data-cityName]');
//     let countryIcon = document.querySelector('[data-countryFlag]');
//     let description = document.querySelector('[data-weatherDesc]');
//     let weatherIcon = document.querySelector('[data-weatherIcon]');
//     let temp = document.querySelector('[data-temperature]');
//     let wind = document.querySelector('[data-windspeed]');
//     let humidity = document.querySelector('[data-humidity]');
//     let cloud = document.querySelector('[data-cloudFormation]');

//     cityName.innerText = weatherdata?.name;
//     countryIcon.src = `https://flagcdn.com/144x108/${weatherdata?.sys?.country.toLowerCase()}.png`;
//     description.innerText = weatherdata?.weather?.[0]?.description;
//     weatherIcon.src = `http://openweathermap.org/img/w/${weatherdata?.weather?.[0]?.icon}.png`;
//     temp.innerText = weatherdata?.main?.temp;
//     wind.innerText = weatherdata?.wind?.speed;
//     humidity.innerText = weatherdata?.main?.humidity;
//     cloud.innerText = weatherdata?.clouds?.all;
// }

console.log('check');
function getLoc()
{
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else
    {
        //alert
        alert('No geolocation access');
    }
};
console.log('check');
function showPosition(position){
    let userCoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }
    sessionStorage.setItem('user-coordinate',JSON.stringify(userCoordinates));
    fetchWeatherInfo(userCoordinates);
}
console.log('check');
let accessButton=document.querySelector('[data-buttonAccess]');
accessButton.addEventListener('click',getLoc);

let searchInput=document.querySelector('[data-searchcity]');
searchWeather.addEventListener('submit',(def)=>{
    def.preventDefault();
    let cityName=searchInput.value;
    if(cityName==="")
        return;
    else
        fetchSearchCityWeather(cityName); 
});
console.log('check');
async function fetchSearchCityWeather(city){
    loading.classList.add('active');
    yourWeather.classList.remove('active');
    grantLocation.classList.remove('active');
    try{
        let response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        let final=await response.json();
        loading.classList.remove('active');
        yourWeather.classList.add('active');
        renderWeatherInfo(final);
    }   
    catch(e)
    {
        //
        // alert('Error');
    }
}