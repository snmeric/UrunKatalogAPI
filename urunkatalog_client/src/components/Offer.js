import React from "react";
import axios, { AxiosError } from "axios";
import { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import moment from "moment";
import { Loading } from "@nextui-org/react";
import { HiCheck } from "react-icons/hi2";
import { HiArchiveBox } from "react-icons/hi2";
import { useAuthUser } from "react-auth-kit";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Avatar,
  IconButton,
  Tooltip,
  Input,
} from "@material-tailwind/react";
import toast, { Toaster } from "react-hot-toast";
import ComplexNavbar from "./navbar/ComplexNavbar";
import { useAuthHeader } from "react-auth-kit";

const TABLE_HEAD = ["ID", "Ürün", "Fiyat", "Tarih", "Teklif Eden", "Kaldır"];
const TABLE_HEAD_OFFER = ["ID", "Ürün", "Fiyat", "Tarih", "Teklif Eden", "Onayla"];

function Offer() {
  const [selproduct, setSelProduct] = useState([]);
  const [loading, setloading] = useState(false);
  const [myOffer, setmyOffer] = useState([]);
  const [product, setProduct] = useState([]);
  const [offers, setoffers] = useState([]);
  const authHeader = useAuthHeader();
  const config = {
    headers: {
      Accept: "*/*, application/json, text/plain",
      Authorization: `${authHeader()}`,
    },
  };

  /*MYOFFER SAYFALANDIRMA */
  const [myOfferCurrentPage, setmyOfferCurrentPage] = useState(1); // Şu anki sayfa numarası
  const PAGE_SIZE = 3; // Örnek olarak 3 satır veri gösterilsin
  const totalPages = Math.ceil(myOffer.length / PAGE_SIZE); // Toplam sayfa sayısı
  // Sayfa numaralarını oluşturmak için bir döngü kullanın
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Şu anki sayfaya göre verileri filtreleyin
  const startIndex = (myOfferCurrentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentData = myOffer.slice(startIndex, endIndex);

  // Sayfa numarası tıklanınca çağrılacak fonksiyon
  const myOfferHandlePageClick = (pageNumber) => {
    setmyOfferCurrentPage(pageNumber);
  };


  /* GELEN TEKLİFLERİ SAYFALANDIRMA */



  const [offerCurrentPage, setofferCurrentPage] = useState(1); // Şu anki sayfa numarası
  const OFFER_PAGE_SIZE = 3; // Örnek olarak 3 satır veri gösterilsin
  const offertotalPages = Math.ceil(offers.length / OFFER_PAGE_SIZE); // Toplam sayfa sayısı
  // Sayfa numaralarını oluşturmak için bir döngü kullanın
  const offerPageNumbers = [];
  for (let i = 1; i <= offertotalPages; i++) {
    offerPageNumbers.push(i);
  }

  // Şu anki sayfaya göre verileri filtreleyin
  const offerStartIndex = (offerCurrentPage - 1) * OFFER_PAGE_SIZE;
  const offerEndIndex = offerStartIndex + OFFER_PAGE_SIZE;
  const offerCurrentData = offers.slice(offerStartIndex, offerEndIndex);

  // Sayfa numarası tıklanınca çağrılacak fonksiyon
  const offerHandlePageClick = (offerPageNumber) => {
    setofferCurrentPage(offerPageNumber);
  };



  /*OFFER */
  useEffect(() => {
    setloading(true);
    axios
      .get("https://localhost:7104/api/Account", config)
      .then((response) => {
        setoffers(response.data);
      })
      .catch((error) => console.log(error));
    console.log("Teklif Aldıklarım: ", offers);
    setloading(false);
  }, []);

  /* MY OFFER GELEN TEKLİFLER */

  useEffect(() => {
    setloading(true);
    axios
      .get(`https://localhost:7104/api/Account/myoffer`, config)
      .then((response) => {
        setmyOffer(response.data);
      })
      .catch((error) => {
        const errorMessage = error.response.data;
        toast.error(`${errorMessage}`);
        console.log(errorMessage);
      });
    setloading(false);
  }, []);

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
    setloading(false);
    getProduct();
  }, []);

  /* OFFER SİLME */

  const removeOffer = (offerId) => {
    setloading(true);
    axios
      .delete(`https://localhost:7104/Offer/${offerId}`, config)
      .then((response) => {
        toast("Teklif silindi.", { icon: "👍🏻" });

        setTimeout(() => {
          window.location.reload();
        }, 1000);

        console.log(response.data);
        setloading(true);
      })
      .catch((error) => {
        const errorMessage = error.response.data;
        toast.error(`Hata: ${errorMessage}`);
        console.error(error);
        setloading(true);
      });
  };


/* GELEN TEKLİFLERİ ONAYLAMA */

const offerAccept = (offerId) => {
  setloading(true);
  

  axios.put(`https://localhost:7104/api/Account/${offerId}`, config
  )
  .then(response => {
    toast("Teklif Onaylandı.", { icon: "👍🏻" });
    console.log('İstek başarılı:', response.data);
  })
  .catch(error => {
    const errorMessage = error.response.data;
        toast.error(`${errorMessage}`);
        console.log("Başarısız: ",errorMessage);
  });
};



  const auth = useAuthUser();

  if (!loading) {
    return (
      <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center">
        <Loading type="spinner" size="lg" />
      </div>
    );
  }
  return (
    <div className="h-full gap-5 flex flex-col items-center justify-center ">
      <ComplexNavbar />
      <Typography variant="h2" color="blue-gray">
        Hoşgeldiniz {auth().email}
      </Typography>
      <Card className="h-full w-2/3 ">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <Typography variant="h5" color="blue-gray">
                Gelen Teklifler
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Ürünlerinize gelen teklifler burda gösterilir
              </Typography>
            </div>
          </div>
        </CardHeader>
        <CardBody className="px-0 overflow-x-auto overflow-hidden">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD_OFFER.map((head) => (
                  <th
                    key={head}
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
            {offerCurrentData.map((item,index) =>  {
                const selectedProduct = product.find(
                  (p) => p.id === item.productId
                );
                const isLast = index === item.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <>
                   
                      <tr key={item.name}>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {item.id}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <Avatar
                              src={
                                selectedProduct && selectedProduct.image
                                  ? "https://localhost:7104/resources/" +
                                    selectedProduct.image
                                  : ""
                              }
                              alt={item.name}
                              size="xl"
                              className="border border-blue-gray-50 bg-blue-gray-50/50 object-contain p-1"
                            />
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-bold"
                            >
                              {item.name}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {item.offeredPrice} TL
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {moment(`${item.modifiedDate}`).format(
                              "DD/MM/YYYY HH:mm"
                            )}
                          </Typography>
                        </td>

                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                color="black"
                                className="font-normal opacity-70"
                              >
                                {item.modifiedBy}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={classes}>
                          <Tooltip content="Teklifi Onayla">
                            <IconButton
                              variant="text"
                              color="blue-gray"
                              onClick={() => offerAccept(item.id)}
                            >
                              <HiCheck className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                        </td>
                      </tr>
                  
                  </>
                );
              })}
            </tbody>
          </table>
        </CardBody>
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          
            {/* Önceki sayfa düğmesi */}
            <Button
              variant="outlined"
              color="blue-gray"
              size="sm"
              disabled={offerCurrentPage === 1}
              onClick={() => setofferCurrentPage(offerCurrentPage - 1)}
            >
              Önceki
            </Button>

            {/* Sayfa numaraları */}
            <div className="flex items-center gap-2">
              {offerPageNumbers.map((offerPageNumber) => (
                <IconButton
                  key={offerPageNumber}
                  variant={offerCurrentPage === offerPageNumber ? "contained" : "text"}
                  color="blue-gray"
                  size="sm"
                 
                >
                  {offerPageNumber}
                </IconButton>
              ))}
            </div>
            {/* Sonraki sayfa düğmesi */}
            <Button
              variant="outlined"
              color="blue-gray"
              size="sm"
              disabled={offerCurrentPage === offertotalPages}
              onClick={() => offerHandlePageClick(offerCurrentPage + 1)}
            >
              Sonraki
            </Button>
        
        </CardFooter>
      </Card>


      { /*TEKLİF ETTİKLERİM */ }
      <Card className="h-full w-2/3 ">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <Typography variant="h5" color="blue-gray">
                Teklif Ettiklerim
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Teklif ettikleriniz burada gösterilir.
              </Typography>
            </div>
          </div>
        </CardHeader>
        <CardBody className="px-0 overflow-x-auto overflow-hidden">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
            {currentData.map((item,index) =>  {
                const selectedProduct = product.find(
                  (p) => p.id === item.productId
                );
                const isLast = index === item.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <>
                   
                      <tr key={item.name}>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {item.id}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <Avatar
                              src={
                                selectedProduct && selectedProduct.image
                                  ? "https://localhost:7104/resources/" +
                                    selectedProduct.image
                                  : ""
                              }
                              alt={item.name}
                              size="xl"
                              className="border border-blue-gray-50 bg-blue-gray-50/50 object-contain p-1"
                            />
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-bold"
                            >
                              {item.name}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {item.offeredPrice} TL
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {moment(`${item.createdDate}`).format(
                              "DD/MM/YYYY HH:mm"
                            )}
                          </Typography>
                        </td>

                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                color="black"
                                className="font-normal opacity-70"
                              >
                                {item.modifiedBy}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={classes}>
                          <Tooltip content="Teklifi Kaldır">
                            <IconButton
                              variant="text"
                              color="blue-gray"
                              onClick={() => removeOffer(item.id)}
                            >
                              <HiArchiveBox className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                        </td>
                      </tr>
                  
                  </>
                );
              })}
            </tbody>
          </table>
        </CardBody>
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
         
            {/* Önceki sayfa düğmesi */}
            <Button
              variant="outlined"
              color="blue-gray"
              size="sm"
              disabled={myOfferCurrentPage === 1}
              onClick={() => setmyOfferCurrentPage(myOfferCurrentPage - 1)}
            >
              Önceki
            </Button>

            {/* Sayfa numaraları */}
            <div className="flex items-center gap-2">
              {pageNumbers.map((pageNumber) => (
                <IconButton
                  key={pageNumber}
                  variant={myOfferCurrentPage === pageNumber ? "contained" : "text"}
                  color="blue-gray"
                  size="sm"
                  onClick={() => myOfferHandlePageClick (pageNumber)}
                >
                  {pageNumber}
                </IconButton>
              ))}
            </div>
            {/* Sonraki sayfa düğmesi */}
            <Button
              variant="outlined"
              color="blue-gray"
              size="sm"
              disabled={myOfferCurrentPage === totalPages}
              onClick={() => setmyOfferCurrentPage(myOfferCurrentPage + 1)}
            >
              Sonraki
            </Button>
       
        </CardFooter>
      </Card>
      <Toaster />
    </div>
  );
}

export default Offer;