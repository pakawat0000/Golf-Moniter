import "./Morniter_login.css";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { createRef } from "react";
import BackgroundLog from "./image/background-golf.jpg";
import API from "./API";
import LOGO from "./image/logo.jpg"
import Usericon from "./image/Loginfo.png"
import permission from "./image/permission2.png"
import username from "./image/user.png"
import name from "./image/name.png"
import calendar from "./image/calendar.png"
function Login() {
  const User = createRef();
  const Pass = createRef();
  // const LoginInfo = useRef()
  const [data_login, setdata_login] = useState();
  const [Showpass, setShowpass] = useState(false);
  const [IsLoggedIn,setIsLoggedIn] =useState(false)

  function Showpassword() {
    setShowpass(!Showpass);
  }
  const api = new API();
  async function onsubmit(event) {
    event.preventDefault();
    let form = { User: User.current.value, Pass: Pass.current.value };
    const login_res = await api.postlogin("/authentucation/login",{user:form.User,pass:form.Pass})
        try {
          if (login_res.status === 200) {
            setIsLoggedIn(true)
            const token = login_res.data.token_type + " " + login_res.data.access_token;
            const datastorage = {data:login_res.data,token:token}
            window.sessionStorage.setItem("User", JSON.stringify(datastorage));
            setdata_login(datastorage)
            console.log(login_res.status)
            
          }
        } catch (e) {
          if (e.name === "CanceledError") {
            return;
          }
          try {
            if (e.response.status === 422 || e.response.status === 400) {
              alert("ERROR. Incorrect password");
              console.log(1)
            } 
            else {
              alert("ERROR. Network disconnect");
              console.log(2)
            }
          } 
          catch (e) {
            alert("ERROR. Network disconnect");
            console.log(3)
          }
        }
      

    // const LoginInfo = await api.post("/user/", { User: form.User, Pass: form.Pass },'');
    // console.log(LoginInfo.data);
  }

  async function Logout() {
    window.sessionStorage.clear("User");
    setIsLoggedIn(false)
    console.log(data_login.data.useradad)
    await api.post("/authentication/logout",data_login.data.user,"")
  
  }

  useEffect(() => {
    const JSONdata = window.sessionStorage.getItem('User');
      if (JSONdata) {
        setdata_login(JSON.parse(JSONdata))
        setIsLoggedIn(true)
       
      // user = window.sessionStorage.getItem("User");
      // const userJson = JSON.parse(user);
      // const token = userJson.token_type + " " + userJson.access_token;
      // if(userJson){
      // setdata_login({ data: userJson, token: token });
      // console.log(data_login.data);
      // setIsLoggedIn(true);e
      }
  }, []);
  

  return (
    <div className="BodyLog">
      <div className="ContainerLog">
        <img className="BackgroundLog" src={BackgroundLog}></img>
        {IsLoggedIn? (
          <div className="LoginInfo">
            <img className="Usericon" src={Usericon}></img>
            <div className="Userwelcome">
              <span>ยินดีต้อนรับ </span>
            </div>
            <div className="BoxInfo">
            <div className="Boxshow"><img className="Icon" src={name}></img><p className="TextInfo">Name : {data_login.data.user.name}</p></div>
            {/* <div className="Showbox">{data_login.data.user.name}</div> */}
            <div className="Boxshow"><img className="Icon" src={username}></img><p className="TextInfo">Username : {data_login.data.user.username}</p></div>
            {/* <div className="Showbox">{data_login.data.user.username}</div> */}
            <div className="Boxshow"><img className="Icon" src={permission}></img><p className="TextInfo">Access Permision : {data_login.data.user.role}</p></div>
            {/* <div className="Showbox">{data_login.data.user.role}</div> */}
            <div className="Boxshow"><img className="Icon" src={calendar}></img><p className="TextInfo">Date & Time : 23/1/65 : 10:12 </p></div>
            </div>
            <button className="Logout" onClick={Logout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="LoginPage">
            <img className="Logo" src={LOGO}></img>
            <p>Login</p>
            <form onSubmit={onsubmit}>
              <div className="User-box">
                <input ref={User} type="text" name="g" required></input>
                <label>Username</label>
              </div>
              <div className="Pass-box">
                <input
                  ref={Pass}
                  type={Showpass ? "text" : "password"}
                  name="p"
                  required
                ></input>
                <label className="Pass">Password</label>
                <label className="EyeS">
                  {!Showpass && (
                    <FaRegEyeSlash className="Eyes" onClick={Showpassword} />
                  )}
                  {Showpass && (
                    <FaRegEye className="Eyes" onClick={Showpassword} />
                  )}
                </label>
              </div>
              <button type="submit" className="LoginBtn">
                Login
              </button>
              {/* <span>
              <span>Forgot </span>
              <a href="#">Username / Password</a>
            </span> */}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
export default Login;
