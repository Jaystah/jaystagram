import React,{useState,useContext} from 'react';
import {Link,useHistory} from 'react-router-dom';
import {UserContext} from '../App'
import M from 'materialize-css';
const SignIn = () =>{
  const {state,dispatch} = useContext(UserContext);
  const history = useHistory();
  const [password,setPassword] = useState("")
  const [email,setEmail] = useState("")
  const PostData = () => {
    fetch("/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    }).then(res=>res.json()).then(data=>{
      if(data.error){
        M.toast({html: data.error, classes:"#e57373 red lighten-2"})
      }else if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
        M.toast({html: "Please give a valid email", classes:"#e57373 red lighten-2"});
        return;
      }else{
        localStorage.setItem("token",data.token);
        localStorage.setItem("user",JSON.stringify(data.user));
        dispatch({type:"USER", payload: data.user});
        document.getElementById("loaderOn").style.display = "inline-block";
        M.toast({html: "Signed in!", classes:"#7cb342 light-green darken-1"});
        history.push('/')
      }
    })
  }
  return( 
    <div>
    <div className="card auth input-field">
    <h1 className="authTitle">Jaystagram</h1>
    <input type="text" placeholder="Email" value={email} onChange={(e)=>{
        setEmail(e.target.value);
      }}/>
      <input type="password" placeholder="Password" value={password} onChange={(e)=>{
        setPassword(e.target.value);
      }}/>
      <button onClick={()=>PostData()} className="btn loginBtn waves-effect waves-light #ff1744 red accent-3">Login
  </button>
  <h6>
    <Link to="/signup">Not yet registered? <span style={{color: "#0095f6"}}>Sign yourself up!</span></Link>
  </h6>
  <div id ="loaderOn" className="preloader-wrapper small active">
    <div className="spinner-layer spinner-red-only">
      <div className="circle-clipper left">
        <div className="circle"></div>
      </div><div className="gap-patch">
        <div className="circle"></div>
      </div><div className="circle-clipper right">
        <div className="circle"></div>
      </div>
      </div>
      </div>
  </div>
  </div>
  );
}
export default SignIn;