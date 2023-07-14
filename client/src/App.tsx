import { Main } from './Containers/Main';
import { Header } from './Components/Header';
import './global-styles/reset.css'
import './global-styles/App.css';

const App = () => {
  
  return (
    <div className="App">
      <span className="mobile-header">
      <Header />
      </span>
      <Main />
    </div>
  );
}

export default App;
