import React, {useState} from 'react';
 import axios from 'axios'; 
 import { useNavigate } from 'react-router-dom'; 
 import { useAuth } from '../utils/auth';
export default function Register(){ 
  const [email,setEmail]=useState(''); 
  const [password,setPassword]=useState('');
   const [name,setName]=useState(''); 
   const navigate = useNavigate(); 
   const { saveToken } = useAuth();
  async function submit(e){ e.preventDefault(); 
    try{ 
      const res = await axios.post('http://localhost:4000/api/register',{email,password,name}); 
      saveToken(res.data.token);
       alert('Registered'); 
       navigate('/dashboard'); 
      }catch(err){ 
        alert(err?.response?.data?.error || 'Register failed'); 
      } }
  return (
  <div className='page card'>
    <h1>Register</h1>
    <form onSubmit={submit} className='contact-form'>
      <input placeholder='Name' value={name} onChange={e=>setName(e.target.value)} />
      <input placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} required />
      <input type='password' placeholder='Password' value={password} onChange={e=>setPassword(e.target.value)} required />
      <button className='btn-primary' type='submit'>Create account</button>
      </form>
      </div>);
}
