import React, { useEffect, useState } from "react";
import { useAuthHeader } from "react-auth-kit";
import { useParams } from "react-router-dom";
import axios from "axios";


const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(false);

  const authHeader = useAuthHeader();

  const config = {
    headers: {
      Accept: "text/plain",
      "Content-Type": "application/json",
      Authorization: `${authHeader()}`,
    },
  };
  console.log(authHeader());
  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      const response = axios.get("https://localhost:7104/api/Product", config);

    };
  }, []);

  return (
    <div className="flex w-full h-screen justify-center items-center">
      asdsad
    </div>
  );
};

export default Product;
