import React, { useEffect, useState } from "react";
import { useAuthHeader } from "react-auth-kit";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, Col, Row, Button, Text } from "@nextui-org/react";

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
  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      
      try {
        const response = await axios.get(
          `https://localhost:7104/api/Product`,
          config
        );
        const selectedData = response.data.find((item) => item.id === id);
        setProduct(selectedData);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    getProduct();
  }, [id, config]);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className="flex flex-col justify-center items-center p-4 space-y-4">
      <div className="max-w-xl mx-auto">
        <Card4></Card4>
      </div>
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">`${product.name}`</h1>
        <p className="text-gray-700 mb-4">Ürün Açıklaması</p>
      </div>
    </div>
  );
};

export default Product;

export const Card4 = () => (
  <Card css={{ w: "100%", h: "400px" }}>
    <Card.Body css={{ p: 0 }}>
      <Card.Image
        src="https://nextui.org/images/card-example-6.jpeg"
        width="100%"
        height="100%"
        objectFit="cover"
        alt="Card example background"
      />
    </Card.Body>
  </Card>
);
