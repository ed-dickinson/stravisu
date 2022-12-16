import React from 'react'

import formatService from '../helpers/format'

const Activities = ({activities, metric}) => {

  return (
    <main className="Activities">
      <table>
      <thead>
        <tr>
          <th>Type:</th>
          <th>Name:</th>
          <th>Distance:</th>
          <th>Elevation:</th>
          <th>Time:</th>
          <th>Date:</th>
          <th></th>
        </tr>
      </thead>
        <tbody>

          {activities.map(activity =>
            <tr key={activity.id} className="Activity">
              <td className="Type">{activity.type}</td>
              <td className="Name">{activity.name}</td>
              <td className="Distance">{formatService.distance(activity.distance, metric)}</td>
              <td className="Elevation">{formatService.elevation(activity.total_elevation_gain, metric)}</td>
              <td className="Time">{formatService.time(activity.elapsed_time)}</td>
              <td className="Date" style={{whiteSpace: 'nowrap'}}>{activity.start_date_local.slice(2,10)} {activity.start_date_local.slice(11,16)}</td>
              <td className="LinkOut"><a href={"https://www.strava.com/activities/" + activity.id}><img src="assets/strava-out.png" style={{height:'0.7em'}} alt="Link to Strava"/></a></td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  )
}

export default Activities
