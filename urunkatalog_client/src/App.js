import "./App.css";
import Login from "./components/Login";
import Home from "./components/Home";
import { Route, Routes } from "react-router-dom";
import { RequireAuth } from "react-auth-kit";
import Product from "./components/Product";
import Account from "./components/Account";
import { useNavigate } from "react-router-dom";
import {useIsAuthenticated} from 'react-auth-kit';

// const AnyComponent = () => {
//   const navigate = useNavigate();
//   const isAuthenticated = useIsAuthenticated();

//   if (isAuthenticated()) {
//     navigate("/");
//   } else {
//     navigate("/login");
//   }


// };

function App() {
  return (
   
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route
          path="/"
          element={
            <RequireAuth loginPath="/login">
              <Home />
            </RequireAuth>
          }
        ></Route>
        <Route path="/account" element={<Account />}></Route>
        <Route path="/product/:id" element={<Product />}></Route>
      </Routes>
    
  );
}

export default App;
