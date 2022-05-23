import React from 'react'

const ListItem = ({data, className}) => {
  
  return (
    <div className={className}>
        <span>{data.name}</span>
        <span>{data.country}</span>
        <span>{data.industry}</span>
        <span>{data.numberOfEmployees}</span>
    </div>
  )
}

export default ListItem