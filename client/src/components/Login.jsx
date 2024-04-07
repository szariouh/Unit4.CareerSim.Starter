

const Login = ({ login })=> {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const submitT0Login = ev => {
      ev.preventDefault();
      login({ email, password });
    }
    return (
      <>
       <form onSubmit={ submitT0Login } >
          <input value={ email } type='email' placeholder='email' onChange={ ev=> setEmail(ev.target.value)}/>
          <input value={ password} placeholder='password' onChange={ ev=> setPassword(ev.target.value)}/>
          <button disabled={ !(email && password) }>Log In</button>
          <div>Or</div>
          <button onClick={()=>{navigate('/register')}}>Create Account</button>
  
        </form>
      </>
    );
  }


  export default Login
  