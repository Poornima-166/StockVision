import React, {createContext, useContext, useState} from 'react';
import jwt_decode from 'jwt-decode';
const AuthContext = createContext(null);
export function AuthProvider({children}){
  const [user, setUser] = useState(()=>{
    const t = localStorage.getItem('token');
    if(!t) return null;
    try{ 
      const p = jwt_decode(t);
       return {id:p.id, email:p.email, name:p.name||p.email.split('@')[0]}; }
      catch(e){ 
        return null; 
      }
  });
  function saveToken(token){
     localStorage.setItem('token', token);
      try{
         const p = jwt_decode(token);
          setUser({id:p.id, email:p.email, name:p.name||p.email.split('@')[0]}); 
        }catch(e){
           setUser(null); } 
          }
  function logout(){
     localStorage.removeItem('token'); 
     setUser(null); 
     window.location.href = '/'; 
    }
  return <AuthContext.Provider value={{user, saveToken, logout}}>{children}</AuthContext.Provider>;
}
export function useAuth(){
   return useContext(AuthContext);
   }
export async function apiWithAuth(token){ 
  const instance = (await import('axios')).default.create({ baseURL: 'http://localhost:8000' }); 
  if(token) instance.defaults.headers.common['Authorization'] = 'Bearer ' + token; return instance;
 }
