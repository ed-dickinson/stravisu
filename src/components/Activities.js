import React, {useState, useEffect} from 'react'

import formatService from '../helpers/format'
import statService from '../helpers/stats'

import Stats from './sub/Stats'

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

  const setAndMove2 = (input) => {
    console.log(input)
    // setFilter(type)
    // document.querySelector('.TypeFilters .Highlight').style.left = `${0.25 + (types.indexOf(type) * 2.5)}em`
  }

  return (
    <main className="Activities">

      <div className="TypeFilters">
        <span>
          {types.map(type =>
            <button className={"FilterButton" + ((type === filter) ? " Selected" :"")} key={types.indexOf(type)} onClick={()=>{setAndMove(type)}}><span>{emoji(type)}</span></button>
          )}
          <div className="Highlight"></div>
        </span>
      </div>

      <br />

      <Stats stats={stats} metric={metric} />

      <br />

      <div className="DisplaySelectors">
        <span>
          <button onClick={()=>{setAndMove2('List')}}>List</button>
          <button onClick={()=>{setAndMove2('Week')}}>Week</button>
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
