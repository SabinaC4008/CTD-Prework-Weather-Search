import './App.css'

function App() {
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
        Hello World
      </div>
    </>
  )
}

export default App
