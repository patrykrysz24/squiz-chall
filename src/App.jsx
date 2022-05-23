import React from 'react'

import { ListProvider } from './components/_context/listContext'


import './style/style.min.css'
import List from './components/organisms/List'



const App = () => {

  return (
    <ListProvider>
      <List></List>
    </ListProvider>
  )
}

export default App