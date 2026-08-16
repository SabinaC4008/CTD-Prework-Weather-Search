import { useState} from 'react'
import './App.css'

function App() {
  const [formState, setFormState] = useState('Temperature') 
  const [city, setCity] = useState('')

  const [info, setInfo] = useState('')

  const uvHandler = () => setFormState('UV')
  const tempHandler = () => setFormState('Temperature')
  const weatherHandler = () => setFormState('Weather Conditions')
  const cityHandler = (event) => setCity(event.target.value)
  
  const searchHandler = async (event) => {
    event.preventDefault()
    getCityWeather()
  }

  const getCityWeather = async () => {
    const locationResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`)
    const possibleLocations = await locationResponse.json()
    const location = possibleLocations.results[0]
    console.log(location)

    if(formState == 'Temperature') {
      const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m&timezone=${location.timezone}&forecast_days=1`)
      const weather = await weatherResponse.json()
      console.log('Temperature')
      console.log(weather.current.temperature_2m) //Need to still change this to temperature 
      setInfo("Temperature:" + weather.current.temperature_2m)
    }

    if(formState == 'UV') {
      const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&daily=uv_index_max&timezone=${location.timezone}&forecast_days=1`)
      const weather = await weatherResponse.json()
      console.log('UV')
      console.log(weather.daily.uv_index_max[0]) //Need to still change this to temperature 
      setInfo("UV:" + weather.daily.uv_index_max[0])
    }

    if(formState == 'Weather Conditions') {
      const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=weather_code&timezone=${location.timezone}&forecast_days=1`)
      const weather = await weatherResponse.json()
      console.log('Weather Conditions')
      console.log(weather.current.weather_code) //Need to still change this to Weather Conditions 
      setInfo("Weather Conditions:" + weather.current.weather_code)
    }

  }

  return (
    <>
      <div>
        {formState}
        <form onSubmit={searchHandler}>
          <input type="text" onChange={cityHandler}/> 
          <button type="submit">Search</button>
        </form>
        <button onClick={tempHandler}>Temperature 🌡️</button>
        <button onClick={weatherHandler}>Weather Condition 🌥️</button>
        <button onClick={uvHandler}>UV Index ☀️</button>
        <div>
          {info}
        </div>
      </div>
    </>
  )
}

export default App
