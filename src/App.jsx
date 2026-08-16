import {useState} from 'react'

function App() {
  const [requestedInfoType, setRequestedInfoType] = useState('Temperature');
  const [inputCity, setInputCity] = useState(''); //holds the city being entered into the search bar
  const [apiReturnedLocationInfo, setApiReturnedLocationInfo] = useState(''); //holds the first result returned by fetch request for city
  const [info, setInfo] = useState('');
  const [uvAlertInfo, setUVAlertInfo]  = useState('');

  //Mapping weather code to string descriptor as found on open meteo
  const weatherCodeMapping = {
    0: 'Clear Sky', 
    1: 'Mainly Clear', 
    2: 'Partly Cloudy',
    3: 'Overcast', 
    45:'Fog', 
    48: 'Depositing Rime Fog', 
    51: 'Light Drizzle',
    53: 'Moderate Drizzle',
    55: 'Dense Drizzle',
    56: 'Light Freezing Drizzle', 
    57: 'Dense Freezing Drizzle',
    61: 'Slight Rain',
    63: 'Moderate Rain', 
    65: 'Heavey Rain', 
    66: 'Light Freezing Rain', 
    67: 'Heavy Freezing Rain', 
    71: 'Slight Snow Fall', 
    73: 'Moderate Snow Fall', 
    75: 'Heavy Snow Fall', 
    77: 'Snow Grains', 
    80: 'Slight Rain Showers', 
    81: 'Moderate Rain Showers', 
    82: 'Violent Rain Showers', 
    85: 'Slight Snow Showers', 
    86: 'Heavy Snow Showers', 
    95: 'Thunderstorm', 
    96: 'Thunderstorm with Slight Hail', 
    99: 'Thunderstorm with Heavy Hail'
  };






  //Button Handlers 
  const uvHandler = () => {
    setRequestedInfoType('UV Index');
    if (apiReturnedLocationInfo){
      getUV(apiReturnedLocationInfo);
    }
  }

  const tempHandler = () => {
    setRequestedInfoType('Temperature');
    if (apiReturnedLocationInfo){
      getTemperature(apiReturnedLocationInfo);
    }
  }

  const weatherHandler = () => {
    setRequestedInfoType('Weather Conditions');
    if (apiReturnedLocationInfo){
      getWeather(apiReturnedLocationInfo);
    }
  }

  const cityInputHandler = (event) => setInputCity(event.target.value)
  
  const searchHandler = async (event) => {
    event.preventDefault();

    const locationResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${inputCity}&count=1&language=en&format=json`);
    const possibleLocations = await locationResponse.json(); //need to check for latitude, longitude, name and timezone
    console.log(possibleLocations);
    //const location = possibleLocations.results[0];
    try {
      const location = possibleLocations.results[0];
      //console.log(location);
      setApiReturnedLocationInfo(location);

      //Selecting which info to return right now
      if(requestedInfoType == 'Temperature') {
        getTemperature(location);
      }
      if(requestedInfoType == 'UV Index') {
        getUV(location);
      }
      if(requestedInfoType == 'Weather Conditions') {
        getWeather(location);
      }
    } catch (error) {
      if (error.name === 'TypeError')
        setInfo('City was not found. Please make sure city name is spelled correct.');
    }
  }




  //Function to get location with State when location is in the US just to clarify when cities have the same name
  //This function makes the code within each of of the functions below a bit tidier
  const addStateIfUS = (orginalLocation) => {
    if(orginalLocation.country == 'United States'){
      return orginalLocation.name + ', ' + orginalLocation.admin1; 
    } else {
      return orginalLocation.name;
    }
  }

  //Functions for getting individual info
  //Function for fetching Temperature
  const getTemperature = async (location) => {
    const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m&timezone=${location.timezone}&forecast_days=1`);
    const weather = await weatherResponse.json();
    //console.log('Temperature');
    //console.log(weather.current.temperature_2m);
    const locationStructure = addStateIfUS(location)
    setInfo("Current temperature of the city " + locationStructure + " in the country of " + location.country + " is: " + weather.current.temperature_2m + weather.current_units.temperature_2m);
    setUVAlertInfo(false);
  }

  //Function for fetching UV
  const getUV = async (location) => {
    const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&daily=uv_index_max&timezone=${location.timezone}&forecast_days=1`);
    const weather = await weatherResponse.json();
    //console.log('UV');
    //console.log(weather.daily.uv_index_max[0]);
    const locationStructure = addStateIfUS(location)
    setInfo("Today's max UV level of the city " + locationStructure + " in the country of " + location.country + " is: " + weather.daily.uv_index_max[0]);
    if(weather.daily.uv_index_max[0] > 3){
      setUVAlertInfo(true);
    } else {
      setUVAlertInfo(false);
    }
  }

  //Function for fetching Weather Code 
  const getWeather = async (location) => {
    const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=weather_code&timezone=${location.timezone}&forecast_days=1`);
    const weather = await weatherResponse.json();
    //console.log('Weather Conditions');
    //console.log(weather.current.weather_code);
    const weatherNum = weather.current.weather_code;
    const locationStructure = addStateIfUS(location)
    setInfo("Current weather conditions of the city " + locationStructure + " in the country of " + location.country + " is: " + weatherCodeMapping[weatherNum]);
    setUVAlertInfo(false);
  }

  return (
    <>
      <div className='main-container'>
        <h1>Weather Search Platform</h1>
        <h2>You are currently searching for: {requestedInfoType}</h2>
        <form onSubmit={searchHandler}>
          <input type="text" onChange={cityInputHandler}/> 
          <button type="submit">Search</button>
        </form>
        <button onClick={tempHandler}>Temperature 🌡️</button>
        <button onClick={weatherHandler}>Weather Condition 🌥️</button>
        <button onClick={uvHandler}>UV Index ☀️</button>
        
        <div>
          <p>{info}</p>
          {uvAlertInfo && <div className='uv-alert'><p>Max UV Level is predicted to get past 3, make sure to have sunscreen on hand!</p></div>}
        </div>
      </div>
    </>
  )
}

export default App
