import React,{useContext, useCallback} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {UserContext} from '../App'
import M from 'materialize-css';

document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.sidenav');
  var instances = M.Sidenav.init(elems);
});


const NavBar = ()=>{
  const {state,dispatch} = useContext(UserContext);
  const history = useHistory();
  const renderList = () => {
    
    if(state){
      return [
        <li><Link className="navLink" to="/create">Create post</Link></li>,
        <li><Link className="navLink" to="/profile">Profile</Link></li>,
        <li><Link className="navLink" to="/followingposts">Posts of your following</Link></li>,
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
      <>
      <nav>
      <div class="nav-wrapper" style={{backgroundColor: "white"}}>
        <Link to="/" class="brand-logo">Jaystagram</Link>
        <a href="#" data-target="mobile-demo" class="sidenav-trigger"><i class="material-icons">menu</i></a>
        <ul class="right hide-on-med-and-down">
            {renderList()}
          </ul>
        </div>
      </nav>
        <ul class="sidenav" id="mobile-demo">
        <li><Link className="navLink" to="/">Home</Link></li>
          {renderList()}
        </ul>
        </>
    );
}
export default NavBar;