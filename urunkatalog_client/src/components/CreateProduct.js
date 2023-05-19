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

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Ürün adı gereklidir"),
    color: Yup.string().required("Renk gereklidir"),
    brand: Yup.string().required("Marka gereklidir"),
    condition: Yup.string().required("Ürün durumu gereklidir"),
    price: Yup.number().required("Ürün fiyatı gereklidir"),
    offerStatus: Yup.string().required("Teklif durumu gereklidir"),
    saleStatus: Yup.string().required("Ürün satış durumu gereklidir"),
    category: Yup.string().required("Kategori gereklidir"),
    description: Yup.string().required("Açıklama gereklidir"),
    image: Yup.mixed()
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

  const onSubmit = async (values) => {
    const imageName = JSON.stringify(fileNames[0]);

    setloading(true);
    const data = {
      Name: values.Name,
      Description: values.Description,
      Color: values.Color,
      Brand: values.Brand,
      ProductCondition: values.ProductCondition,
      UserName: '"' + auth().username + '"',
      Price: values.Price,
      IsOfferable: values.IsOfferable,
      IsSold: values.IsSold,
      CategoryId: parseInt(values.CategoryId),
    };
    // const formData = new FormData();
    // formData.append("Name", values.Name);
    // formData.append("Description", values.Description);
    // formData.append("Color", values.Color);
    // formData.append("Brand", values.Brand);
    // formData.append("ProductCondition", values.ProductCondition);
    // formData.append('Image', fs.createReadStream(values.Image.Name));
    // formData.append("UserName", values.UserName);
    // formData.append("Price", values.Price);
    // formData.append("IsOfferable", values.IsOfferable);
    // formData.append("IsSold", values.IsSold);
    // formData.append("CategoryId", values.CategoryId);

    console.log("Values: ", values);
   

    try {
      const url = 'https://localhost:7104/api/Product';
      const formData = new FormData();
      formData.append('Image', values.Image);

      const config = {
        headers: {
          'Accept': 'text/plain',
          'Content-Type': 'multipart/form-data',
          Authorization: `${authHeader()}`
        },
        params: data,
      };

      const response = await axios.post(url, formData, config);
      console.log(response.data);
      openModal();
      toast('Ürün Oluşturuldu.', { icon: '👌' });
    } catch (error) {
      const errorMessage = error.response.data;
      toast.error(`${errorMessage}`);
      console.error(error);
    } finally {
      setloading(false);
    }
    // axios
    //   .post("https://localhost:7104/api/Product", formData, {
    //     headers
    //   })
    //   .then((response) => {
    //     console.log(response.data);
    //     openModal();
    //     toast("Ürün Oluşturuldu.", { icon: "👌" });
    //   })
    //   .catch((error) => {
    //     const errorMessage = error.response.data;
    //     toast.error(`${errorMessage}`);
    //     console.error(error);
    //   });
    setloading(false);
  };
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

  const formik = useFormik({
    initialValues: {
      Name: "",
      Description: "",
      Color: "",
      Brand: "",
      ProductCondition: "",
      Image: null,
      UserName: auth().username,
      Price: "",
      IsOfferable: true,
      IsSold: false,
      CategoryId: null,
    },
    // validationSchema,
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
                name="Name"
                onChange={formik.handleChange}
                value={formik.values.Name}
                error={formik.touched.Name && formik.errors.Name}
                size="lg"
                label="Ürünün Adı"
              />
              {formik.errors.Name && formik.touched.Name}
              <Select
                name="Color"
                value={formik.values.Color}
                error={formik.errors.Color && formik.touched.Color}
                onChange={(value) => formik.setFieldValue("Color", value)}
                onBlur={formik.handleBlur}
                label="Renk"
              > 
              <Option value="none">Renk Yok</Option>
                <Option value="blue">Mavi</Option>
                <Option value="red">Kırmızı</Option>
                <Option value="green">Yeşil</Option>
                <Option value="umber">Sarı</Option>
              </Select>
              {formik.errors.Color && formik.touched.Color}
              <Input
                name="Brand"
                onChange={formik.handleChange}
                value={formik.values.Brand}
                error={formik.errors.Brand && formik.touched.Brand}
                size="lg"
                label="Marka"
              />

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
              <Input
                name="Price"
                onChange={formik.handleChange}
                value={formik.values.Price}
                error={formik.touched.Price && formik.errors.Price}
                size="lg"
                label="Ürünün Fiyatı"
                type="number"
              />

              <Select
                name="IsOfferable"
                onChange={(value) => formik.setFieldValue("IsOfferable", value)}
                value={formik.values.IsOfferable}
                error={formik.touched.IsOfferable && formik.errors.IsOfferable}
                variant="outlined"
                label="Teklif Durumu"
              >
                <Option value={true}>Açık</Option>
                <Option value={false}>Kapalı</Option>
              </Select>
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

              <Select
                name="CategoryId"
                onChange={(value) => formik.setFieldValue("CategoryId",value)}
                // value={formik.values.CategoryId}
                error={formik.errors.CategoryId && formik.touched.CategoryId}
                variant="outlined"
                label="Kategori"
              >
                {categories.map((category,index) => (
                  <Option key={index} value={`${category.id}`}>
                    {category.name}
                  </Option>
                ))}

              </Select>
            </div>
            <Textarea
              name="Description"
              onChange={formik.handleChange}
              value={formik.values.Description}
              error={formik.touched.Description && formik.errors.Description}
              variant="outlined"
              label="Açıklama"
            />

            <div className="flex flex-row mx-auto p-1 gap-3 items-center">
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
            </div>
            <div className="mx-auto">
              {formik.errors.Image && formik.touched.Image && (
                <div>{formik.errors.Image}</div>
              )}
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
