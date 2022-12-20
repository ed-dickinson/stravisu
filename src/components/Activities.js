import React, {useState, useEffect} from 'react'

import formatService from '../helpers/format'
import statService from '../helpers/stats'

const Activities = ({activities, metric}) => {

  const [stats, setStats] = useState({})
  // const [streak, setStreak] = useState(0)

  useEffect(()=>{

    let streak = statService.streak(activities)
    let distance_all = statService.distanceAll(activities)
    let distance_year = statService.distanceYear(activities)

    setStats({streak, distance_all, distance_year})

  }, [activities])

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

          {activities.map(activity =>
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
