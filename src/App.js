import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Login from "./Morniter_login"
import SafetyDriver from "./Safety";
function App() {

  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />}></Route>
          <Route exact path="/Login" element={<Login />}></Route>
          <Route exact path="/Safety" element={<SafetyDriver/>}></Route>
          <Route exact redirect="/" element={<Login />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
