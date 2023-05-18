import React from "react";
import { Listbox } from "@headlessui/react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useEffect, useState, useRef } from "react";
import { useAuthHeader, useAuthUser } from "react-auth-kit";
import {
  Card,
  Input,
  Checkbox,
  Button,
  Select,
  Option,
  Typography,
  Textarea,
} from "@material-tailwind/react";
import { CloudArrowUpIcon, TrashIcon } from "@heroicons/react/24/outline";
import ComplexNavbar from "./navbar/ComplexNavbar";
import toast, { Toaster } from "react-hot-toast";
import axios, { AxiosError } from "axios";

function CreateProduct() {
  const [files, setFiles] = useState();
  const [previews, setPreviews] = useState();
  const [fileNames, setFileNames] = useState([]);
  const [categories, setCategories] = useState([]);
  let [isOpen, setIsOpen] = useState(false);
  const prodId = parseInt(categories.id);

  const validationSchema = Yup.object().shape({
    productName: Yup.string().required("Ürün adı gereklidir"),
    color: Yup.string().required("Renk gereklidir"),
    brand: Yup.string().required("Marka gereklidir"),
    condition: Yup.string().required("Ürün durumu gereklidir"),
    price: Yup.number().required("Ürün fiyatı gereklidir"),
    offerStatus: Yup.string().required("Teklif durumu gereklidir"),
    saleStatus: Yup.string().required("Ürün satış durumu gereklidir"),
    category: Yup.string().required("Kategori gereklidir"),
    description: Yup.string().required("Açıklama gereklidir"),
  });

  function closeModal() {
    setIsOpen(false);
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

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setFiles(event.target.files);
    }
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
  const [loading, setloading] = useState(false);
  const imageName=JSON.stringify(fileNames);
  console.log("RESİM ADI:",imageName);
  const onSubmit = async (values) => {
    console.log("USERNMA:",auth().userName)
    setloading(true);
    const data = {
      name: values.name,
      description: values.description,
      color: values.color,
      brand: values.brand,
      productCondition: values.productCondition,
      image: values.image,
      userName: auth().userName,
      price: values.price,
      isOfferable: Boolean(values.isOfferable),
      isSold: values.isSold,
      categoryId: parseInt(values.categoryId),
    };

    console.log("Values: ", values);

    axios
      .post("https://localhost:7104/Product", data, {
        headers: {
          Authorization: `${authHeader()}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data);
        openModal();
        toast("Ürün Oluşturuldu.", { icon: "👌" });
      })
      .catch((error) => {
        const errorMessage = error.response.data;
        toast.error(`${errorMessage}`);
        console.error(error);
      });
    setloading(false);
  };
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      color: "",
      brand: "",
      productCondition: "",
      image: "",
      userName: "",
      price: 0,
      isOfferable: true,
      isSold: false,
      categoryId: 0,
    },

    onSubmit,
  });

  return (
    <>
      
      <ComplexNavbar />
      <div className="flex min-h-screen flex-col py-5 items-center">
        <Typography variant="h4" color="blue-gray">
          Ürün Oluştur
        </Typography>
        <Typography color="gray" className="font-normal">
          Detayları giriniz.
        </Typography>
        <form
          onSubmit={formik.handleSubmit}
          className="mt-8 mb-2 md:w-1/2 max-w-screen-lg sm:w-96"
        >
          <div className="mb-4 flex flex-col gap-6">
            <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4">
              <Input
                name="name"
                onChange={formik.handleChange}
                value={formik.values.name}
                error={formik.touched.name && formik.errors.name}
                size="lg"
                label="Ürünün Adı"
              />

              <Select
                name="color"
                value={formik.values.color}
                onChange={value=>formik.setFieldValue('color',value)}
                onBlur={formik.handleBlur}
                variant="outlined"
                label="Renk"
              >
                <Option value="blue">Blue</Option>
                <Option value="red">Red</Option>
                <Option value="green">Green</Option>
                <Option value="umber">Umber</Option>
              </Select>
              <Input
                name="brand"
                onChange={formik.handleChange}
                value={formik.values.brand}
                size="lg"
                label="Marka"
              />

              <Select
                name="productCondition"
                onChange={value=>formik.setFieldValue('productCondition',value)}
                onBlur={formik.handleBlur}
                value={formik.values.productCondition}
                variant="outlined"
                label="Ürünün Durumu"
              >
                <Option value="Sıfır">Sıfır</Option>
                <Option value="İkinci El">İkinci El</Option>
              </Select>
              <Input
                name="price"
                onChange={formik.handleChange}
                value={formik.values.price}
                error={formik.touched.price && formik.errors.price}
                size="lg"
                label="Ürünün Fiyatı"
                type="number"
              />
              <Select
                name="isOfferable"
                onChange={value=>formik.setFieldValue('isOfferable',value)}
                value={formik.values.isOfferable}
                error={formik.touched.isOfferable && formik.errors.isOfferable}
                variant="outlined"
                label="Teklif Durumu"
              >
                <Option value={true}>Açık</Option>
                <Option value={false}>Kapalı</Option>
              </Select>
              <Select
                name="isSold"
                onChange={value=>formik.setFieldValue('isSold',value)}
                value={formik.values.isSold}
                error={formik.touched.isSold && formik.errors.isSold}
                variant="outlined"
                label="Ürün Satış Durumu"
              >
                <Option value={false}>Mevcut</Option>
                <Option value={true}>Satıldı</Option>
              </Select>

              <Select
                name="categoryId"
                onChange={value=>formik.setFieldValue('categoryId',value)}
                value={formik.values.categoryId}
               
                variant="outlined"
                label="Kategori"
              >
                {categories.map((category, index) => (
                  <Option key={index} value={category.id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </div>
            <Textarea
              name="description"
              onChange={formik.handleChange}
              value={formik.values.description}
              error={formik.touched.description && formik.errors.description}
              variant="outlined"
              label="Açıklama"
            />
            <div className="flex flex-row mx-auto p-1 gap-3 items-center">
              <input
                type="file"
                accept="image/jpg, image/jpeg, image/png"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
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
            </div>
            <div className="mx-auto">
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
          >
            Oluştur
          </Button>
          <Toaster />
        </form>
      </div>
    </>
  );
}

export default CreateProduct;
