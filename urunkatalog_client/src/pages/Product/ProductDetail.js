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
import { Spacer } from "@nextui-org/react";
import * as yup from "yup";
import { useAuthHeader, useAuthUser } from "react-auth-kit";
import { useNavigate, useParams } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { Chip, Checkbox, Typography, Radio } from "@material-tailwind/react";
import { Loading } from "@nextui-org/react";
import { useFormik } from "formik";
import toast, { Toaster } from "react-hot-toast";
import { Breadcrumbs } from "@material-tailwind/react";
import FormatPrice from "../../components/helper/FormatPrice";
import {
  fetchBrands,
  fetchCategories,
  fetchColors,
  fetchProduct,
} from "../../components/service/api";
import { useProductHooks } from "../../hooks/hook";

const Product = () => {
  const { id } = useParams();
  const auth = useAuthUser();
  const prodId = parseInt(id);
  const {
    product,
    setProduct,
    categories,
    setCategories,
    brands,
    setBrands,
    colors,
    setColors,
    selProduct,
    setSelProduct,
    buyproduct,
    setBuyProduct,
    isButtonDisabled,
    setIsButtonDisabled,
    loading,
    setLoading,
    isOpen,
    setIsOpen,
    isBuyOpen,
    setBuyIsOpen,
  } = useProductHooks();

  function closeModal() {
    setIsOpen(false);
    navigate("/");
  }

  function openModal() {
    setIsOpen(true);
  }
  function closeBuyModal() {
    setBuyIsOpen(false);
    navigate("/");
  }
  function openBuyModal() {
    setBuyIsOpen(true);
  }
  const { value, reset, bindings } = useInput("");
  const [error, setError] = useState("");
  const [productDetail, setProductDetail] = useState([]);
  const authHeader = useAuthHeader();
  const formData = new FormData();
  const navigate = useNavigate();

  const config = {
    headers: {
      Accept: "*/*, application/json, text/plain",
      Authorization: `${authHeader()}`,
    },
  };
  /* ÜRÜN DETAY */
  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7104/api/Product/${id}`,
          {
            headers: {
              accept: "text/plain",
              Authorization: `${authHeader()}`, // Kendi Authorization tokeninizi ekleyin
            },
          }
        );
        setProductDetail(response.data.result);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };

    fetchData();
  }, [id]);

  // useEffect(() => {
  //   setLoading(true);
  //   const getProduct = async () => {
  //     const productData = await fetchProduct(config);
  //     setProduct(productData);

  //     console.log("Response", productData);
  //   };
  //   setLoading(false);
  //   getProduct();
  // }, []);

  // useEffect(() => {
  //   setLoading(true);

  //   const fetchData = async () => {
  //     if (product.length > 0) {
  //       const filteredProduct = product.find((p) => p.id === parseInt(id));
  //       setSelProduct(filteredProduct);
  //     }
  //   };

  //   fetchData();
  //   setLoading(false);
  // }, [product, id]);

  /* TEKLİF GÖNDER */
  const onSubmit = async (values) => {
    setLoading(true);
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
    setLoading(false);
  };

  //MARKA
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7104/api/Brand/${productDetail.brandId}`,
          config
        );

        setBrands(response.data.result.name);

        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    setLoading(false);
    fetchData();
  }, [productDetail.brandId]);

  //RENK
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7104/api/Color/${productDetail.colorId}`,
          config
        );

        setColors(response.data.result.name);

        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    setLoading(false);
    fetchData();
  }, [productDetail.colorId]);
  //KATEGORİ
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://localhost:7104/api/Category/${productDetail.categoryId}`,
          config
        );

        setCategories(response.data.result.name);

        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [productDetail.categoryId]);
  /* SATIN AL */

  function handleBuyButtonClick() {
    axios
      .get(`https://localhost:7104/api/Product/purchase/${id}`, config)
      .then((response) => {
        toast("Satın Alma Başarılı.", { icon: "👌" });
        openBuyModal();
        setBuyProduct(response.data.result);
        console.log("Responsee:", product);
      })
      .catch((error) => console.log(error));
  }

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
      productDetail.isOfferable &&
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

          <a href="#">{productDetail.name}</a>
        </Breadcrumbs>
      </div>

      <div className="flex flex-row justify-center items-center p-8">
        <div className="max-w-xl mx-auto md:block w-1/2 p-5">
          <img
            className="h-full w-full rounded-lg shadow-md shadow-blue-gray-200"
            src={"https://localhost:7104/resources/" + productDetail.image}
            alt="nature image"
          />
        </div>
        <div className="max-w-xl gap-y-2 mx-auto flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-2">{productDetail.name}</h1>
          <h4 className="text-gray-700 mb-4">
            Açıklama: {productDetail.description}
          </h4>
          <h4 className="text-gray-700 mb-4 mt-4">
            Satıcı: {productDetail.createdBy}
          </h4>
          <h4 className="text-gray-700 mb-4 mt-4">Kategori: {categories}</h4>
          <h4 className="text-gray-700 mb-4">Marka: {brands}</h4>

          <Tooltip
            content={
              productDetail.isOfferable
                ? "Teklif Edilebilir."
                : "Teklif Kapanmıştır."
            }
            trigger="hover"
            color={productDetail.isOfferable ? "success" : "error"}
          >
            <Button
              auto
              flat
              color={productDetail.isOfferable ? "success" : "error"}
            >
              Teklif {productDetail.isOfferable ? "Açık" : "Kapalı"}
            </Button>
          </Tooltip>
          <Tooltip
            content={
              productDetail.isSold ? "Ürün Satılmıştır" : "Ürün Mevcuttur."
            }
            trigger="hover"
            color={!productDetail.isSold ? "success" : "error"}
          >
            <Button
              auto
              flat
              color={!productDetail.isSold ? "success" : "error"}
            >
              Ürün {!productDetail.isSold ? "Mevcut" : "Satıldı"}
            </Button>
          </Tooltip>
          <h4 className="text-gray-700 mb-4 mt-4">Renk: {colors}</h4>

          <h2 className="text-gray-900 mb-4">
            {<FormatPrice price={productDetail.price} />}
          </h2>
          <Tooltip
            content={
              !productDetail.isSold
                ? "Ürün satın alınabilir."
                : "Ürün Satılmıştır."
            }
            trigger="hover"
            color={!productDetail.isSold ? "success" : "error"}
          >
            <Button
              shadow
              color="success"
              disabled={
                productDetail.isSold ||
                productDetail.createdBy === auth().username
                  ? true
                  : false
              }
              ripple={true}
              onClick={handleBuyButtonClick}
            >
              Satın Al
            </Button>
          </Tooltip>
          <Text h5 color="error">
            {productDetail.createdBy === auth().username
              ? "Kendi ürününüzü satın alamazsınız"
              : ""}
          </Text>
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
                                productDetail.image
                              }
                              alt="nature image"
                            />
                            <p className="text-md text-gray-700">
                              Başarılı bir şekilde ürüne teklif verdiniz.
                            </p>
                            <br />
                            <p className="text-lg text-gray-700">
                              Ürün Adı: {productDetail.name}
                            </p>
                            {/* <p className="text-lg text-gray-700">
                              Verilen Teklif:{" "}
                              {
                                <FormatPrice
                                  price={
                                    !formik.values.isOfferPercentage
                                      ? formik.values.offeredPrice
                                      : productDetail
                                          .price(
                                            productDetail.price -
                                              (productDetail.price *
                                                formik.values.offeredPrice) /
                                                100
                                          )
                                          .toString()
                                          .slice(0, 6)
                                  }
                                />
                              }
                            </p> */}

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
            {isBuyOpen ? (
              <Transition appear show={isBuyOpen} as={Fragment}>
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
                            Satın Alım Başarılı
                          </Dialog.Title>
                          <div className="mt-2">
                            <img
                              className=" w-40 rounded-lg mx-auto p-3"
                              src={
                                "https://localhost:7104/resources/" +
                                productDetail.image
                              }
                              alt="nature image"
                            />
                            <p className="text-md text-gray-700">
                              Başarılı bir şekilde ürünü satın aldınız.
                            </p>
                            <br />
                            <p className="text-lg text-gray-700">
                              Ürün Adı: {productDetail.name}
                            </p>
                            {/* <p className="text-lg text-gray-700">
                              Alınan Fiyat:
                              {!formik.values.isOfferPercentage
                                ? formik.values.offeredPrice
                                : (
                                    productDetail.price -
                                    (productDetail.price *
                                      formik.values.offeredPrice) /
                                      100
                                  )
                                    .toString()
                                    .slice(0, 6)}{" "}
                              TL
                            </p> */}
                            <br />
                          </div>

                          <div className="mt-4 text-right">
                            <button
                              type="button"
                              className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                              onClick={closeBuyModal}
                            >
                              Tamam
                            </button>
                          </div>
                        </Dialog.Panel>
                      </Transition.Child>
                    </div>
                  </div>
                </Dialog>
              </Transition>
            ) : null}
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
                content={
                  !productDetail.isOfferable
                    ? "Ürün Teklife Kapalı"
                    : "Teklif Verebilirsiniz."
                }
                trigger="hover"
                color={productDetail.isOfferable ? "primary" : "error"}
              >
                <Button
                  type="submit"
                  disabled={
                    !productDetail.isOfferable ||
                    productDetail.createdBy === auth().username
                      ? true
                      : false
                  }
                  ripple={true}
                >
                  Teklif Ver
                </Button>
              </Tooltip>
              <Text h7 auto color="error">
        
        {productDetail.createdBy === auth().username
                    ? "Kendinize teklif veremezsiniz"
                    : ""}</Text>
            </div>
          </div>

          <Toaster />
        </form>
      </div>
      <Spacer y={5} />
    </div>
  );
};

export default Product;
