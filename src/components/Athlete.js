import React from 'react'

const Athlete = ({athlete}) => {

  const findProfileAge = (created_date) => {
    let now = new Date()
    let age = new Date(athlete.created_at)

    let years = now.getYear() - age.getYear()
    let months = now.getMonth() - age.getMonth()
    let days = now.getDate() - age.getDate()

    let output = `${years} ${months}`
    if (years > 0) {
      output = `${years} year old profile`
    } else if (months > 0) {
      output = `${months} month old profile`
    }
    return output
  }

  return (
    <div className="Athlete">
    <div><img src={athlete.profile} alt="Athlete profile photo."/></div>
      <div className="ID"><span>{athlete.id}</span></div>
      <div><strong>{athlete.firstname} {athlete.lastname}</strong></div>
      <div><span>{athlete.city}, {athlete.state}, {athlete.country}</span></div>
      <div><span>{findProfileAge(athlete.created_at)}</span></div>
      <div><em>"{athlete.bio}"</em></div>
    </div>
  )
}

export default Athlete
