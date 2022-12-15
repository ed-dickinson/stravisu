import React from 'react'

const Activities = ({activities}) => {

  return (
    <main className="Activities">
      <table>
      <thead>
        <tr>
          <th>Type:</th>
          <th>Name:</th>
          <th>Distance:</th>
          <th>Time:</th>
          <th>Date:</th>
          <th>Link:</th>
        </tr>
      </thead>
        <tbody>

          {activities.map(activity =>
            <tr key={activity.id} className="Activity">
              <td className="Type">{activity.type}</td>
              <td className="Name">{activity.name}</td>
              <td className="Distance">{activity.distance}m</td>
              <td className="Time">{activity.elapsed_time}s</td>
              <td className="Date">{activity.start_date_local}</td>
              <td><a href={"https://www.strava.com/activities/" + activity.id}>--></a></td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  )
}

export default Activities
