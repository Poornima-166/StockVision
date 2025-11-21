import React from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import About from './pages/About'
import Contact from './pages/Contact'
//import Portfolio from './pages/Portfolio'
import Login from './pages/Login'
import Register from './pages/Register'
import ThemeToggle from './components/ThemeToggle'
import { AuthProvider, useAuth } from './utils/auth'
import Portfolio from "./pages/Portfolio";

function Nav(){
  const loc = useLocation();
  const { user, logout } = useAuth();
  return (
    <nav className='topbar'><div className='max-w-6xl mx-auto nav-inner'>
      <div className='brand'><Link to='/'>StockVision</Link></div>
      <div className='links'>
        <Link to='/' className={loc.pathname==='/'? 'active':''}>Home</Link>
        <Link to='/dashboard' className={loc.pathname.startsWith('/dashboard')? 'active':''}>Dashboard</Link>
        <Link to='/about' className={loc.pathname==='/about'? 'active':''}>About</Link>
        <Link to='/contact' className={loc.pathname==='/contact'? 'active':''}>Contact</Link>
        {user ? <span style={{marginLeft:12}}>Hi, {user.name} <button className='btn-ghost' onClick={logout}>Logout</button></span> : <><Link to='/login'>Login</Link> <Link to='/register'>Register</Link></>}
        <ThemeToggle />
      </div>
    </div></nav>
  );
}

export default function App(){
  return (
    <AuthProvider>
      <div className='app-root'>
        <Nav />
        <main className='max-w-6xl mx-auto main-area'>
          <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/dashboard' element={<Dashboard/>} />
            <Route path='/portfolio' element={<Portfolio/>} />
            <Route path='/about' element={<About/>} />
            <Route path='/contact' element={<Contact/>} />
            <Route path='/login' element={<Login/>} />
            <Route path='/register' element={<Register/>} />
            <Route path="/portfolio" element={<Portfolio />} />

          </Routes>
        </main>
        <footer className='footer'><div className='max-w-6xl mx-auto'>© StockVision Demo</div></footer>
      </div>
    </AuthProvider>
  );
}
