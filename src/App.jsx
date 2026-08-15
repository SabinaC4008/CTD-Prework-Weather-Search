import { useState} from 'react'
import './App.css'

function App() {
  const [formState, setFormState] = useState('Temperature') 
  const [city, setCity] = useState('')
  const uvHandler = () => setFormState('UV')
  const tempHandler = () => setFormState('Temperature')
  const weatherHandler = () => setFormState('Weather Conditions')
  const cityHandler = (event) => setCity(event.target.value)
  
  const searchHandler = (event) => {
    event.preventDefault()
    getCity()
  }


  const getCity = async () => {
    const locationResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`)
    const possibleLocations = await locationResponse.json()
    const location = possibleLocations.results[0]
    console.log(location)
    const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&daily=uv_index_max&timezone=${location.timezone}&forecast_days=1`)
    const weather = await weatherResponse.json()
    console.log(weather)
  }

  return (
    <>
      <div>
        <form onSubmit={searchHandler}>
          <input type="text" onChange={cityHandler}/> 
          <button type="submit">Search</button>
        </form>
        <button onClick={tempHandler}>Temperature 🌡️</button>
        <button onClick={weatherHandler}>Weather Condition 🌥️</button>
        <button onClick={uvHandler}>UV Index ☀️</button>
        <div>
          {formState == 'UV' ? 'yes' : 'no'} 
          {//Testing to see if states change based on button clicks above
          }
        </div>
      </div>
    </>
  )
}

export default App
