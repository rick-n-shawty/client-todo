import './App.css';
import {useState} from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
function App() {
  const baseURL = 'https://api-todos.onrender.com'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState('')
  const axiosJWT = axios.create()
  axiosJWT.defaults.withCredentials = true
  axios.defaults.withCredentials = true

  axiosJWT.interceptors.request.use(async(config) =>{
    console.log(config)
    let currentTime = new Date()
    const decoded = jwt_decode(user.accessToken)
    if(decoded.exp * 1000 < currentTime.getTime()){
      const res = await axios.post(baseURL + '/acccess_token_recovery')
      const {accessToken} = res.data
      setUser({accessToken: accessToken})
      config.headers.authorization = `Bearer ${accessToken}`
    }
    return config
  })

  const LogIn = async (e) =>{
    e.preventDefault()
    try{
      const res = await axios.post(baseURL + '/login', {email, password})
      console.log(res.data)
      const {accessToken} = res.data
      if(!accessToken){
        setUser({accessToken: ''})
      }else{
        setUser({accessToken: accessToken})
      }
    }catch(err){
      console.log(err)
      setUser({accessToken: ''})
    }
  }
  const getAllTasks = async () =>{
    try{
      const res = await axiosJWT.get(baseURL + '/tasks', {headers: {authorization: `Bearer ${user.accessToken}`}})
      console.log(res.data)
    }catch(err){
      console.log(err)
    }
  }
  return (
    <div className="App">
      {user.accessToken ? 
      <div>
        <h1>Welcome</h1>
        <button onClick={getAllTasks}>See my tasks</button>
      </div>
      :
      <div>
        <h1>Login</h1>
        <form onSubmit={LogIn}>
          <input 
          placeholder='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          />
          <input 
          placeholder='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          />
          <button>Log in</button>
        </form>
      </div>
      }
    </div>
  );
}

export default App;
