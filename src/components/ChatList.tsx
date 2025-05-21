import React from 'react'
import ChatListItem from './ChatListItem'

const ChatList = () => {
  return (
    <div className='flex h-full w-full p-1 flex-col items-center space-x-1.5'>
      <ChatListItem/>
    </div>
  )
}

export default ChatList
