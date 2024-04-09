import React, { useState } from 'react'; // Import useState
import './App.css' // Ensure Tailwind CSS is imported in your project
import logo from './logo.svg'
import 'primereact/resources/themes/saga-green/theme.css';  //theme
import 'primereact/resources/primereact.min.css';          //core css
import 'primeicons/primeicons.css';                        //icons
import Login from './components/Login';
import Register from './components/Register';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';

function App() {
  const [showLogin, setShowLogin] = useState(true); // true shows Login, false shows Register

  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  const startContent = (
    <div className="flex justify-center items-center">
      <img src={logo} className="App-logo" alt="logo" />
    </div>
  );

  const endContent = (
    <div className="flex justify-center items-center">
      <Button label="Login" onClick={() => setShowLogin(true)} className="p-button-text" />
      <Button label="Register" onClick={() => setShowLogin(false)} className="p-button-text" />
    </div>
  );

  return (
    <div className="App flex flex-col h-screen">
      <Toolbar start={startContent} end={endContent} />
      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 h-screen">
        <div className="bg-red-500 flex justify-center items-center">
        </div>
        <div className="bg-green-500  flex justify-center items-center h-full">
          {showLogin ? <Login onToggle={toggleForm} /> : <Register onToggle={toggleForm} />}
        </div>
      </div>
    </div>
  );
}

export default App;
