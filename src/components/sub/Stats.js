import React from 'react'

import formatService from '../../helpers/format'
import statService from '../../helpers/stats'

const Stats = ({stats, metric}) => {

  const month_names = ["January","February","March","April","May","June","July",
      "August","September","October","November","December"]

  return (
    <div className="Stats">
      <div className="Streak">
        {stats.streak > 6 && <span><sup>!</sup>!</span>}
        {stats.streak} day streak{stats.streak>1?'!':'...'}
        {stats.streak > 6 && <span>!<sup>!</sup></span>}
      </div>

      <div className="MonthTally">
        <span>
        <div className="MonthName">{month_names[new Date().getMonth()]}</div>
        {stats.month &&
          <div>
            {stats.month.include_today ? 'including today' : 'not including today'}, day {stats.month.day} of {stats.month.days}
            <div>{formatService.distance(stats.month.distance, metric)} so far this month</div>
            <div>on track for {formatService.distance(stats.month.projected, metric)}</div>
            <div className="BackgroundIndicator" style={{width: (stats.month.day / stats.month.days * 100) + '%'}}></div>
          </div>

        }

        </span>
      </div>
      <div className="Totals">
        <p>
        <div>
          {formatService.distance(stats.totals.total_distance, metric)} total distance travelled
        </div>
        <div>

          <sup>
            {statService.cities(stats.totals.total_distance, metric)}
          </sup>
        </div>
        <div>
          {formatService.distance(stats.totals.year_distance, metric)} distance travelled this year
        </div>
        <div>
        <sup>
          {statService.cities(stats.totals.year_distance, metric)}
        </sup>
        </div>
        </p>

        <p>
        <div>
          {formatService.elevation(stats.totals.total_elevation, metric)} total height climbed
        </div>
        <div>
          <sup>{statService.mountains(stats.totals.total_elevation)}</sup>
        </div>
        <div>
          {formatService.elevation(stats.totals.year_elevation, metric)} climbed this year
        </div>
        <div>
          <sup>{statService.mountains(stats.totals.year_elevation)}</sup>
          </div>
        </p>
      </div>
    </div>
  )
}

export default Stats
