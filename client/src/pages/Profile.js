import React,{useEffect, useState, useContext} from 'react';
import {UserContext} from '../App'
const Profile = () =>{
  const [myPics,setPics] = useState([]);
  const {state, dispatch} = useContext(UserContext);
  const [image, setImage] = useState("");
  const [url,setUrl]= useState(undefined);
  useEffect(()=>{
    fetch('/profile',{
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    }).then(res=>res.json()).then(result =>{
      setPics(result.post);
      console.log(result)
    })
  }, [])

  useEffect(()=>{
    if(image){
      const data = new FormData();
      data.append("file",image);
      data.append("upload_preset","instaImages");
      data.append("cloud_name","jaystahimages");
      fetch("https://api.cloudinary.com/v1_1/jaystahimages/image/upload", {
        method : "post",
        body : data
      }).then(res => res.json()).then(data => {
        setUrl(data.url);
 
        fetch('/updatepic',{
          method: "put",
          headers:{
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem('token')
          },
          body:JSON.stringify({
            pic: data.url
          })
        }).then(res=>res.json()).then(result=>{
          localStorage.setItem('user',JSON.stringify({...state,pic:result.pic}))
          dispatch({type:"UPDATEPIC",payload: result.pic})
          // console.log(state);
          // console.log(data);
          console.log("fff")
          console.log(result)
        })
      }).catch(e=>{
        console.log(e);
      })
    }
  },[image])

  const updateProfilePic = (file)=>{
    setImage(file);
  }
  return( 
    <>
    {myPics ? 
  <div style={{maxWidth:"550px", margin: "0px auto"}}>
    <div style={{
      display: "flex",
      justifyContent: "space-around",
      margin: "18px 0px",
      borderBottom: "1px solid grey"
    }}>
      <div>
        <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
        src={state ? state.pic : ""}
        />
        <div className="file-field input-field">
      <div className="btn #ff1744 red accent-3">
        <span>Change profile picture</span>
        <input style={{borderRadius: "20px"}} type="file" onChange={e=>{
          updateProfilePic(e.target.files[0])
        }}/>
      </div>
      <div className="file-path-wrapper">
        <input className="file-path validate" type="text"/>
      </div>
      </div>
      </div>
      <div>
  <h4>{state ? state.name : "Loading..."}</h4>
        <div style={{display: "flex",justifyContent:"space-between",width: "109%"}}>
          <h6>{myPics.length} posts</h6>
          <h6>{ state.followers ? state.followers.length : 1} followers</h6>
  <h6>  { state.following ? state.following.length : 1} following</h6>
        </div>
      </div>
    </div>

    <div className="gallery">
      {
        
        myPics.map(item => {
          return(
          <img id="imPf" key={item._id} className = "item" src={item.photo} alt={item.title}/>
          )
        })
      }
    </div>
  </div>
: "Loading.."
}
</>
  );

}
export default Profile;