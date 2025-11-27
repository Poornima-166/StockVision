import React, {useState} from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../utils/auth';
export default function Login(){ 
  const [email,setEmail]=useState(''); 
  const [password,setPassword]=useState(''); 
  const navigate = useNavigate();
   const { saveToken } = useAuth();
  async function submit(e){ e.preventDefault();
     try{
       const res = await axios.post('http://localhost:8000/api/login',{email,password}); 
       saveToken(res.data.token); 
       alert('Login successful');
        navigate('/dashboard'); 
      }catch(err){ 
        alert(err?.response?.data?.detail || 'Login failed'); }
       }
  return (
  <div className='page card'>
    <h1>Login</h1>
    <form onSubmit={submit} className='contact-form'>
      <input placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} required />
      <input type='password' placeholder='Password' value={password} onChange={e=>setPassword(e.target.value)} required />
      <button className='btn-primary' type='submit'>Login</button>
      </form>
      </div>);
}
