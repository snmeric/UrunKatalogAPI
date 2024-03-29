import React from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useEffect, useState, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useAuthHeader, useAuthUser } from "react-auth-kit";
import IntlCurrencyInput from "react-intl-currency-input";
import { Fragment } from "react";
import {
  Card,
  Input,
  CardBody,
  CardFooter,
  Button,
  Select,
  Option,
  Typography,
  Textarea,
} from "@material-tailwind/react";
import { CloudArrowUpIcon, TrashIcon } from "@heroicons/react/24/outline";
import { BiChevronDown } from "react-icons/bi";
import { AiOutlineSearch } from "react-icons/ai";
import toast, { Toaster } from "react-hot-toast";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import {
  fetchBrands,
  fetchCategories,
  fetchColors,
} from "../../components/service/api";
import { useCreateDeleteProductHooks } from "../../hooks/hook";

function CreateProduct() {
  const {
    loading,
    setLoading,
    files,
    setFiles,
    products,
    setProducts,
    previews,
    setPreviews,
    fileNames,
    setFileNames,
    categories,
    setCategories,
    brands,
    setBrands,
    colors,
    setColors,
    isOpen,
    setIsOpen,
  } = useCreateDeleteProductHooks();
  const navigate = useNavigate();
  function closeModal() {
    setIsOpen(false);
  }
  const [inputValue, setInputValue] = useState(null);
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  const validationSchema = Yup.object().shape({
    Name: Yup.string()
      .required("Ürünün Adı zorunludur.")
      .max(100, "Ürünün Adı 100 karakterden uzun olamaz."),
    Description: Yup.string()
      .required("Açıklama zorunludur.")
      .max(500, "Açıklama 500 karakterden uzun olamaz."),
    ColorId: Yup.string().required("Renk gereklidir"),
    BrandId: Yup.string().required("Marka gereklidir"),
    ProductCondition: Yup.string().required("Ürün durumu gereklidir"),
    Price: Yup.number()
      .required("Ürün fiyatı gereklidir.")
      .min(0, "Ürün fiyatı negatif olamaz."),
    IsOfferable: Yup.string().required("Teklif durumu gereklidir"),
    IsSold: Yup.string().required("Ürün satış durumu gereklidir"),
    CategoryId: Yup.string().required("Kategori gereklidir"),
    Image: Yup.mixed()
      .required("Lütfen bir resim dosyası seçin")
      .test("fileFormat", "Desteklenmeyen dosya formatı", (value) => {
        if (!value) return false;
        const supportedFormats = ["image/jpeg", "image/png", "image/jpg"];
        return supportedFormats.includes(value.type);
      })
      .test("fileSize", "Dosya boyutu çok büyük", (value) => {
        if (!value) return false;
        return value.size <= MAX_FILE_SIZE;
      }),
  });

  function closeModal() {
    setIsOpen(false);
    setTimeout(() => {
      navigate("/");
    }, 1000);
  }

  function openModal() {
    setIsOpen(true);
  }
  const auth = useAuthUser();
  const authHeader = useAuthHeader();
  const config = {
    headers: {
      Accept: "*/*, application/json, text/plain",
      Authorization: `${authHeader()}`,
    },
  };

  // COLOR ENDPOINTI
  useEffect(() => {
    const fetchData = async () => {
      const colors = await fetchColors(config);
      setColors(colors);
    };

    fetchData();
  }, []);

  // BRAND ENDPOINTI
  useEffect(() => {
    const fetchData = async () => {
      const brands = await fetchBrands(config);
      setBrands(brands);
    };

    fetchData();
  }, []);

  // KATEGORİ ENDPOINTİ
  useEffect(() => {
    const fetchData = async () => {
      const categories = await fetchCategories(config);
      setCategories(categories);
    };

    fetchData();
  }, []);

  // ÜRÜNLERİ LİSTELE
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://localhost:7104/api/Product",
          config
        );
        setProducts(response.data.result);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [products]);

  //Ürün Silme
  const deleteonSubmit = async (values) => {
    setLoading(true);
    const data = {
      id: values.id,
    };

    try {
      const response = await axios.delete(
        `https://localhost:7104/api/Product/${values.id}`,

        config
      );

      toast("Ürün Silindi.", { icon: "👌" });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      const errorMessage = error.response.data;
      toast.error(`${errorMessage}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const deleteformik = useFormik({
    initialValues: {
      id: 0,
    },
    onSubmit: deleteonSubmit,
  });
  // önizleme
  useEffect(() => {
    if (!files) return;
    let tmp = [];
    let tmpFileNames = [];
    for (let i = 0; i < files.length; i++) {
      tmp.push(URL.createObjectURL(files[i]));
      tmpFileNames.push(files[i].name);
    }
    const objectUrls = tmp;
    setPreviews(objectUrls);
    setFileNames(tmpFileNames);

    for (let i = 0; i < objectUrls.length; i++) {
      return () => {
        URL.revokeObjectURL(objectUrls[i]);
      };
    }
  }, [files]);
  const fileInputRef = useRef(null);

  const currencyConfig = {
    locale: "tr-TR",
    formats: {
      number: {
        TRY: {
          style: "currency",
          currency: "TRY",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
      },
    },
  };

  const handleFileUpload = () => {
    fileInputRef.current.click();
  };
  const handleRemovePreview = (index) => {
    const updatedPreviews = [...previews];
    updatedPreviews.splice(index, 1);
    setPreviews(updatedPreviews);

    const updatedFileNames = [...fileNames];
    updatedFileNames.splice(index, 1);
    setFileNames(updatedFileNames);
  };

  const onSubmit = async (values) => {
    setLoading(true);
    const data = {
      Name: values.Name,
      Description: values.Description,
      ColorId: parseInt(values.ColorId),
      BrandId: parseInt(values.BrandId),
      ProductCondition: values.ProductCondition,
      UserName: auth().username,
      Price: values.Price,
      IsOfferable: Boolean(values.IsOfferable),
      IsSold: values.IsSold,
      CategoryId: parseInt(values.CategoryId),
    };

    try {
      const url = "https://localhost:7104/api/Product";
      const formData = new FormData();
      formData.append("Image", values.Image);

      const config = {
        headers: {
          Accept: "text/plain",
          "Content-Type": "multipart/form-data",
          Authorization: `${authHeader()}`,
        },
        params: data,
      };

      const response = await axios.post(url, formData, config);

      openModal();
      toast("Ürün Oluşturuldu.", { icon: "👌" });
    } catch (error) {
      const errorMessage = error.response.data;
      toast.error(`${errorMessage}`);
      console.error(error);
    } finally {
      setLoading(false);
    }

    setLoading(false);
  };
  const MAX_FILE_SIZE = 400 * 1024; // 400 KB

  const formik = useFormik({
    initialValues: {
      Name: "",
      Description: "",
      ColorId: null,
      BrandId: null,
      ProductCondition: "",
      Image: null,
      UserName: auth().username,
      Price: "",
      IsOfferable: false,
      IsSold: null,
      CategoryId: null,
    },
    validationSchema,
    onSubmit,
  });

  return (
    <>
      <div className="flex min-h-screen flex-col py-5 items-center">
        <Typography variant="h4" color="blue-gray">
          Ürün Oluştur
        </Typography>
        <Typography color="gray" className="font-normal">
          Detayları giriniz.
        </Typography>
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
                        Başarılı
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-md text-gray-700">
                          Başarılı bir şekilde ürünü oluşturdunuz.
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
        <form
          onSubmit={formik.handleSubmit}
          className="mt-8 mb-2 md:w-1/2 max-w-screen-lg sm:w-96"
        >
          <div className="mb-4 flex flex-col gap-6">
            <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4">
              <div className="relative">
                <Input
                  name="Name"
                  onChange={formik.handleChange}
                  value={formik.values.Name}
                  error={formik.touched.Name && formik.errors.Name}
                  size="lg"
                  label="Ürünün Adı"
                />
                {formik.touched.Name && formik.errors.Name && (
                  <div className="text-red-400">{formik.errors.Name}</div>
                )}
              </div>
              <div className="relative">
                <Select
                  name="ColorId"
                  onChange={(value) => formik.setFieldValue("ColorId", value)}
                  // value={formik.values.CategoryId}
                  error={formik.touched.ColorId && formik.errors.ColorId}
                  variant="outlined"
                  label="Renk"
                >
                  {colors.map((color, index) => (
                    <Option key={index} value={`${color.id}`}>
                      {color.name}
                    </Option>
                  ))}
                </Select>
                {formik.touched.ColorId && formik.errors.ColorId && (
                  <div className="text-red-400">{formik.errors.ColorId}</div>
                )}
              </div>

              <div className="relative">
                <Select
                  name="BrandId"
                  onChange={(value) => formik.setFieldValue("BrandId", value)}
                  // value={formik.values.CategoryId}
                  error={formik.touched.BrandId && formik.errors.BrandId}
                  variant="outlined"
                  label="Marka"
                >
                  {brands.map((brand, index) => (
                    <Option key={index} value={`${brand.id}`}>
                      {brand.name}
                    </Option>
                  ))}
                </Select>
                {formik.touched.BrandId && formik.errors.BrandId && (
                  <div className="text-red-400">{formik.errors.BrandId}</div>
                )}
              </div>

              <div className="relative">
                <Select
                  name="ProductCondition"
                  onChange={(value) =>
                    formik.setFieldValue("ProductCondition", value)
                  }
                  onBlur={formik.handleBlur}
                  error={
                    formik.errors.ProductCondition &&
                    formik.touched.ProductCondition
                  }
                  value={formik.values.ProductCondition}
                  variant="outlined"
                  label="Ürünün Durumu"
                >
                  <Option value="Sıfır">Sıfır</Option>
                  <Option value="İkinci El">İkinci El</Option>
                </Select>
                {formik.touched.ProductCondition &&
                  formik.errors.ProductCondition && (
                    <div className="text-red-400">
                      {formik.errors.ProductCondition}
                    </div>
                  )}
              </div>

              <div className="relative">
                <Select
                  name="IsOfferable"
                  onChange={(value) =>
                    formik.setFieldValue("IsOfferable", value)
                  }
                  value={formik.values.IsOfferable}
                  error={
                    formik.touched.IsOfferable && formik.errors.IsOfferable
                  }
                  variant="outlined"
                  label="Teklif Durumu"
                >
                  <Option value={true}>Açık</Option>
                  <Option value={false}>Kapalı</Option>
                </Select>
                {formik.touched.IsOfferable && formik.errors.IsOfferable && (
                  <div className="text-red-400">
                    {formik.errors.IsOfferable}
                  </div>
                )}
              </div>
              <div className="relative">
                <Select
                  name="IsSold"
                  onChange={(value) => formik.setFieldValue("IsSold", value)}
                  value={formik.values.IsSold}
                  error={formik.touched.IsSold && formik.errors.IsSold}
                  variant="outlined"
                  label="Ürün Satış Durumu"
                >
                  <Option value={false}>Mevcut</Option>
                  <Option value={true}>Satıldı</Option>
                </Select>
                {formik.touched.IsSold && formik.errors.IsSold && (
                  <div className="text-red-400">{formik.errors.IsSold}</div>
                )}
              </div>
              <div className="relative">
                <Select
                  name="CategoryId"
                  onChange={(value) =>
                    formik.setFieldValue("CategoryId", value)
                  }
                  // value={formik.values.CategoryId}
                  error={formik.errors.CategoryId && formik.touched.CategoryId}
                  variant="outlined"
                  label="Kategori"
                >
                  {categories.map((category, index) => (
                    <Option key={index} value={`${category.id}`}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
                {formik.touched.CategoryId && formik.errors.CategoryId && (
                  <div className="text-red-400">{formik.errors.CategoryId}</div>
                )}
              </div>
              <div className="relative flex flex-col items-center justify-center gap-4">
                <div className="w-full px-4 py-1 rounded-lg border border-gray-400">
                  <IntlCurrencyInput
                    name="Price"
                    onChange={(event, value, maskedValue) => {
                      const formattedValue = maskedValue.replace(/[^\d]/g, "");
                      formik.setFieldValue("Price", formattedValue);
                    }}
                    onBlur={formik.handleBlur}
                    value={formik.values.Price}
                    error={formik.touched.Price && formik.errors.Price}
                    currency="TRY"
                    config={currencyConfig}
                    className="w-full text-lg font-bold"
                  />
                </div>
                {formik.touched.Price && formik.errors.Price && (
                  <div className="text-red-400">{formik.errors.Price}</div>
                )}
              </div>
            </div>
            <div className="relative">
              <Textarea
                name="Description"
                onChange={formik.handleChange}
                value={formik.values.Description}
                error={formik.touched.Description && formik.errors.Description}
                variant="outlined"
                label="Açıklama"
              />
              {formik.touched.Description && formik.errors.Description && (
                <div className="text-red-400">{formik.errors.Description}</div>
              )}
            </div>

            <div className="flex flex-row mx-auto p-1 gap-3 items-center">
              <div className="relative">
                <input
                  type="file"
                  name="Image"
                  accept="image/jpg, image/jpeg, image/png"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      formik.setFieldValue("Image", e.target.files[0]);
                      setFiles(e.target.files);
                    }
                  }}
                />

                <Button
                  variant="gradient"
                  className="flex items-center gap-3"
                  onClick={handleFileUpload}
                >
                  <CloudArrowUpIcon strokeWidth={2} className="h-5 w-5" /> Resim
                  Yükle
                </Button>
                {formik.touched.Image && formik.errors.Image && (
                  <div className="text-red-400">{formik.errors.Image}</div>
                )}
              </div>
            </div>
            <div className="mx-auto">
              <div className="relative">
                {formik.errors.Image && formik.touched.Image && (
                  <div>{formik.errors.Image}</div>
                )}
              </div>
              {fileNames.map((name, index) => (
                <div key={name} className="flex items-center gap-2">
                  <p color="blue-gray">{name}</p>
                  <button
                    onClick={() => handleRemovePreview(index)}
                    className="p-1 rounded-full bg-red-400 text-white"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="h-80 w-80 p-2 border-dashed border-2 border-blue-gray-100 mx-auto">
              {previews &&
                previews.map((pic, index) => {
                  return <img key={index} src={pic} alt={`Preview ${index}`} />;
                })}
            </div>
          </div>

          <Button
            type="submit"
            ripple={true}
            className="mt-6 mb-20 flex mx-auto"
            color="green"
          >
            Oluştur
          </Button>
          <Toaster />
        </form>
        <form onSubmit={deleteformik.handleSubmit}>
          <Card className="w-96 ">
            <CardBody className="flex flex-col items-center justify-center">
              <Typography variant="h4" color="blue-gray">
                Ürünü Sil
              </Typography>

              <div className="w-72 font-medium">
                <div
                  onClick={() => setOpen(!open)}
                  className={`bg-gray-100 w-full p-2 flex items-center justify-between rounded ${
                    !selected && "text-light-blue-700"
                  }`}
                >
                  {selected
                    ? selected.length > 25
                      ? selected.substring(0, 25) + "..."
                      : selected
                    : "Ürün Seç"}
                  <BiChevronDown
                    size={20}
                    className={`${open && "rotate-180"}`}
                  />
                </div>
                <ul
                  className={`bg-gray-100 rounded mt-2 overflow-y-auto ${
                    open ? "max-h-60" : "max-h-0"
                  } `}
                >
                  <div className="flex items-center px-2 sticky top-0 bg-gray-100">
                    <AiOutlineSearch
                      size={18}
                      className="text-light-blue-700"
                    />
                    <input
                      type="id"
                      value={inputValue}
                      onChange={(e) => {
                        setInputValue(e.target.value);
                      }}
                      placeholder="Ürünü ara.."
                      className="placeholder:text-gray-700 bg-gray-100 p-2 outline-none"
                    />
                  </div>
                  {products?.map((product) => (
                    <li
                      key={product?.id}
                      value={product?.id}
                      className={`p-2 text-sm hover:bg-sky-600 hover:text-light-blue-700
        ${
          product?.name.toLowerCase() === selected
            ? "bg-sky-600 text-black"
            : ""
        }
        ${product?.name?.toLowerCase().startsWith(inputValue) ? "" : "hidden"}`}
                      onClick={() => {
                        if (product?.id !== selected) {
                          setSelected(product?.name);
                          setOpen(false);
                          setInputValue("");
                          deleteformik.setFieldValue("id", product?.id); // Seçilen ürünün ID'sini Formik alanına gönder
                        }
                      }}
                    >
                      {product?.name}
                    </li>
                  ))}
                </ul>
              </div>
            </CardBody>
            <CardFooter className="pt-0 mx-auto">
              <Button type="submit" color="red">
                Sil
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </>
  );
}

export default CreateProduct;
