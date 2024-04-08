import { useState } from 'react'


  export default function Register({register}){
    const [firstname, setFirstname ] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

  
    const submitT0Register = ev => {
      ev.preventDefault();
      register({ email, password, firstname, lastname });
    }
    return (
      <>
       <form onSubmit={ submitT0Register }>
          <input value={ firstname} placeholder='First Name' onChange={ ev=> setFirstname(ev.target.value)}/>
          <input value={ lastname} placeholder='Last Name' onChange={ ev=> setLastname(ev.target.value)}/>
          <input value={ email } name='email' placeholder='Email' onChange={ ev=> setEmail(ev.target.value)}/>
          <input value={ password} placeholder='password' onChange={ ev=> setPassword(ev.target.value)}/>
          <button disabled={ !(firstname && lastname && email && password) }>Create account</button>
         
        </form>
      </>
    );
  }
  