import { useState } from 'react'
import { Button } from "@workspace/ui/components/button"
import DataProvider from './lib/DataProvider'


function App() {

  return (
    <DataProvider>
      <h1></h1>
    </DataProvider>
  )
}

export default App
