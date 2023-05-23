import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useAuthHeader } from "react-auth-kit";
import { Badge, Grid, Card, Spacer } from "@nextui-org/react";
import {
  Table,
  Row,
  Col,
  Modal,
  Tooltip,
  User,
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
import ComplexNavbar from "../../components/Navbar";

function Brand() {
  const [brandies, setBrandies] = useState([]);
  const [editBrand, seteditBrand] = useState(null);
  const [loading, setloading] = useState(false);
  const [visible, setVisible] = React.useState(false);
  const handler = (brandId) => {
    seteditBrand(brandId);
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

  // MARKA OLUŞTURMA
  const onSubmit = async (values) => {
    setloading(true);

    const data = {
      name: values.name,
    };

    try {
      const response = await axios.post(
        "https://localhost:7104/api/Brand",
        data,
        config
      );

      toast("Marka Oluşturuldu.", { icon: "👌" });
    } catch (error) {
      const errorMessage = error.response.data;
      toast.error(`${errorMessage}`);
      console.error(error);
    } finally {
      setloading(false);
    }
  };

  // MARKA ADI DEĞİŞTİRME
  const putonSubmit = async (values) => {
    setloading(true);
    const data = {
      name: values.name,
      id: editBrand,
    };

    try {
      const url = "https://localhost:7104/api/Brand";

      const response = await axios.put(url, data, config);

      toast("Marka adı değiştirildi.", { icon: "👌" });
    } catch (error) {
      const errorMessage = error.response.data;
      toast.error(`${errorMessage}`);
      console.error(error);
    } finally {
      setloading(false);
    }
  };

  //MARKA SİLME
  const deleteonSubmit = async (deletebrandID) => {
    setloading(true);

    try {
      const response = await axios.delete(
        `https://localhost:7104/api/Brand/${deletebrandID}`,

        config
      );
      console.log(response.data);
      toast("Marka Silindi.", { icon: "👌" });
    } catch (error) {
      const errorMessage = error.response.data;
      toast.error(`${errorMessage}`);
      console.error(error);
    } finally {
      setloading(false);
    }
  };

  // TÜM MARKALARI LİSTELEME
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7104/api/Brand",
          config
        );
        setBrandies(response.data.result);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [brandies]);

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
    { name: "MARKA", uid: "name" },

    { name: "ACTIONS", uid: "actions" },
  ];
  const users = brandies;

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
  return (
    <div className="h-screen gap-10 flex flex-col items-center mx-auto">
      {/* <ComplexNavbar /> */}
      
        <form onSubmit={formik.handleSubmit} className="w-96 ">
          <Card
            className="flex flex-col items-center shadow-sm "
            variant="bordered"
          >
            <Card.Body className="gap-4">
              <Text h1 size={20} weight="bold">
                Marka Oluştur
              </Text>
              <Input
                name="name"
                onChange={formik.handleChange}
                value={formik.values.name}
                size="md"
                label="Marka Adı"
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
              Marka Adını Değiştirin
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
                label="Marka Adı"
              />
              {/* <Select
                name="id"
                options={brandies.map((category) => ({
                  value: category,
                  label: category.name,
                }))}
                onChange={(value) => putformik.setFieldValue("id", value)}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  control: (base) => ({ ...base, width: "300px" }),
                }}
                menuPortalTarget={document.body}
              /> */}
              {/* <Select
              name="id"
              onChange={(value) => putformik.setFieldValue("id", value)}
              variant="outlined"
              label="Kategori"
              className="flex items-center gap-2"
            >
              {brandies.map((category) => (
                <Option value={`${category.id}`}>
                  {category.name}
                </Option>
              ))}
            </Select> */}
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

      <Toaster />
    </div>
  );
}

export default Brand;
