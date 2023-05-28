import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useAuthHeader, useAuthUser } from "react-auth-kit";
import { Button } from "@nextui-org/react";
import { Card, Grid, Row, Text } from "@nextui-org/react";
import { Link } from "react-router-dom";

import {
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import { Loading } from "@nextui-org/react";
import FormatPrice from "../../components/helper/FormatPrice";

function Profile() {
  const auth = useAuthUser();
  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const authHeader = useAuthHeader();
  const config = {
    headers: {
      Accept: "text/plain",
      "Content-Type": "application/json",
      Authorization: `${authHeader()}`,
    },
  };
  // ÜRÜNLERİ LİSTELE
  // ÜRÜNLERİ LİSTELE
  useEffect(() => {
    const fetchData = () => {
      setLoading(true);
      axios
        .get("https://localhost:7104/api/Product", config)
        .then((response) => {
          const filteredProducts = response.data.result.filter(
            (product) => product.modifiedBy === auth().username
          );
          setProducts(filteredProducts);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    };
    fetchData();
  }, []);
  if (isLoading) {
    return (
      <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center">
        <Loading type="spinner" size="lg" />
      </div>
    );
  }
  return (
    <div className="relative w-full">
      {/* <ComplexNavbar /> */}
      <div className="mx-auto w-full max-w-7xl px-8 pb-20">
        <Text h3 className="pt-12 flex flex-col items-center ">
          Ürünlerim
        </Text>

        <div className="justify-between gap-4">
          <div className="text-2xl flex flex-col items-center justify-center">
            <Grid.Container gap={3}>
              {products.map((product, index) => (
                <Grid
                  xs={12}
                  sm={4}
                  lg={3}
                  key={index}
                  className="justify-center items-center"
                >
                  <Link
                    to={{
                      pathname: `/product/${product.id}`,
                    }}
                  >
                    <Card className="w-96">
                      <Card.Header
                        shadow={false}
                        floated={false}
                        className="h-70"
                      >
                        <img
                          src={
                            "https://localhost:7104/resources/" + product.image
                          }
                          alt={product.name}
                          className="w-full object-cover"
                        />
                      </Card.Header>
                      <Card.Body>
                        <div className="flex items-center justify-between mb-2">
                          <Typography color="blue-gray" className="font-medium">
                            {product.name.length > 15
                              ? product.name.substring(0, 15) + "..."
                              : product.name}
                          </Typography>
                          <Typography color="blue-gray" className="font-medium">
                            {<FormatPrice price={product.price} />}
                          </Typography>
                        </div>
                        <Typography
                          variant="small"
                          color="gray"
                          className="font-normal opacity-75"
                        >
                          {product.description.length > 20
                            ? product.description.substring(0, 35) + "..."
                            : product.description}
                        </Typography>
                      </Card.Body>
                      <Card.Footer className="pt-0 flex flex-col items-center justify-center">
                        <Button
                          ripple={false}
                          className="bg-blue-gray-900/10 text-blue-gray-900 shadow-none hover:shadow-none hover:scale-105 focus:shadow-none focus:scale-105 active:scale-100"
                        >
                          Detayları Görüntüle
                        </Button>
                      </Card.Footer>
                    </Card>
                  </Link>
                </Grid>
              ))}
            </Grid.Container>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
