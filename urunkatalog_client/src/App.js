import './App.css';
import Login from './components/Login';
import Home from './components/Home';
import { Route, Routes } from "react-router-dom";
import { RequireAuth } from "react-auth-kit";




function App() {

  return (

    <Routes>
      <Route path="/" element={<RequireAuth loginPath='/login'>
        <Home />
      </RequireAuth>}>
      </Route>
      <Route path="/login" element={<Login />}></Route>
    </Routes>



  );
}

export default App;
