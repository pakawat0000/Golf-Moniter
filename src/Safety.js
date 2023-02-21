import "./Safety.css";
import Logo from "./image/Logo-nstda.svg";
import  Mapbox from "./Mapbox.js"


function SafetyDriver() {
  return (
    <div className="ContainerSafety">
        <div className="Map"><Mapbox/></div>
      <div className="Nav">
        <div className="ImgNavBox">
          <img className="LogoNav" src={Logo}></img>
        </div>
        <div className="TextNav">
          <span>Auto Shuttle</span>
          <span>คันที่B</span>
        </div>
      </div>
      <div className="TopbarSafety">
        <div className="Text-Topbar">
          <p>รับผู้โดยสารเรียบร้อย. กดปุ่ม next เพื่อไปต่อ</p>
          <p>มุ่งหน้าไปสถานี</p>
          <p>จุด1 MRT บางซื่อ ทางออก4</p>
        </div>
        <button className="Btn-Topbar">NEXT </button>
      </div>
      <div className="DropDown-Box">
        <option className="Drop"></option>
      </div>
      <div className="Btn-Buttombar">
        <button className="Start-Btn">Start</button>
        <button className="Stop-Btn">Stop</button>
      </div>
      <div className="Switch">
        <p>กดปุ่มสวิซ หากผู้โดยสารเต็มคันรถ</p>
        <label class="Toggle-switch">
          <input type="checkbox"></input>
          <span class="slider round"></span>
        </label>
      </div>
    </div>
  );
}

export default SafetyDriver;
