import { BrowserRouter ,Routes,Route} from 'react-router-dom'
import './App.css'
import SignUp from './components/SignUp'
import Login from './components/Login'
import Home from './components/Home'
import SeedPhrase from './components/SeedPhrase'
import { ToastContainer } from 'react-toastify';
import  Wallet  from './components/Wallet'

function App() {
 

  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/seed" element={<SeedPhrase/>} />
        <Route path="/wallet" element={<Wallet/>} />  
        <Route path="/" element={<Home/>} />
      </Routes>
    </BrowserRouter>
    <ToastContainer/>
    </div>
  )
}

export default App
