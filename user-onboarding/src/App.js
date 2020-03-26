import React from 'react'
import Form from './components/Form'
import './App.css'

const users = []

function App() {
  return (
    <div className="App">
      <Form users={users} />
    </div>
  );
}

export default App;
