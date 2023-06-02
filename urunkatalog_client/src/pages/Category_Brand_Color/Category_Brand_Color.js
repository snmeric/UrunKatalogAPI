import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useAuthHeader } from "react-auth-kit";
import { Grid, Card, Loading } from "@nextui-org/react";
import {
  Table,
  Row,
  Col,
  Modal,
  Tooltip,
  Button,
  Text,
} from "@nextui-org/react";
import { StyledBadge } from "../../components/TableComponents/StyledBadge";
import { IconButton } from "../../components/TableComponents/IconButton";
import { EditIcon } from "../../components/TableComponents/EditIcon";
import { DeleteIcon } from "../../components/TableComponents/DeleteIcon";
import { useFormik } from "formik";
import toast, { Toaster } from "react-hot-toast";
import { Input } from "@material-tailwind/react";
import Brand from "./Brand";
import Color from "./Color";

function Category() {
  const [categories, setCategories] = useState([]);
  const [editCategory, seteditCategory] = useState(null);
  const [loading, setloading] = useState(false);
  const [visible, setVisible] = React.useState(false);
  const handler = (categoryId) => {
    seteditCategory(categoryId);
    setVisible(true);
  };
  const closeHandler = () => {
    setVisible(false);
  };
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

    try {
      const response = await axios.post(
        "https://localhost:7104/api/Category",
        data,
        config
      );

      toast("Kategori Oluşturuldu.", { icon: "👌" });
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
      id: editCategory,
    };

    try {
      const url = "https://localhost:7104/api/Category";

      const response = await axios.put(url, data, config);

      toast("Kategori adı değiştirildi.", { icon: "👌" });
    } catch (error) {
      const errorMessage = error.response.data;
      toast.error(`${errorMessage}`);
      console.error(error);
    } finally {
      setloading(false);
    }
  };

  //KATEGORİ SİLME
  const deleteonSubmit = async (deletecategoryID) => {
    setloading(true);

    try {
      const response = await axios.delete(
        `https://localhost:7104/api/Category/${deletecategoryID}`,

        config
      );
      
      toast("Kategori Silindi.", { icon: "👌" });
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
  }, [categories]);

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    onSubmit,
  });
  const putformik = useFormik({
    initialValues: {
      name: "",
    },
    onSubmit: putonSubmit,
  });

  const columns = [
    { name: "KATEGORİ", uid: "name" },

    { name: "ACTIONS", uid: "actions" },
  ];
  const users = categories;

  const renderCell = (category, columnKey) => {
    const cellValue = category[columnKey];
    switch (columnKey) {
      case "name":
        return (
          <>
            <StyledBadge>{category.name}</StyledBadge>
          </>
        );

      case "actions":
        return (
          <Row justify="center" align="center">
            <Col css={{ d: "flex" }}>
              <Tooltip content="Düzenle">
                <IconButton onClick={() => handler(category.id)}>
                  <EditIcon size={20} fill="#979797" />
                </IconButton>
              </Tooltip>
            </Col>
            <Col css={{ d: "flex" }}>
              <Tooltip
                content="Sil"
                color="error"
                onClick={() => deleteonSubmit(category.id)}
              >
                <IconButton>
                  <DeleteIcon size={20} fill="#FF0080" />
                </IconButton>
              </Tooltip>
            </Col>
          </Row>
        );
      default:
        return cellValue;
    }
  };
  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center">
        <Loading type="spinner" size="lg" />
      </div>
    );
  }
  return (
    <div>
      <Grid.Container gap={10} justify="center">
        <Grid xs={12} sm={12} lg={3}>
          <div className="flex flex-col gap-5">
            <form onSubmit={formik.handleSubmit} className="w-96 ">
              <Card
                className="flex flex-col items-center shadow-sm "
                variant="bordered"
              >
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
                  <Button type="submit" auto color="success" shadow>
                    Oluştur
                  </Button>
                </Card.Body>
              </Card>
            </form>
            <div className="w-96">
              <Table
                aria-label="Example table with custom cells"
                css={{
                  height: "auto",
                  minWidth: "100%",
                }}
                selectionMode="none"
              >
                <Table.Header columns={columns}>
                  {(column) => (
                    <Table.Column
                      key={column.uid}
                      hideHeader={column.uid === "actions"}
                      align={column.uid === "actions" ? "center" : "start"}
                    >
                      {column.name}
                    </Table.Column>
                  )}
                </Table.Header>
                <Table.Body items={users}>
                  {(item) => (
                    <Table.Row>
                      {(columnKey) => (
                        <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>
                      )}
                    </Table.Row>
                  )}
                </Table.Body>
              </Table>
            </div>

            <div>
              <Modal
                closeButton
                blur
                aria-labelledby="modal-title"
                open={visible}
                onClose={closeHandler}
              >
                <Modal.Header>
                  <Text b size={18}>
                    Kategori Adını Değiştirin
                  </Text>
                </Modal.Header>
                <form onSubmit={putformik.handleSubmit}>
                  <Modal.Body className="flex h-4/6 flex-col justify-center items-center gap-5">
                    <Input
                      id="name"
                      name="name"
                      onChange={putformik.handleChange}
                      value={putformik.values.name}
                      size="md"
                      label="Kategori Adı"
                    />
                  </Modal.Body>
                  <Modal.Footer>
                    <Button auto flat color="error" onPress={closeHandler}>
                      Vazgeç
                    </Button>
                    <Button auto shadow type="submit" onPress={closeHandler}>
                      Değiştir
                    </Button>
                  </Modal.Footer>
                </form>
              </Modal>
            </div>
          </div>
          <Toaster />
        </Grid>
        <Grid xs={12} sm={12} lg={3}>
          <Brand />
        </Grid>
        <Grid xs={12} sm={12} lg={3}>
          <Color />
        </Grid>
      </Grid.Container>
    </div>
  );
}

export default Category;
