import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { Text } from "@nextui-org/react";
import { useAuthHeader } from "react-auth-kit";
import { Badge, Grid, Card, Input, Button, Spacer } from "@nextui-org/react";
import { Select, Option } from "@material-tailwind/react";
import { useFormik } from "formik";
import toast, { Toaster } from "react-hot-toast";

function Category() {
  const [categories, setCategories] = useState([]);
  const [loading, setloading] = useState(false);
  const authHeader = useAuthHeader();
  const config = {
    headers: {
      Accept: "text/plain",
      "Content-Type": "application/json",
      Authorization: `${authHeader()}`,
    },
  };
  const onSubmit = async (values) => {
    setloading(true);
    const data = {
      name: values.Name,
    };

    console.log("Values: ", values);

    try {
      const url = "https://localhost:7104/api/Category";

      const response = await axios.post(url, data, config);
      console.log(response.data);

      toast("Kategori Oluşturuldu.", { icon: "👌" });
    } catch (error) {
      const errorMessage = error.response.data;
      toast.error(`${errorMessage}`);
      console.error(error);
    } finally {
      setloading(false);
    }
  };
  const putonSubmit = async (values) => {
    setloading(true);
    const data = {
      name: values.name,
      id: values.id,
    };

    console.log("Values: ", values);

    try {
      const url = "https://localhost:7104/api/Category";

      const response = await axios.put(url, data, config);
      console.log(response.data);

      toast("Kategori adı değiştirildi.", { icon: "👌" });
    } catch (error) {
      const errorMessage = error.response.data;
      toast.error(`${errorMessage}`);
      console.error(error);
    } finally {
      setloading(false);
    }
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
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    onSubmit,
  });
  const putformik = useFormik({
    initialValues: {
      name: "",
      id: null,
    },
    putonSubmit,
  });

  return (
    <div className="h-screen max-w-lg p-20 gap-10 flex flex-col items-center mx-auto">
      <Card className="flex flex-col items-center" variant="bordered">
        <Card.Body className="gap-4">
          <Text h1 size={30} weight="bold">
            Kategoriler
          </Text>
          <Badge enableShadow disableOutline color="primary">
            {categories.map((category) => category.name)}
          </Badge>
        </Card.Body>
      </Card>
      <form onSubmit={formik.handleSubmit}>
        <Card className="flex flex-col items-center " variant="bordered">
          <Card.Body className="gap-4">
            <Text h1 size={30} weight="bold">
              Kategori Oluştur
            </Text>
            <Input
              name="name"
              onChange={formik.handleChange}
              value={formik.values.name}
              size="lg"
              placeholder="Kategori Adı"
              color="primary"
            />
            <Button type="submit" flat color="primary" auto>
              Oluştur
            </Button>
          </Card.Body>
        </Card>
      </form>
      <form onSubmit={putformik.handleSubmit}>
        <Card className="flex flex-col items-center " variant="bordered">
          <Card.Body className="gap-4">
            <Text h1 size={30} weight="bold">
              Kategori Adını Değiştir
            </Text>
            <Input
              name="name"
              size="lg"
              placeholder="Kategori Adı"
              color="primary"
            />
            <Select
              name="id"
              onChange={(value) => putformik.setFieldValue("id", value)}
              variant="outlined"
              label="Kategori"
            >
              {categories.map((category) => (
                <Option key={category.id} value={`${category.id}`}>
                  a
                </Option>
              ))}
            </Select>
            <Spacer y={3} />
            <Button type="submit" flat color="primary" auto>
              Oluştur
            </Button>
          </Card.Body>
        </Card>
      </form>
      <Toaster />
    </div>
  );
}

export default Category;
