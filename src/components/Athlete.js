import React from 'react'

const Athlete = ({athlete}) => {

  // console.log(athlete)


  const findProfileAge = (created_date) => {
    let now = new Date()
    let age = new Date(athlete.created_at)

    let years = now.getYear() - age.getYear()
    let months = now.getMonth() - age.getMonth()
    let days = (now - age) / 1000 / 60 / 60 / 24

    let output = `${years} ${months} ${days}`

    if (days < 31) {
      output = `${days} day old profile`
    } else if (days < 365) {
      if (months === 0) {months = 12}
      output = `${months} month old profile`
    } else {
      output = `${years} year old profile`
    }

    return output
  }

  return (
    <div className="Athlete">
    <div><img src={athlete.profile} alt="Athlete profile photo."/></div>
      <div className="ID"><span>{athlete.id}</span></div>
      <div><strong>{athlete.firstname} {athlete.lastname}</strong></div>
      <div><span>{athlete.city}, {athlete.state}, {athlete.country}</span></div>
      <div><sup>{findProfileAge(athlete.created_at)}</sup></div>
      <div><em>"{athlete.bio}"</em></div>
    </div>
  )
}

export default Athlete
