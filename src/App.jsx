import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CommentSection from './Components/CommentSection'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <CommentSection/>
    </>
  )
}

export default App
