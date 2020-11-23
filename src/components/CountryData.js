import { useState, useEffect } from 'react'

function generateDataWithUniqueDates (originalData) {
  /*
  We may have multiple records for the same day b/c some data
  is broken up by province/state. To rectify that, we make an
  object of unique dates and the total count for that date, and
  then transform that back into an array of objects.
  Example starting data:
  [
    {Country: "Australia", CountryCode: "AU", Province: "Victoria", City: "", CityCode: "", Lat: "-37.81",…}
    {Country: "Australia", CountryCode: "AU", Province: "New South Wales", City: "", CityCode: "",…} ]
  ]
  */
  const casesByDay = {}

  // Collect the unique dates with cases.
  for (const record of originalData) {
    if (!casesByDay[record.Date]) {
      casesByDay[record.Date] = 0
    }
    casesByDay[record.Date] += record.Confirmed
  }

  // Transform back into an array of objects.
  const stats = []
  for (const date of Object.keys(casesByDay)) {
    stats.push({ date: date, cases: casesByDay[date] })
  }

  return stats
}

export default function CountryData (props) {
  const { country, clearSelectedCountry } = props

  const [dailyStats, setDailyStats] = useState([])

  useEffect(() => {
    fetch('https://api.covid19api.com/dayone/country/' + country.Slug)
      .then(res => res.json())
      .then(originalData => {
        setDailyStats(generateDataWithUniqueDates(originalData))
      })
  }, [country])

  return (
    <div className='mw8 center'>
      <h2>{country.Country}</h2>
      <button onClick={clearSelectedCountry}>
        Go back to all countries
      </button>

      <ul className='list ml0 pl0'>
        {dailyStats.map((day) => (
          <li key={day.date} className='mv2'>
            <div>Date: {day.date}</div>
            <div>Total Confirmed Cases: {day.cases}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
