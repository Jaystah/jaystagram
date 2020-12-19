import React,{useEffect, useState, useContext} from 'react';
import {UserContext} from '../App'
import {useParams} from 'react-router-dom'
const Profile = () =>{
  const [userProfile,setProfile] = useState(null);
  const {state, dispatch} = useContext(UserContext);
  const {userid} = useParams();
  const [showFollow,setShowFollow] = useState(state ? !state.following.includes(userid) : true);
  useEffect(()=>{
    fetch(`/user/${userid}`,{
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    }).then(res=>res.json()).then(result =>{
      console.log(result)
      setProfile(result);
    })
  }, [])
  console.log(userProfile)


  const followUser = ()=>{
      fetch('/follow',{
          method: "put",
          headers:{
              "Content-Type": "application/json",
              "Authorization": "Bearer " + localStorage.getItem("token")
          },
          body:JSON.stringify({
              followId: userid
          })
      }).then(res=>res.json()).then(result=>{
          console.log(result);
           dispatch({type:"UPDATE",payload:{
               following: result.following,
               followers: result.followers
           }})
           localStorage.setItem("user",JSON.stringify(result))

           setProfile((previousState)=>{
               return {
                   ...previousState,
                   user: {
                       ...previousState.user,
                       followers: [...previousState.user.followers,result._id]
                   }
               }
           })
           setShowFollow(false)
      })
  }
  const unfollowUser = ()=>{
      fetch('/unfollow',{
          method: "put",
          headers:{
              "Content-Type": "application/json",
              "Authorization": "Bearer " + localStorage.getItem("token")
          },
          body:JSON.stringify({
              unfollowId: userid
          })
      }).then(res=>res.json()).then(result=>{
          console.log(result);
           dispatch({type:"UPDATE",payload:{
               following: result.following,
               followers: result.followers
           }})
           localStorage.setItem("user",JSON.stringify(result))

           setProfile((previousState)=>{
               const newFollowers= previousState.user.followers.filter(item=>item!=result._id)
               return {
                   ...previousState,
                   user: {
                       ...previousState.user,
                       followers: newFollowers
                   }
               }
           })
           setShowFollow(true)
      })
  }

  return(
      <>
      {userProfile ?
  <div style={{maxWidth:"550px", margin: "0px auto"}}>
    <div style={{
      display: "flex",
      justifyContent: "space-around",
      margin: "18px 0px",
      borderBottom: "1px solid grey"
    }}>
      <div>
        <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
        src={userProfile.user.pic}
        />
      </div>
      <div>
  <h4>{userProfile.user.name}</h4>
        <div style={{display: "flex",justifyContent:"space-between",width: "109%"}}>
          <h6>{userProfile.posts.length} posts</h6>
          <h6>{userProfile.user.followers.length} followers</h6>
          <h6>{userProfile.user.following.length} following</h6>
        </div>
        {
            showFollow 
            ?
 <button onClick={()=>followUser()} className="btn loginBtn waves-effect waves-light #ff1744 red accent-3">Follow
  </button>
            :
             <button onClick={()=>unfollowUser()} className="btn loginBtn waves-effect waves-light #ff1744 red accent-3">Unfollow
  </button>
        }
       
       
      </div>
    </div>

    <div className="gallery">
      {
        userProfile.posts.map(item => {
          return(
          <img id="imPf" key={item._id} className = "item" src={item.photo} alt={item.title}/>
          )
        })
      }
    </div>
  </div>
  : <h2> Loading... </h2> 
}
  </>
  );

}
export default Profile;