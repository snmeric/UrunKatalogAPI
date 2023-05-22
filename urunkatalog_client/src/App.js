import "./App.css";
import Login from "./components/Login";
import Home from "./components/Home";
import { Route, Routes } from "react-router-dom";
import { RequireAuth } from "react-auth-kit";
import Product from "./components/Product";
import { useNavigate } from "react-router-dom";
import { useIsAuthenticated } from "react-auth-kit";
import Offer from "./components/Offer";
import CreateProduct from "./components/CreateProduct";
import Category from "./components/Category";


function App() {
 
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <RequireAuth loginPath="/login">
            <Home />
          </RequireAuth>
        }
      />
      <Route path="/offer" element={<Offer />} />
      <Route path="/createProduct" element={<CreateProduct />} />
      <Route path="/category" element={<Category />} />
      <Route path="/product/:id" element={<Product />} />
    </Routes>
  );
}

export default App;
