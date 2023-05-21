import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { Text } from "@nextui-org/react";
import { useAuthHeader } from "react-auth-kit";
import { Badge, Grid, Card, Spacer } from "@nextui-org/react";
import { Select, Option } from "@material-tailwind/react";
import { useFormik } from "formik";
import toast, { Toaster } from "react-hot-toast";
import { Input, Button } from "@material-tailwind/react";
import ComplexNavbar from "./navbar/ComplexNavbar";

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

  // KATEGORİ OLUŞTURMA
  const onSubmit = async (values) => {
    setloading(true);

    const data = {
      name: values.name,
    };

    console.log("Values: ", values);

    try {
      const response = await axios.post(
        "https://localhost:7104/api/Category",
        data,
        config
      );
      console.log(response.data.result);
      toast("Kategori Oluşturuldu.", { icon: "👌" });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      const errorMessage = error.response.data;
      toast.error(`${errorMessage}`);
      console.error(error);
    } finally {
      setloading(false);
    }
  };

  // KATEGORİ ADI DEĞİŞTİRME
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
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      const errorMessage = error.response.data;
      toast.error(`${errorMessage}`);
      console.error(error);
    } finally {
      setloading(false);
    }
  };

  const deleteonSubmit = async (values) => {
    setloading(true);
    const data = {
      id: values.id,
    };

    console.log("Values: ", values);

    try {
      const response = await axios.put(
        `https://localhost:7104/api/Category/${values.id}`,
        data,
        config
      );
      console.log(response.data);
      toast("Kategori adı değiştirildi.", { icon: "👌" });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
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
    onSubmit: putonSubmit,
  });
  const deleteformik = useFormik({
    initialValues: {
      id: null,
    },
    onSubmit: deleteonSubmit,
  });

  return (
    <div className="h-screen gap-10 flex flex-col items-center mx-auto">
      <ComplexNavbar />
      <div className="flex flex-row gap-5">
        <Card className="flex flex-col items-center" variant="bordered">
          <Card.Body className="gap-4">
            <Text h1 size={20} weight="bold">
              Kategoriler
            </Text>
            {categories.map((category) => (
              <Badge enableShadow disableOutline color="primary">
                {category.name}
              </Badge>
            ))}
          </Card.Body>
        </Card>

        <form onSubmit={formik.handleSubmit} className=" ">
          <Card className="flex flex-col items-center " variant="bordered">
            <Card.Body className="gap-4">
              <Text h1 size={20} weight="bold">
                Kategori Oluştur
              </Text>
              <Input
                name="name"
                onChange={formik.handleChange}
                value={formik.values.name}
                size="md"
                label="Kategori Adı"
              />
              <Button type="submit" variant="gradient" auto>
                Oluştur
              </Button>
            </Card.Body>
          </Card>
        </form>
      </div>
      <form
        onSubmit={putformik.handleSubmit}
        className="max-w-xl flex flex-col items-center  gap-5"
      >
        <Text h1 size={20} weight="bold">
          Kategori Adını Değiştir
        </Text>
        <Input
          id="name"
          name="name"
          onChange={putformik.handleChange}
          value={putformik.values.name}
          size="md"
          label="Kategori Adı"
        />
        <Select
          name="id"
          onChange={(value) => putformik.setFieldValue("id", value)}
          variant="outlined"
          label="Kategori"
        >
          {categories.map((category) => (
            <Option value={`${category.id}`}>{category.name}</Option>
          ))}
        </Select>

        <Button type="submit" variant="outlined" auto>
          Değiştir
        </Button>
      </form>
      <form
        onSubmit={deleteformik.handleSubmit}
        className="max-w-xl flex flex-col items-center gap-5 p-10"
      >
        <Text h1 size={20} weight="bold">
          Kategori Sil
        </Text>

        <Select
          name="id"
          onChange={(value) => deleteformik.setFieldValue("id", value)}
          variant="outlined"
          label="Kategori"
        >
          {categories.map((category) => (
            <Option value={`${category.id}`}>{category.name}</Option>
          ))}
        </Select>

        <Button type="submit" color="red" auto>
          Sil
        </Button>
      </form>
      <Toaster />
    </div>
  );
}

export default Category;
