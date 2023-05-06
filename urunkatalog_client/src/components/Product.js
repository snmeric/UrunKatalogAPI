import React, { useEffect, useState } from "react";
import { useAuthHeader } from "react-auth-kit";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, Col, Row, Button, Text } from "@nextui-org/react";
import { Chip } from "@material-tailwind/react";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState([]); 
  const [selproduct, setSelProduct] = useState([]); 
  const [loading, setLoading] = useState(false);
 
  // console.log(id);
  const authHeader = useAuthHeader();

  const config = {
    headers: {
      Accept: "text/plain",
      "Content-Type": "application/json",
      Authorization: `${authHeader()}`,
    },
  };


 
  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      
    
        axios
        .get(`https://localhost:7104/api/Product?id=8`, config)
        .then(response => 
          setProduct(response.data.result)
        )
        .catch(error => 
          console.log(error)
        );

        
        setLoading(false);


      console.log("Responsee",product);
      
    };

    getProduct();
  }, []);

  useEffect(() => {
    if (product.length > 0) {
      const filteredProduct = product.find(p => p.id === parseInt(id));
      setSelProduct(filteredProduct || {});
    }
  }, [product,id]);



  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className="flex flex-col justify-center items-center p-4 space-y-4">
      <div className="max-w-xl mx-auto">
      <img
      className="h-full w-full rounded-lg shadow-xl shadow-blue-gray-900/50"
      src={"https://localhost:7104/resources/" + selproduct.image}
      alt="nature image"
    />
      {/* <Card css={{ w: "100%", h: "400px" }}>
    <Card.Body css={{ p: 0 }}>
      <Card.Image
        src=
        width="100%"
        height="100%"
        objectFit="cover"
        alt="Card example background"
      />
    </Card.Body>
  </Card> */}

      </div>
      <div className="max-w-xl mx-auto flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-2">{selproduct.name}</h1>
        <h4 className="text-gray-700 mb-4">Açıklama: {selproduct.description}</h4>
        <h4 className="text-gray-700 mb-4">Marka: {selproduct.brand}</h4>

        <Chip color="blue" value="Renk" />
      
      </div>
    </div>
  );
};

export default Product;


