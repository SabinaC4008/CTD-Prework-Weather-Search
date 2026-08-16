import {useState} from 'react'

function App() {
  const [formState, setFormState] = useState('Temperature') 
  const [city, setCity] = useState('')
  const [locationInfo, setlocationInfo] = useState('')
  const [info, setInfo] = useState('')
  const [alertInfo, setAlertInfo]  = useState('')


  //Button Handlers 
  const uvHandler = () => {
    setFormState('UV Index')
    if (locationInfo){
      getUV(locationInfo)
    }
  }

  const tempHandler = () => {
    setFormState('Temperature')
    if (locationInfo){
      getTemperature(locationInfo)
    }
  }

  const weatherHandler = () => {
    setFormState('Weather Conditions')
    if (locationInfo){
      getWeather(locationInfo)  
    }
  }

  const cityHandler = (event) => setCity(event.target.value)
  
  const searchHandler = async (event) => {
    event.preventDefault()
    getWeatherState(formState)
  }

  const getWeatherState = async (infoToGet) => {
    const locationResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`)
    const possibleLocations = await locationResponse.json() //need to check for latitude, longitude, name and timezone
    console.log(possibleLocations)
    //const location = possibleLocations.results[0]
    try {
      const location = possibleLocations.results[0]
      //console.log(location)
      setlocationInfo(location)

      //Selecting which info to return right now
      if(infoToGet == 'Temperature') {
        getTemperature(location)
      }
      if(infoToGet == 'UV Index') {
        getUV(location)
      }
      if(infoToGet == 'Weather Conditions') {
        getWeather(location)
      }
    } catch (error) {
      if (error.name === 'TypeError')
        setInfo('City was not found. Please make sure city name is spelled correct.')
    }
  }





  //Functions for getting individual info
  //Function for fetching Temperature
  const getTemperature = async (location) => {
    console.log(location)
    const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m&timezone=${location.timezone}&forecast_days=1`)
    const weather = await weatherResponse.json()
    //console.log('Temperature')
    console.log(weather.current.temperature_2m)
    setInfo("Current temperature of the city " + location.name + " in the country of " + location.country + " is: " + weather.current.temperature_2m + weather.current_units.temperature_2m)
  }

  //Function for fetching UV
  const getUV = async (location) => {
    const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&daily=uv_index_max&timezone=${location.timezone}&forecast_days=1`)
    const weather = await weatherResponse.json()
    //console.log('UV')
    console.log(weather.daily.uv_index_max[0])
    setInfo("Today's max UV level of the city " + location.name + " in the country of " + location.country + " is: " + weather.daily.uv_index_max[0])
    if(weather.daily.uv_index_max[0] > 3){
      setAlertInfo(true)
    } else {
      setAlertInfo(false)
    }
  }

  //Function for fetching Weather Code 
  const getWeather = async (location) => {
    const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=weather_code&timezone=${location.timezone}&forecast_days=1`)
    const weather = await weatherResponse.json()
    //console.log('Weather Conditions')
    //console.log(weather.current.weather_code)
    setInfo("Current Weather Conditions are: " + location.name + " in the country of " + location.country + " is: " + weather.current.weather_code)
  }

  return (
    <>
      <div className='main-container'>
        <h1>Weather Search Platform</h1>
        <div>
          You are currently searching for: {formState}
        </div>
        <form onSubmit={searchHandler}>
          <input type="text" onChange={cityHandler}/> 
          <button type="submit">Search</button>
        </form>
        <button onClick={tempHandler}>Temperature 🌡️</button>
        <button onClick={weatherHandler}>Weather Condition 🌥️</button>
        <button onClick={uvHandler}>UV Index ☀️</button>
        <div>
          {info}
          {alertInfo && <div className='uv-alert'>Max UV Level is predicted to get past 3, make sure to have sunscreen on hand!</div>}
        </div>
      </div>
    </>
  )
}

export default App
