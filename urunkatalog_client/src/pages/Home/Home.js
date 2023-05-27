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
import CategoryProducts from "./CategoryProducts";

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryID, setcategoryID] = useState(null);
  const [loading, setLoading] = useState(false);
  const authHeader = useAuthHeader();
  const config = {
    headers: {
      Accept: "text/plain",
      "Content-Type": "application/json",
      Authorization: `${authHeader()}`,
    },
  };

  // TÜM KATEGORİLERİ LİSTELEME
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7104/api/Category",
          config
        );
        setCategories(response.data.result);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [categories]);

  // ÜRÜNLERİ LİSTELE
  useEffect(() => {
    const fetchData = () => {
      setLoading(true);
      axios
        .get("https://localhost:7104/api/Product", config)
        .then((response) => {
          setProducts(response.data.result);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    };
    fetchData();
  }, []);

  if (loading) {
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
        <Grid.Container gap={2}>
          <Grid>
            <Button
              color="primary"
              auto
              ghost
              style={{ zIndex: 1 }}
              onPress={() => {
                setcategoryID(null);
              }}
            >
              Hepsi
            </Button>
          </Grid>
          {categories.map((category) => (
            <Grid>
              <Button
                color="secondary"
                auto
                style={{ zIndex: 1 }}
                ghost
                onPress={() => {
                  setcategoryID(category.id);
                  console.log("Kategori ID: ", category.id);
                }}
              >
                {category.name}
              </Button>
            </Grid>
          ))}
        </Grid.Container>
        <Text h4 className="pt-12">
          Ürünler
        </Text>

        <div className="justify-between gap-4">
          <div className="text-2xl flex-col h-screen flex items-center">
            {categoryID != null ? (
              <CategoryProducts categoryId={categoryID} />
            ) : (
             
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
                        <CardHeader
                          shadow={false}
                          floated={false}
                          className="h-70"
                        >
                          <img
                            src={
                              "https://localhost:7104/resources/" +
                              product.image
                            }
                            alt={product.name}
                            className="w-full object-cover"
                          />
                        </CardHeader>
                        <CardBody>
                          <div className="flex items-center justify-between mb-2">
                            <Typography
                              color="blue-gray"
                              className="font-medium"
                            >
                              {product.name.length > 15
                                ? product.name.substring(0, 15) + "..."
                                : product.name}
                            </Typography>
                            <Typography
                              color="blue-gray"
                              className="font-medium"
                            >
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
                          <Typography
                            variant="medium"
                           
                            className="pt-3 font-normal opacity-75"
                          >
                           Satıcı: {product.createdBy.length > 20
                              ? product.createdBy.substring(0, 20) + "..."
                              : product.createdBy}
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
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
