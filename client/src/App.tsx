//@ts-nocheck 
import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  
  const [backendData, setBackendData] = useState([{}]);

  useEffect(() => {
    fetch("/api")
      .then((response) => response.json())
      .then((data) => setBackendData(data))
  }, [])
  
  return (
    <div className="App">
      Hello World
      {(typeof backendData.users === 'undefined') ? (
        <p>Loading...</p>
      ):(
        backendData.users.map((user:Object, i:number) => {
          return <p key={i}> {user} </p>
        })
      )}
    </div>
  );
}

export default App;
