import React, {useState} from 'react'; import axios from 'axios';

export default function Contact(){
   const [name,setName]=useState(''); 
   const [email,setEmail]=useState('');
    const [message,setMessage]=useState('');

  async function submit(e)
  { e.preventDefault(); 
    try{
       await axios.post('http://localhost:4000/api/contact',{name,email,message});
        alert('Message received'); setName(''); 
        setEmail(''); setMessage(''); 
      }catch(err){ 
        alert('Failed'); } }
  return (
  <div className='page card'>
    <h1>Contact</h1>
    <form onSubmit={submit} className='contact-form'>
      <input placeholder='Name' value={name} onChange={e=>setName(e.target.value)} required />
      <input placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} required />
      <textarea placeholder='Message' value={message} onChange={e=>setMessage(e.target.value)} required />
        <button className='btn-primary' type='submit'>Send Message</button></form></div>);
         }
