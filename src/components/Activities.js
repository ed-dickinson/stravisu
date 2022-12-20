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

  const [stats, setStats] = useState({})
  // const [streak, setStreak] = useState(0)
  const [types, setTypes] = useState(['All'])
  const [filter, setFilter] = useState('All')

  const [filteredActivities, setFilteredActivities] = useState(activities)

  useEffect(()=>{

    let streak = statService.streak(activities)
    let distance_all = statService.distanceAll(activities)
    let distance_year = statService.distanceYear(activities)

    setStats({streak, distance_all, distance_year})


    let types_copy = types
    activities.forEach(a => {

      // let types_copy = types

      let found = types_copy.find(e => a.type === e)

      if (!found) {
        types_copy.push(a.type)
        // let new_types = types_copy
        setTypes(types_copy)
      }
    })

    console.log('after activities', types)

  }, [activities])

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
      <div>
        <div style={{fontWeight: 'bold', color: 'var(--strava-orange)'}}>
          {stats.streak} day streak{stats.streak>1?'!':'...'}
        </div>
        <div>
          {formatService.distance(stats.distance_all, metric)} total distance travelled
        </div>
        <div>
          {formatService.distance(stats.distance_year, metric)} distance travelled this year
        </div>
      </div>

      <div className="TypeFilters">
        <span>
          {types.map(type =>
            <button className={"FilterButton" + (type === filter) ? " Selected" :""} key={types.indexOf(type)} onClick={()=>{setAndMove(type)}}><span>{emoji(type)}</span></button>
          )}
          <div className="Highlight"></div>
        </span>
      </div>

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
