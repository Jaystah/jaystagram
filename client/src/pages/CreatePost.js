import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import M from 'materialize-css';
const CreatePost = () =>{
  const [title,setTitle] = useState("");
  const [body,setBody] = useState("");
  const [image,setImage] = useState("");
  const [url,setUrl] = useState("");
  const history = useHistory();



  useEffect(() => {
    if(url){
      fetch("/createPost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({
          title,
          body,
          url
        })
      }).then(res=>res.json()).then(data=>{
        if(data.error){
          M.toast({html: data.error, classes:"#e57373 red lighten-2"})
        }else{
          M.toast({html: "Post created!!", classes:"#7cb342 light-green darken-1"});
          history.push('/')
        }
      })
      }
  },[url])

  const postData = () =>{
    const data = new FormData();
    data.append("file",image);
    data.append("upload_preset","instaImages");
    data.append("cloud_name","jaystahimages");
    fetch("https://api.cloudinary.com/v1_1/jaystahimages/image/upload", {
      method : "post",
      body : data
    }).then(res => res.json()).then(data => {
      setUrl(data.url);
    }).catch(e=>{
      console.log(e);
    })
  }
    return (
        <div className="card input-field"
        style={{
          margin: "100px auto",
          maxWidth: "500px",
          padding: "20px",
          textAlign: "center"
        }}
        >
            <input type="text" onChange={(e)=>{
              setTitle(e.target.value);
            }} value = {title} placeholder="Title"/>
            <input type="text" onChange={(e)=>{
              setBody(e.target.value);
            }} value = {body} placeholder="Body"/>
            <div className="file-field input-field">
      <div className="btn #ff1744 red accent-2">
        <span>Upload image</span>
        <input type="file" onChange={e=>{
          setImage(e.target.files[0])
        }}/>
      </div>
      <div className="file-path-wrapper">
        <input className="file-path validate" type="text"/>
      </div>
    </div>
    <button onClick={()=>{postData()}} className="btn waves-effect waves-light #ff1744 red accent-2" type="submit" name="action">Create post</button>
  
        </div>
    );
}
export default CreatePost;
