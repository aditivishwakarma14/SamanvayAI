import React, { useEffect } from 'react'
import Nav from './Nav.jsx'
import ChatInput from './ChatInput.jsx'
import MessageList from './MessageList.jsx'
import { useDispatch, useSelector } from 'react-redux'
import getMessages from '../features/getMessages.js'
import { setMessages } from '../state/slices/messageSlice.js'

function ChatArea() {

  const { selectedConversation } = useSelector(
    state => state.conversation
  )

  const dispatch = useDispatch()

  useEffect(() => {

    const getMsg = async () => {

      if (!selectedConversation?._id) return

      const data = await getMessages(
        selectedConversation._id
      )

      dispatch(setMessages(data || []))
    }

    getMsg()

  }, [selectedConversation, dispatch])

  return (
    <div className="flex-1 flex flex-col">

      <Nav />

      <MessageList />

      <ChatInput />

    </div>
  )
}

export default ChatArea