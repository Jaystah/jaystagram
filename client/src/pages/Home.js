import React,{useState,useEffect, useContext} from 'react';
import {UserContext} from '../App'
import {Link} from 'react-router-dom'
const Home = () =>{
  const [data,setData] = useState([]);
  const {state,dispatch} = useContext(UserContext);
  useEffect(()=>{
    fetch("/seePosts",{
      headers: {
        "Authorization": "Bearer "  + localStorage.getItem("token") 
      }
    }).then(res => res.json()).then(result =>{
      console.log(result);
      setData(result.post);
    })
  },[])
  const makeComment = (text, id) =>{
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
      body:
        JSON.stringify({
          postId: id,
          text
        })
      
    }).then(res=>res.json()).then(result => {
          const newData = data.map(item =>{
            if(item._id === result._id){
              return result;
            }else{
              return item;
            }
          })
          setData(newData);
        })
  }
  const deletePost = (postId) =>{
    fetch(`/deletepost/${postId}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }).then(res=>res.json()).then(result=>{
      console.log(result._id)
      
      const newData = data.filter(item => {
        console.log(item._id)
        return item._id !== result._id;
      })
      setData(newData)
    })
  }
  const deleteComment = (postId,id)=>{
    console.log(id);
    fetch("/deletecomment",{
      method: "put",
      headers:{
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify({
        commentId: id,
        postId
      })
    }).then(res=>res.json()).then(result => {
      console.log(result);
      const newData = data.map(item =>{
        if(item._id === result._id){
          return result;
        }else{
          return item;
        }
      })
      setData(newData);
    })
  }

  const likePost = (id)=>{
    fetch("/like",{
      method: "put",
      headers:{
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify({
        postId: id
      })
    }).then(res=>res.json()).then(result => {
      const newData = data.map(item =>{
        if(item._id === result._id){
          return result;
        }else{
          return item;
        }
      })
      setData(newData);
    })
  }
  const unlikePost = (id)=>{
    fetch("/unlike",{
      method: "put",
      headers:{
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify({
        postId: id
      })
    }).then(res=>res.json()).then(result => {
      //console.log(result);
      const newData = data.map(item =>{
        if(item._id === result._id){
          return result;
        }else{
          return item;
        }
      })
      setData(newData);
    })
  }
  return( 
  <div className="home">
    {
      data.map(item=>{
        console.log(item.postedBy)
        return(
          <div className="card home-card" key={item._id}>
            <table>
              <colgroup>
              <col span="1" style={{width: "60px"}}/>
              </colgroup>
              <tr>
                <td>
          <img style={{width: "50px", borderRadius: "50px" ,height:"50px"}}src={item.postedBy.pic}/></td><td><h5 style={{padding: "5px"}} ><Link to={"/profile/"+item.postedBy._id}>{item.postedBy.name}</Link> {item.postedBy._id == state._id &&
           <i className="material-icons" onClick= {()=>{
             deletePost(item._id);
           }} style={{float: "right"}}>delete</i> }
           </h5></td>
           </tr>
           </table>
          <div className="card-image">
            <img src={item.photo}/>
          </div>
          <div className="card-content">
          
          {item.likes.includes(state._id) 
          ?
          <i className="material-icons redHeart" onClick={() => {unlikePost(item._id)}} style={{color: "red"}}>favorite</i>
          :
          <i className="material-icons" onClick={() => {likePost(item._id)}}>favorite_border</i> 
          }
        
        <h6>{item.likes.length + " likes"}</h6>
        <h6>{item.title}</h6>
        <p>{item.body}</p>
        <div style={{border: "1px solid gray"}}>
        <h4>{item.comments.length} {item.comments.length == 1 ? "comment" : "comments"}: </h4>
        {
          item.comments.map(rec =>{
            return (
            <div>
            <h6 key={rec._id}><span style={{fontWeight: "600"}}>{rec.postedBy.name} - </span> {rec.text}</h6>
             {rec.postedBy._id == state._id && <span onClick={() =>{deleteComment(item._id,rec._id)}} style={{color: "red", marginLeft: "5px", fontSize: "14px"}}>delete</span>}  
            </div>
            )
          })
        }
        </div>
        <form onSubmit={(e) =>{
          e.preventDefault();
          makeComment(e.target[0].value, item._id);
        }}>
            <input type="text" placeholder="Add a comment"/>
        </form>
          </div>
        </div>
      
        )
      })
    }
</div>
  );
  
}
export default Home;