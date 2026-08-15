import { useState} from 'react'
import './App.css'

function App() {
  const [formState, setFormState] = useState('Temperature') 

  const uvHandler = () => setFormState('UV')
  const tempHandler = () => setFormState('Temperature')
  const weatherHandler = () => setFormState('Weather Conditions')
  const formHandler = (event) => {
    event.preventDefault()
  }


  const getCity = async () => {
    const locationResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=Berlin&count=1&language=en&format=json`)
    const possibleLocations = await locationResponse.json()
    const location = possibleLocations.results[0]
    console.log(location)
  }
  getCity()

  return (
    <>
      <div>
        <form>
          <input type="text" onSubmit={formHandler}/> 
          <button type="submit">Search</button>
        </form>
        <button onClick={tempHandler}>Temperature 🌡️</button>
        <button onClick={weatherHandler}>Weather Condition 🌥️</button>
        <button onClick={uvHandler}>UV Index ☀️</button>
        <div>
          {formState == 'UV' ? 'yes' : 'no'}
        </div>
      </div>
    </>
  )
}

export default App
