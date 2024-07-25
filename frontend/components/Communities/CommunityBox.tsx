import React from 'react'
import "../../styles/main.css"

interface CommunityBoxProps {
    name:string;
    members: number;
    listings: number;
}

const CommunityBox : React.FC<CommunityBoxProps> = ({name, members, listings}) => {
  return (
    <div className='community-box'>
      <h2 className='text-lg font-bold'>{ name }</h2>
      <p className="community-info">Members: {members}</p>
      <p className="community-info">Listings: {listings}</p>
    </div>
  )
}

export default CommunityBox
