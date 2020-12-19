import React,{useContext, useCallback} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {UserContext} from '../App'
const NavBar = ()=>{
  const {state,dispatch} = useContext(UserContext);
  const history = useHistory();
  const renderList = () => {
    
    if(state){
      return [
        <li><Link className="navLink" to="/create">Create post</Link></li>,
        <li><Link className="navLink" to="/profile">Profile</Link></li>,
        <li><Link className="navLink" to="/followingposts">Posts</Link></li>,
        <li><button onClick={()=>{
          localStorage.clear();
          dispatch({type: "CLEAR"});
          history.push("/signin");
        }} className="btn loginBtn waves-effect waves-light #ff1744 red accent-3">Logout
        </button></li>
      ];
    }else{
      return [
      <li><Link className="navLink" to="/signin">Sign in</Link></li>,
      <li><Link className="navLink" to="/signup">Sign up</Link></li>
      ];
    }
  }
    return (
        <nav>
        <div className="nav-wrapper white" >
          <Link to={state?"/":"/signin"} className="brand-logo left">Jaystagram</Link>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            {renderList()};
          </ul>
        </div>
      </nav>
    );
}
export default NavBar;