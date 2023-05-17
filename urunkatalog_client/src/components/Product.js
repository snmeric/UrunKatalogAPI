import React, { useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
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
import { Loading } from "@nextui-org/react";
import { useFormik } from "formik";
import toast, { Toaster } from "react-hot-toast";
import { Breadcrumbs } from "@material-tailwind/react";
import ComplexNavbar from "./navbar/ComplexNavbar";

const Product = () => {
  const { id } = useParams();

  const prodId = parseInt(id);
  const [product, setProduct] = useState([]);
  const [selproduct, setSelProduct] = useState([]);
  const [buyproduct, setBuyProduct] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loading, setloading] = useState(false);
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }
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
      setloading(true);

      await axios
        .get(`https://localhost:7104/api/Product`, config)
        .then((response) => setProduct(response.data.result))
        .catch((error) => console.log(error));

      console.log("Responsee", product);
    };

    getProduct();
    setloading(false);
  }, []);

  useEffect(() => {
    setloading(true);
    async function fetchData() {
      if (product.length > 0) {
        const filteredProduct = product.find((p) => p.id === parseInt(id));
        setSelProduct(filteredProduct);
      }
    }

    fetchData();
    setloading(false);
  }, [product, id]);

  /* TEKLİF GÖNDER */
  const onSubmit = async (values) => {
    setloading(true);
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
        openModal();
        toast("Teklif Başarılı.", { icon: "👌" });
      })
      .catch((error) => {
        const errorMessage = error.response.data;
        toast.error(`${errorMessage}`);
        console.error(error);
      });
    setloading(false);
  };

  /* SATIN AL */

  function handleBuyButtonClick() {
    axios
      .put(`https://localhost:7104/api/Product/${id}`, config)
      .then((response) => {
        setBuyProduct(response.data.result);
        console.log("Responsee:", product);
      })
      .catch((error) => console.log(error));
  }
  // useEffect(() => {
  //   setloading(true);
  //   const buyProduct = async () => {
  //     await axios
  //       .put(`https://localhost:7104/api/Product/${id}`, config)
  //       .then((response) => {
  //         setBuyProduct(response.data.result);
  //       })
  //       .catch((error) => console.log(error));

  //     console.log("Responsee", product);
  //   };
  //   setloading(false);
  //   buyProduct();
  // });

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
    if (
      selproduct.isOfferable &&
      (isOffer || !formik.values.isOfferPercentage)
    ) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
    return {
      text: isOffer ? "Doğru" : "Yüzdeyi doğru giriniz",

      color: isOffer ? "success" : "error",
    };
  }, [formik.values.offeredPrice, formik.values.isOfferPercentage]);
  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center">
        <Loading type="spinner" size="lg" />
      </div>
    );
  }
  return (
    <div>
      <ComplexNavbar />
      <div className="flex justify-center p-2">
        <Breadcrumbs className="mx-auto ">
          <a href="/" className="opacity-60">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </a>
          
          <a href="#">{selproduct.name}</a>
        </Breadcrumbs>
      </div>
      <div className="flex flex-row justify-center items-center p-8">
        <div className="max-w-xl mx-auto md:block w-1/2 p-5">
          <img
            className="h-full w-full rounded-lg shadow-md shadow-blue-gray-200"
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
          <h4 className="text-gray-900 mb-4">Fiyat: {selproduct.price} TL</h4>

          <Button disabled={!selproduct.isOfferable} ripple={true}>
            Satın Al
          </Button>
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

            {isOpen ? (
              <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                  </Transition.Child>

                  <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                      <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                      >
                        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                          <Dialog.Title
                            as="h3"
                            className="text-xl font-medium leading-6 text-gray-900"
                          >
                            Teklif Başarılı
                          </Dialog.Title>
                          <div className="mt-2">
                            <img
                              className=" w-40 rounded-lg mx-auto p-3"
                              src={
                                "https://localhost:7104/resources/" +
                                selproduct.image
                              }
                              alt="nature image"
                            />
                            <p className="text-md text-gray-700">
                              Başarılı bir şekilde ürüne teklif verdiniz.
                            </p>
                            <br />
                            <p className="text-lg text-gray-700">
                              Ürün Adı: {selproduct.name}
                            </p>
                            <p className="text-lg text-gray-700">
                              Verilen Teklif:{" "}
                              {!formik.values.isOfferPercentage
                                ? formik.values.offeredPrice
                                : (
                                    selproduct.price -
                                    (selproduct.price *
                                      formik.values.offeredPrice) /
                                      100
                                  )
                                    .toString()
                                    .slice(0, 6)}{" "}
                              TL
                            </p>

                            <br />
                          </div>

                          <div className="mt-4 text-right">
                            <button
                              type="button"
                              className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                              onClick={closeModal}
                            >
                              Anladım
                            </button>
                          </div>
                        </Dialog.Panel>
                      </Transition.Child>
                    </div>
                  </div>
                </Dialog>
              </Transition>
            ) : null}
            <br />
            <div className="w-max gap-7 flex flex-col items-center">
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
                content={!selproduct.isOfferable ? "Ürün Teklife Kapalı" : ""}
                trigger="hover"
                color={selproduct.isOfferable ? "primary" : "error"}
              >
                <Button type="submit" disabled={isButtonDisabled} ripple={true}>
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
