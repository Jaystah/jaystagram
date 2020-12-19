import React,{createContext,useEffect,useReducer,useContext} from 'react';
import NavBar from './components/navbar';
import "./App.css"
import {BrowserRouter,Route, Switch, useHistory} from 'react-router-dom'
import Home from '../src/pages/Home';
import Signin from '../src/pages/Signin';
import Signup from '../src/pages/Signup';
import Profile from '../src/pages/Profile';
import UserProfile from '../src/pages/UserProfile';
import CreatePost from '../src/pages/CreatePost';
import {reducer,initialState} from './reducers/userReducer'
import FollowingPosts from '../src/pages/FollowingPosts'
export const UserContext = createContext();

const Routing = ()=>{
  const history = useHistory();
  const {state,dispatch} = useContext(UserContext);
  useEffect( () =>{
    const user = JSON.parse(localStorage.getItem("user"));
    
    if(user){
      dispatch({type:"USER",payload:user});
      history.push('/');
    }else{
      history.push('/signin');
    }
  }, [])
  return (
    <Switch>
    <Route exact path="/">
      <Home />
    </Route>
    <Route path="/signin">
      <Signin />
    </Route>
    <Route path="/signup">
      <Signup />
    </Route>
    <Route exact path="/profile">
      <Profile />
    </Route>
    <Route path="/create">
      <CreatePost />
    </Route>
    <Route path="/profile/:userid">
      <UserProfile />
    </Route>
    <Route path="/followingposts">
      <FollowingPosts />
    </Route>
    </Switch>
  );
}
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
    <NavBar/>
    <Routing/>
    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
