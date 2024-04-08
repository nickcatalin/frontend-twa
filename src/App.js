import './App.css'
import './index.css'; // Adjust the path to where your CSS file is located
import logo from './logo.svg'
import { Button } from 'primereact/button';
import 'primereact/resources/themes/saga-green/theme.css';  //theme
import 'primereact/resources/primereact.min.css';          //core css
import 'primeicons/primeicons.css';                        //icons
import AuthContent from './AuthContent';

function App() {
  return (
  
    <div className="App">
      
        <AuthContent />

    </div>

  );
}

export default App;