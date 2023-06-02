import React from "react";
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
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthHeader } from "react-auth-kit";
import FormatPrice from "../../components/helper/FormatPrice";

const CategoryProducts = ({ categoryId }) => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const authHeader = useAuthHeader();
  const config = {
    headers: {
      Accept: "*/*, application/json, text/plain",
      Authorization: `${authHeader()}`,
    },
  };

  useEffect(() => {
    setLoading(true);

    const fetchCategoryProducts = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7104/api/Product/category/${categoryId}`,
          config
        );
        setProducts(response.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setProducts([]);
        } else {
          console.log(error);
        }
      }
      setLoading(false);
    };

    fetchCategoryProducts();
  }, [categoryId]);

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center">
        <Loading type="spinner" size="lg" />
      </div>
    );
  }
  if (products.length === 0) {
    return (
      <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center">
        <Text h4>Bu kategoride bir ürün bulunmamakta.</Text>
      </div>
    );
  }

  return (
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
                    {<FormatPrice price={product.price} />}
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
  );
};

export default CategoryProducts;
