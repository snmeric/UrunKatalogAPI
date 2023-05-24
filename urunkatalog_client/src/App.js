import "./App.css";
import Login from "./pages/Login_Register/Login";
import Home from "./pages/Home/Home";
import { Route, Routes } from "react-router-dom";
import { RequireAuth } from "react-auth-kit";
import Product from "./pages/Product/ProductDetail";
import { useIsAuthenticated } from "react-auth-kit";
import Offer from "./pages/Offer/Offer";
import CreateProduct from "./pages/Product/Create_Delete_Product";
import Category from "./pages/Category_Brand_Color/Category_Brand_Color";
import Footer from "./components/Footer";
import Nav from "./components/Navbar/Nav";





function App() {
  const isAuthenticated = useIsAuthenticated();
  
  if (isAuthenticated()) {
  return (
    <div className="App">
       <Nav/>
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
    <Footer />
    </div>
  );
}else {
  return <Login />;
}
};

export default App;
