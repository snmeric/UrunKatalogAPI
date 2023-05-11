import React, { useEffect, useState } from "react";
import {
  useInput,
  Card,
  Col,
  Row,
  Button,
  Text,
  Popover,
  Input,
  Tooltip,
  Grid,
} from "@nextui-org/react";
import * as yup from "yup";
import { useAuthHeader } from "react-auth-kit";
import { useParams } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { Chip, Checkbox, Typography, Radio } from "@material-tailwind/react";

import { useFormik } from "formik";
import toast, { Toaster } from "react-hot-toast";
import { PopoverDetail } from "./PopoverDetail";
import { Slider } from "@mui/material";
import ComplexNavbar from "./navbar/ComplexNavbar";

const Product = () => {
  const { id } = useParams();

  const prodId = parseInt(id);
  const [product, setProduct] = useState([]);
  const [selproduct, setSelProduct] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const { value, reset, bindings } = useInput("");
  const [error, setError] = useState("");
  const authHeader = useAuthHeader();
  const formData = new FormData();

  const config = {
    headers: {
      Accept: "*/*, application/json, text/plain",
      Authorization: `${authHeader()}`,
    },
  };

  /* ÜRÜN DETAY */
  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      await axios
        .get(`https://localhost:7104/api/Product`, config)
        .then((response) => setProduct(response.data.result))
        .catch((error) => console.log(error));

      setLoading(false);

      selproduct.isOfferable
        ? setIsButtonDisabled(false)
        : setIsButtonDisabled(true);

      console.log("Responsee", product);
    };

    getProduct();
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (product.length > 0) {
        const filteredProduct = product.find((p) => p.id === parseInt(id));
        setSelProduct(filteredProduct);
      }
    }

    fetchData();
  }, [product, id]);

  /* TEKLİF GÖNDER */
  const onSubmit = async (values) => {
    const data = {
      productId: values.productId,
      isOfferPercentage: values.isOfferPercentage,
      offeredPrice: values.offeredPrice,
    };

    console.log("Values: ", values);
    setError("");
    console.log("TOKEEN:", authHeader());
    axios
      .post("https://localhost:7104/Offer", data, {
        headers: {
          Authorization: `${authHeader()}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data);

        toast("Teklif Başarılı.", { icon: "👌" });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  //   try {
  //      const response =await axios.post(
  //       `https://localhost:7104/Offers`,
  //       data,{
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `${authHeader()}`,
  //         },
  //       }

  //     );
  //     console.log(response);
  //     toast("Teklif Başarılı.", { icon: "👏" });
  //     // setTimeout(() => {
  //     //   window.location.reload();
  //     // }, 2000);
  //   } catch (err) {
  //     if (err && err instanceof AxiosError)
  //       setError(err.response?.data.message);
  //     else if (err && err instanceof Error) setError(err.message);
  //     toast.error(`Hata: ${err}`);
  //     console.log("Error: ", err);
  //   }
  // };
  const formik = useFormik({
    initialValues: {
      productId: prodId,
      isOfferPercentage: true,
      offeredPrice: 0,
    },
    onSubmit,
  });

  const validateOffer = (value, isPercentage) => {
    const numValue = Number(value);
    if (isPercentage) {
      return numValue >= 0 && numValue <= 99;
    } else {
      return numValue.length <= 3;
    }
  };
  const helperisOffer = React.useMemo(() => {
    if (!formik.values.offeredPrice)
      return {
        text: "",
        color: "",
      };
    const isOffer = validateOffer(
      formik.values.offeredPrice,
      formik.values.isOfferPercentage
    );
    return {
      text: isOffer ? "Doğru" : "Yüzdeyi doğru giriniz",

      color: isOffer ? "success" : "error",
    };
  }, [formik.values.offeredPrice, formik.values.isOfferPercentage]);

  return (
    <div>
      <ComplexNavbar />
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
          <Tooltip
            content={
              !selproduct.isOfferable
                ? "Teklif Kapanmıştır."
                : "Teklif Edilebilir."
            }
            trigger="hover"
            color={selproduct.isOfferable ? "success" : "error"}
          >
            <Button
              auto
              flat
              color={selproduct.isOfferable ? "success" : "error"}
            >
              Teklif {selproduct.isOfferable ? "Açık" : "Kapalı"}
            </Button>
          </Tooltip>
          <Tooltip
            content={
              !selproduct.isOfferable ? "Ürün Satılmıştır" : "Ürün Mevcuttur."
            }
            trigger="hover"
            color={selproduct.isOfferable ? "success" : "error"}
          >
            <Button
              auto
              flat
              color={selproduct.isOfferable ? "success" : "error"}
            >
              Ürün {selproduct.isSold ? "Satıldı" : "Mevcut"}
            </Button>
          </Tooltip>
          <Chip color="blue" value="Renk" />
        </div>
      </div>
      <div className="max-w-xl mx-auto flex flex-col items-center p-5">
        <form onSubmit={formik.handleSubmit}>
          <div className="flex flex-row mx-auto items-center gap-5">
            <div className="flex flex-col gap-3 ">
              <Radio
                type="radio"
                value="true"
                name="isOfferPercentage"
                checked={formik.values.isOfferPercentage === true}
                onChange={() => formik.setFieldValue("isOfferPercentage", true)}
                onBlur={formik.handleBlur}
                label="Yüzdesini vererek teklif vereceğim."
                ripple={true}
              />
              <Radio
                type="radio"
                value="false"
                name="isOfferPercentage"
                checked={formik.values.isOfferPercentage === false}
                onChange={() =>
                  formik.setFieldValue("isOfferPercentage", false)
                }
                onBlur={formik.handleBlur}
                label="Yüzdelik olmadan direk fiyat teklifi vereceğim."
                ripple={false}
              />
            </div>

            <br />
            <div className="w-max gap-3 flex flex-col items-center">
              <Input
                status={
                  formik.values.isOfferPercentage ? helperisOffer.color : ""
                }
                color={
                  formik.values.isOfferPercentage ? helperisOffer.color : ""
                }
                helperColor={
                  formik.values.isOfferPercentage ? helperisOffer.color : ""
                }
                helperText={
                  formik.values.isOfferPercentage ? helperisOffer.text : ""
                }
                labelRight={!formik.values.isOfferPercentage ? "TL" : "%"}
                label="Teklif Fiyatı"
                value={formik.values.offeredPrice}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="offeredPrice"
                type="number"
              />
             
             
                <Tooltip
                  content={
                    !selproduct.isOfferable
                      ? "Ürün Teklife Kapalı"
                      : "Ürün Teklif Edilebilir"
                  }
                  trigger="hover"
                  color={selproduct.isOfferable ? "primary" : "error"}
                >
                  <Button
                    type="submit"
                    disabled={!selproduct.isOfferable}
                    ripple={true}
                  >
                    Teklif Ver
                  </Button>
                </Tooltip>
             
            </div>
          </div>
          <Toaster />
        </form>
      </div>
    </div>
  );
};

export default Product;
