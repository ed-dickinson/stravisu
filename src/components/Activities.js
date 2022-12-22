import React, {useState, useEffect} from 'react'

import formatService from '../helpers/format'
import statService from '../helpers/stats'

const emoji = type => {
  const emoji = type==='Run'?'🏃'
    :type==='Ride'?'🚴'
    :type==='Swim'?'🏊'
    :type==='Hike'?'🥾'
    :type==='InlineSkate'?'🛼'
    :type==='RockClimb'?'🧗'
    :type==='Canoe'?'🛶'
    :type==='Kayak'?'🛶'
    :type==='Row'?'🚣'
    :type==='Walk'?'🚶'
    :type==='All'?'🌚'
    :'🕴️'
  return emoji
}

const Activities = ({activities, metric}) => {

  const [stats, setStats] = useState({totals: {}})
  // const [streak, setStreak] = useState(0)
  const [types, setTypes] = useState(['All'])
  const [filter, setFilter] = useState('All')

  const [filteredActivities, setFilteredActivities] = useState(activities)

  useEffect(()=>{

    let streak = statService.streak(filteredActivities)
    // let distance_all = statService.distanceAll(filteredActivities)
    // let distance_year = statService.distanceYear(filteredActivities)

    let totals = statService.totals(filteredActivities)

    setStats({streak, totals})

    let types_copy = types
    filteredActivities.forEach(a => {

      let found = types_copy.find(e => a.type === e)

      if (!found) {
        types_copy.push(a.type)
        setTypes(types_copy)
      }
    })

  }, [filteredActivities])

  useEffect(()=>{
    console.log('filter', filter)
    if (filter === 'All') {
      setFilteredActivities(activities)
    } else {
      let filtered = activities.filter(a =>
        a.type === filter
      )
      setFilteredActivities(filtered)
    }
  }, [activities, filter])

  const setAndMove = (type) => {
    setFilter(type)
    document.querySelector('.TypeFilters .Highlight').style.left = `${0.25 + (types.indexOf(type) * 2.5)}em`
  }

  return (
    <main className="Activities">

      <div className="TypeFilters">
        <span>
          {types.map(type =>
            <button className={"FilterButton" + (type === filter) ? " Selected" :""} key={types.indexOf(type)} onClick={()=>{setAndMove(type)}}><span>{emoji(type)}</span></button>
          )}
          <div className="Highlight"></div>
        </span>
      </div>

      <br />

      <div className="Stats">
        <div className="Streak">
          {stats.streak} day streak{stats.streak>1?'!':'...'}
        </div>
        <div className="Totals">
          <p>
          <div>
            {formatService.distance(stats.totals.total_distance, metric)} total distance travelled
          </div>
          <div>
            <sup>(that's {(stats.totals.total_distance / 40075000).toFixed(2)}x round the earth!)</sup>
            <sup>
              (that's from {statService.cities(stats.totals.total_distance, metric)} times!)
            </sup>
          </div>
          <div>
            {formatService.distance(stats.totals.year_distance, metric)} distance travelled this year
          </div>
          <div><sup>
            (that's from {metric ? 'Paris to Istanbul' : 'NY to San Francisco'} {(stats.totals.year_distance / (metric ? 2255170 : 4128840)).toFixed(2)} times!)
          </sup>
          <sup>
            (that's from {statService.cities(stats.totals.year_distance, metric)} times!)
          </sup>
          </div>
          </p>

          <p>
          <div>
            {formatService.elevation(stats.totals.total_elevation, metric)} total height climbed
          </div>
          <div>
            <sup>(that's {(stats.totals.total_elevation / 8848.86).toFixed(2)}x times up Everest!)</sup>
            <sup>(that's {statService.mountains(stats.totals.total_elevation)}!)</sup>
          </div>
          <div>
            {formatService.elevation(stats.totals.year_elevation, metric)} climbed this year
          </div>
          <div>
            {stats.totals.year_elevation > 8848.86
              ? <sup>(that's up Everest {(stats.totals.year_elevation / 8848.86).toFixed(2)} times!)</sup>
              : <sup>(that's up {metric ? 'Mont Blanc' : 'Denali'}  {(stats.totals.year_elevation / (metric ? 4807.81 : 6190)).toFixed(2)} times!)</sup>
            }
            <sup>(that's {statService.mountains(stats.totals.year_elevation)}!)</sup>
            </div>
          </p>
        </div>
      </div>

      <br />


      <table>
      <thead>
        <tr>
          <th>Type:</th>
          <th>Name:</th>
          <th>Dist.:</th>
          <th>Elev.:</th>
          <th>Dur.:</th>
          <th>Date:</th>
          <th></th>
        </tr>
      </thead>
        <tbody>

          {filteredActivities.map(activity =>
            <tr key={activity.id} className="Activity">
              <td className="Type">
                {activity.type==='Run'?'🏃'
                :activity.type==='Ride'?'🚴'
                :activity.type==='Swim'?'🏊'
                :activity.type==='Hike'?'🥾'
                :activity.type==='InlineSkate'?'🛼'
                :activity.type==='RockClimb'?'🧗'
                :activity.type==='Canoe'?'🛶'
                :activity.type==='Kayak'?'🛶'
                :activity.type==='Row'?'🚣'
                :activity.type==='Walk'?'🚶'
                :'🕴️'}
              </td>
              <td className="Name">
                {activity.name}
              </td>
              <td className="Distance">
                {formatService.distance(activity.distance, metric)}
              </td>
              <td className="Elevation">
                {formatService.elevation(activity.total_elevation_gain, metric)}
              </td>
              <td className="Time">
                {formatService.time(activity.elapsed_time)}
              </td>
              <td className="Date" style={{whiteSpace: 'nowrap'}}>
                {activity.start_date_local.slice(2,10)} {activity.start_date_local.slice(11,16)}
              </td>
              <td className="LinkOut">
                <a href={"https://www.strava.com/activities/" + activity.id}>
                  <img
                    src="assets/strava-out.png"
                    style={{height:'0.7em'}}
                    alt="Link to Strava"
                  />
                </a>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  )
}

export default Activities
