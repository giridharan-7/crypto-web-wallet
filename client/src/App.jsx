import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Welcome from './components/Welcome'
import SignUp from './components/SignUp'
import Login from './components/Login'
import Home from './components/Home'
import SeedPhrase from './components/SeedPhrase'
import { ToastContainer } from 'react-toastify';
import Wallet from './components/Wallet'
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/seed" element={<SeedPhrase />} />
          <Route path="/wallet" element={<Wallet />} />  
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  )
}

export default App
