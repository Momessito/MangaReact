import './App.css';
import './media.css';
import { BrowserRouter as Router, Routes,Route} from 'react-router-dom'

import Home from './Home'
import Login from './Login'

function App() {
  

return(
  // rotas
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Login" element={<Login />} />
    </Routes>
  </Router>
)
}


export default App;
