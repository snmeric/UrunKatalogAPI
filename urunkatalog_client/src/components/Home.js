import { Button } from "@nextui-org/react";
import React from "react";
import { useSignOut } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import { Card, Grid, Row, Text } from "@nextui-org/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthHeader } from "react-auth-kit";
import { Navbar, useTheme } from "@nextui-org/react";
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
  const authHeader = useAuthHeader();

  const [products, setProducts] = useState([]);
  const config = {
    headers: {
      Accept: "text/plain",
      "Content-Type": "application/json",
      Authorization: `${authHeader()}`,
    },
  };
  console.log(authHeader());
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
    <div className="pt-5">
      <ComplexNavbar />
      <div
        className="text-2xl flex-col h-screen 
            flex items-center w-540"
      >
        <Grid.Container gap={3} justify="flex-start">
          {products.map((product, index) => (
            <Grid xs={12} sm={4} lg={2} key={index}>
              <Link
                to={{
                  pathname: `/product/${product.id}`,
                  
                }}
              >
                <Card className="w-96">
                  <CardHeader color="blue" className="relative h-56">
                    <Card.Image
                      src={"https://localhost:7104/resources/" + product.image}
                      objectFit="cover"
                      height="100%"
                      alt={product.name}
                    />
                  </CardHeader>
                  <CardBody className="text-center">
                    <Typography variant="h5" className="mb-2">
                      {product.name}
                    </Typography>
                    <Typography>{product.description}</Typography>
                  </CardBody>
                  <CardFooter
                    divider
                    className="flex flex-col items-center justify-between py-3"
                  >
                    <Text weight="bold" size="$xl">
                      {product.price} TL
                    </Text>

                    <Typography
                      variant="small"
                      color="gray"
                      className="flex gap-1"
                    >
                      <i className="fas fa-map-marker-alt fa-sm mt-[3px]" />
                      <Chip
                        value={
                          <Typography
                            variant="small"
                            color="white"
                            className="font-medium capitalize leading-none"
                          >
                            Teklif {product.isOfferable ? "Açık" : "Kapalı"}
                          </Typography>
                        }
                        color={product.isOfferable ? "teal" : "pink"}
                        className="rounded-full py-1.5"
                      />
                      <Chip
                        value={
                          <Typography
                            variant="small"
                            color="white"
                            className="font-medium capitalize leading-none"
                          >
                            Ürün {product.isSold ? "Satıldı" : "Satılmadı"}
                          </Typography>
                        }
                        color={product.isOfferable ? "teal" : "pink"}
                        className="rounded-full py-1.5"
                      />
                    </Typography>
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

{
  /* <div>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Color</th>
                            <th>Brand</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <p>Name: {product.name}</p>
                                <p>Description: {product.description}</p>
                                <p>Color: {product.color}</p>
                                <p>Brand: {product.brand}</p>
                                <p>Product Condition: {product.productCondition}</p>
                                <img src={"https://localhost:7104/resources/" + product.image} alt={product.name} />
                                <p>User Name: {product.userName}</p>
                                <p>Price: {product.price}</p>
                                <p>Is Offerable: {product.isOfferable ? "Yes" : "No"}</p>
                                <p>Is Sold: {product.isSold ? "Yes" : "No"}</p>
                                <p>Category Id: {product.categoryId}</p>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div> */
}
