import './App.css'

function App() {
  const getCity = async () => {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=Berlin&count=10&language=en&format=json`)
    console.log(response.json())
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
