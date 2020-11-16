/* globals fetch */

import 'tachyons'
import { useEffect, useState } from 'react'

function App () {
  const [countries, setCountries] = useState([])

  useEffect(() => {
    fetch('https://api.covid19api.com/countries')
      .then(response => response.json())
      .then(data => setCountries(data))
  }, [])

  return (
    <div className='mw7 center pa2'>
      <ul>
        {countries.map((country) => (
          <li key={country.ISO2}>{country.Country}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
