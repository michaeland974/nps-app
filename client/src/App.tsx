import { InputContainer } from './Containers/InputContainer';
import { Main } from './Containers/Main';
import { Header } from './Components/Header';
import './global-styles/reset.css'
import './global-styles/App.css';
import logo from './images/noun-trees.png'

//Header image <img src={"/images/noun-trees.png"} id="logo" alt="trees"></img>
const App = () => {
  
  return (
    <div className="App">
      <Header />
      <Main />
    </div>
  );
}

export default App;
