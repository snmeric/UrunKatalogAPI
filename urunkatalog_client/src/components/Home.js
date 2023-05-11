import { Button } from "@nextui-org/react";
import React from "react";
import { Card, Grid, Row, Text } from "@nextui-org/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthHeader } from "react-auth-kit";
import ComplexNavbar from "./navbar/ComplexNavbar";
import { Link } from "react-router-dom";

import {
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Chip,
  Avatar,
} from "@material-tailwind/react";

function Home() {
  const [products, setProducts] = useState([]);
  const authHeader = useAuthHeader();
  const config = {
    headers: {
      Accept: "text/plain",
      "Content-Type": "application/json",
      Authorization: `${authHeader()}`,
    },
  };

  useEffect(() => {
    axios
      .get("https://localhost:7104/api/Product", config)
      .then((response) => {
        setProducts(response.data.result);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="flex-col justify-center items-center">
      <ComplexNavbar />
      <div
        className="text-2xl mx-9 flex-col h-screen 
            flex items-center w-540"
      >
        <Grid.Container gap={3}>
          {products.map((product, index) => (
            <Grid
              xs={12}
              sm={4}
              lg={2}
              key={index}
              className="justify-center items-center"
            >
              <Link
                to={{
                  pathname: `/product/${product.id}`,
                }}
              >
                <Card className="w-96">
                  <CardHeader shadow={false} floated={false} className="h-70">
                    <img
                      src={"https://localhost:7104/resources/" + product.image}
                      alt={product.name}
                      className="w-full object-cover"
                    />
                  </CardHeader>
                  <CardBody>
                    <div className="flex items-center justify-between mb-2">
                      <Typography color="blue-gray" className="font-medium">
                      {product.name.length > 15
                        ? product.name.substring(0, 15) + "..."
                        : product.name}
                      </Typography>
                      <Typography color="blue-gray" className="font-medium">
                        {product.price} TL
                      </Typography>
                    </div>
                    <Typography
                      variant="small"
                      color="gray"
                      className="font-normal opacity-75"
                    >
                      {product.description.length > 20
                        ? product.description.substring(0, 20) + "..."
                        : product.description}
                    </Typography>
                  </CardBody>
                  <CardFooter className="pt-0 m-auto">
                    <Button
                      ripple={false}
                      className="bg-blue-gray-900/10 text-blue-gray-900 shadow-none hover:shadow-none hover:scale-105 focus:shadow-none focus:scale-105 active:scale-100"
                    >
                      Detayları Görüntüle
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid.Container>
      </div>
    </div>
  );
}

export default Home;
