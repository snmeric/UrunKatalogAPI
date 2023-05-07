import React, { useEffect, useState } from "react";
import { useAuthHeader } from "react-auth-kit";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, Col, Row, Button, Text } from "@nextui-org/react";
import { Chip, Slider } from "@material-tailwind/react";
import { Input, Grid } from "@nextui-org/react";

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
        .then((response) => setProduct(response.data.result))
        .catch((error) => console.log(error));

      setLoading(false);

      console.log("Responsee", product);
    };

    getProduct();
  }, []);

  useEffect(() => {
    if (product.length > 0) {
      const filteredProduct = product.find((p) => p.id === parseInt(id));
      setSelProduct(filteredProduct || {});
    }
  }, [product, id]);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div>
      <div className="flex flex-row justify-center items-center p-8">
        <div className="max-w-xl mx-auto md:block hidden w-1/2 p-5">
          <img
            className="h-full w-full rounded-lg shadow-xl shadow-blue-gray-900/50"
            src={"https://localhost:7104/resources/" + selproduct.image}
            alt="nature image"
          />
        </div>
        <div className="max-w-xl gap-y-2 mx-auto flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-2">{selproduct.name}</h1>
          <h4 className="text-gray-700 mb-4">
            Açıklama: {selproduct.description}
          </h4>
          <h4 className="text-gray-700 mb-4">Marka: {selproduct.brand}</h4>

          <Chip color="blue" value="Renk" />
        </div>
      </div>
      <div className="max-w-xl gap-y-5 mx-auto flex flex-col items-center">
        <Input labelRight="TL" label="Number" type="number" />
        <Button ripple={true}>Teklif Ver</Button>
      </div>
    </div>
  );
};

export default Product;
