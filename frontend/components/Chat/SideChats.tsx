import React from 'react'
import SearchInput from './SearchInput'
import Conversations from './Conversations'
const SideChats = () => {
  return (
	<div className='w-25' style={{background:""}}>
	  <SearchInput/>
    <Conversations/>
	</div>
  )
}
export default SideChats
