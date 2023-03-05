import logo from './logo.svg';
import './App.css';
import FibreProducts from './components/Products';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import "./assets/css/argon-design-system.css";
function App() {
  return (
    <div className="App">
      <Header />
      <FibreProducts />
    </div>
  );
}

export default App;
