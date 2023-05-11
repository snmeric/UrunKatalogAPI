import React from "react";
import axios, { AxiosError } from "axios";
import { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import moment from 'moment';
import {
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
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
import ComplexNavbar from "./navbar/ComplexNavbar";
import { useAuthHeader } from "react-auth-kit";

const TABLE_HEAD = ["Ürün", "Fiyat", "Tarih", "Teklif Eden", "Kaldır"];

function Account() {
  const [selproduct, setSelProduct] = useState([]);
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

  /*OFFER */
  useEffect(() => {
    axios
      .get("https://localhost:7104/api/Account", config)
      .then((response) => {setoffers(response.data)})
      .catch((error) => console.log(error));
    console.log("Teklif Aldıklarım: ", offers);
  }, []);
  

  /* MY OFFER  */

  useEffect(() => {
        
    axios.get(`https://localhost:7104/api/Account/myoffer`, config)
      .then((response) => {
        setmyOffer(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
 
  /* ÜRÜN DETAY */
  useEffect(() => {
    const getProduct = async () => {
      await axios
        .get(`https://localhost:7104/api/Product`, config)
        .then((response) => setProduct(response.data.result))
        .catch((error) => console.log(error));

      console.log("Responsee", product);
    };

    getProduct();
  }, []);
 
  const id = offers.id;
  /*ÜRÜN ID SİNE GÖRE ÇAĞIRMA */
  useEffect(() => {
    async function fetchData() {
      if (product.length > 0) {
        const filteredProduct = product.find((p) => p.id === parseInt(id));
        setSelProduct(filteredProduct);
      }
    }

    fetchData();
  }, [product, id]);
  return (
    <div className="h-full gap-5 flex flex-col items-center justify-center ">
      <ComplexNavbar />
      
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
              {offers.map((offer, index) => {
                const selectedProduct = product.find((p) => p.id === offer.productId);
                const isLast = index === offer.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={offer.name}>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={
                            "https://localhost:7104/resources/" +
                            selectedProduct.image
                          }
                          alt={offer.name}
                          size="xl"
                          className="border border-blue-gray-50 bg-blue-gray-50/50 object-contain p-1"
                        />
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold"
                        >
                          {selectedProduct.name}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {offer.offeredPrice} TL
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {moment(`${offer.modifiedDate}`).format("DD/MM/YYYY HH:mm")}
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
                            {offer.modifiedBy}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={classes}>
                      <Tooltip content="Teklifi Kaldır">
                        <IconButton variant="text" color="blue-gray">
                          <MdDelete className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Button variant="outlined" color="blue-gray" size="sm">
            Previous
          </Button>
          <div className="flex items-center gap-2">
            <IconButton variant="outlined" color="blue-gray" size="sm">
              1
            </IconButton>
            {/* <IconButton variant="text" color="blue-gray" size="sm">
              2
            </IconButton>
            <IconButton variant="text" color="blue-gray" size="sm">
              3
            </IconButton>
            <IconButton variant="text" color="blue-gray" size="sm">
              ...
            </IconButton>
            <IconButton variant="text" color="blue-gray" size="sm">
              8
            </IconButton>
            <IconButton variant="text" color="blue-gray" size="sm">
              9
            </IconButton>
            <IconButton variant="text" color="blue-gray" size="sm">
              10
            </IconButton> */}
          </div>
          <Button variant="outlined" color="blue-gray" size="sm">
            Next
          </Button>
        </CardFooter>
      </Card>
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
              {myOffer.map((myOffers, index) => {
                const selectedProduct = product.find((p) => p.id === myOffers.productId);
                const isLast = index === myOffers.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={myOffers.name}>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={
                            "https://localhost:7104/resources/" +
                            selectedProduct.image
                          }
                          alt={myOffers.name}
                          size="xl"
                          className="border border-blue-gray-50 bg-blue-gray-50/50 object-contain p-1"
                        />
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold"
                        >
                          {selectedProduct.name}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {myOffers.offeredPrice} TL
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {moment(`${myOffers.modifiedDate}`).format("DD/MM/YYYY HH:mm")}
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
                            {myOffers.modifiedBy}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={classes}>
                      <Tooltip content="Teklifi Kaldır">
                        <IconButton variant="text" color="blue-gray">
                          <MdDelete className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Button variant="outlined" color="blue-gray" size="sm">
            Previous
          </Button>
          <div className="flex items-center gap-2">
            <IconButton variant="outlined" color="blue-gray" size="sm">
              1
            </IconButton>
            {/* <IconButton variant="text" color="blue-gray" size="sm">
              2
            </IconButton>
            <IconButton variant="text" color="blue-gray" size="sm">
              3
            </IconButton>
            <IconButton variant="text" color="blue-gray" size="sm">
              ...
            </IconButton>
            <IconButton variant="text" color="blue-gray" size="sm">
              8
            </IconButton>
            <IconButton variant="text" color="blue-gray" size="sm">
              9
            </IconButton>
            <IconButton variant="text" color="blue-gray" size="sm">
              10
            </IconButton> */}
          </div>
          <Button variant="outlined" color="blue-gray" size="sm">
            Next
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Account;


/* 

 <div className="flex flex-col">
            <div className="overflow-x-auto">
                <div className="p-1.5 w-full inline-block align-middle">
                    <div className="overflow-hidden border rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                    >
                                        IDSize Özel
                                        
                                        
                                        TAKİP EDİLEN KANALLAR
                                        PurpleBixi
                                        PurpleBixi
                                        
                                        Just Chatting
                                        
                                        27,3 B
                                        sanAzula
                                        sanAzula
                                        
                                        VALORANT
                                        
                                        26
                                        saamtwo
                                        saamtwo
                                        
                                        Counter-Strike: Global Offensive
                                        
                                        807
                                        LEGOO
                                        LEGOO
                                        
                                        VALORANT
                                        
                                        416
                                        AlinaNaMeli
                                        AlinaNaMeli
                                        
                                        Just Chatting
                                        
                                        194
                                        Ninja
                                        Ninja
                                        
                                        Fortnite Zero Build
                                        
                                        5,2 B
                                        aycaf
                                        aycaf
                                        
                                        VALORANT
                                        
                                        60
                                        ScreaM
                                        ScreaM
                                        
                                        Just Chatting
                                        
                                        3,1 B
                                        zeynepcisemm
                                        zeynepcisemm
                                        
                                        Çevrimdışı
                                        Daha Fazla Göster
                                        ÖNERİLEN KANALLAR
                                        laranovid
                                        laranovid
                                        
                                        VALORANT
                                        
                                        53
                                        unicariel
                                        unicariel
                                        
                                        Seyahat ve Doğa
                                        
                                        344
                                        cedaylayloy
                                        cedaylayloy
                                        
                                        VALORANT
                                        
                                        50
                                        Eplis
                                        Eplis
                                        
                                        VALORANT
                                        
                                        25
                                        Mianosa
                                        Mianosa
                                        
                                        VALORANT
                                        
                                        99
                                        yasseminvlr
                                        yasseminvlr
                                        
                                        VALORANT
                                        
                                        11
                                        Daha Fazla Göster
                                        PURPLEBİXİ İZLEYENLER ŞUNLARI DA İZLİYOR
                                        kocaelitv
                                        kocaelitv
                                        
                                        TV Station Manager
                                        
                                        6
                                        haskologlu
                                        haskologlu
                                        
                                        Just Chatting
                                        
                                        4,2 B
                                        Blushh
                                        Blushh
                                        
                                        Just Chatting
                                        
                                        362
                                        Daha Fazla Göster
                                        PurpleBixi
                                        CANLI
                                        
                                        PurpleBixi
                                        İNCE ADAYLIKTAN ÇEKİLDİ / Erlik, @jahrein @cavskarahanli
                                        Just Chatting
                                        Siyaset
                                        Haberler
                                        Gündem
                                        Tarih
                                        Analiz
                                        Türkçe
                                        27.274
                                        
                                        1:48:37
                                        PurpleBixi hakkında
                                        352,8 B
                                        takipçi
                                        ·
                                        
                                        Rekkitz
                                        
                                        Siyaset Uzmanı
                                        
                                        Twitter
                                        
                                        Instagram
                                        
                                        Discord
                                        
                                        Youtube
                                        
                                        Reddit
                                        
                                        PurpleBixi Hedefleri
                                        Yıldızlar
                                        Hedefe 163 abonelik kaldı!
                                        
                                        15837/16000 Abonelikler
                                        
                                        Panel İçeriği
                                        Panel İçeriği
                                        Panel İçeriği
                                        Panel İçeriği
                                        Panel İçeriği
                                        Panel İçeriği
                                        Panel İçeriği
                                        Panel İçeriği
                                        Panel İçeriği
                                        
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                    >
                                        Name
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                    >
                                        Email
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase "
                                    >
                                        Edit
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase "
                                    >
                                        Delete
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                <tr>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                                        1
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                        Jone Doe
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                        jonne62@gmail.com
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                        <a
                                            className="text-green-500 hover:text-green-700"
                                            href="#"
                                        >
                                            Edit
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                        <a
                                            className="text-red-500 hover:text-red-700"
                                            href="#"
                                        >
                                            Delete
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                                        2
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                        Jone Doe
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                        jonne62@gmail.com
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                        <a
                                            className="text-green-500 hover:text-green-700"
                                            href="#"
                                        >
                                            Edit
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                        <a
                                            className="text-red-500 hover:text-red-700"
                                            href="#"
                                        >
                                            Delete
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                                        3
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                        Jone Doe
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                        jonne62@gmail.com
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                        <a
                                            className="text-green-500 hover:text-green-700"
                                            href="#"
                                        >
                                            Edit
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                        <a
                                            className="text-red-500 hover:text-red-700"
                                            href="#"
                                        >
                                            Delete
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>


*/


/* 

<CardBody className="overflow-scroll px-0">
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
              {offers.map((offer, index) => {
                const selectedProduct = product.find((p) => p.id === offer.productId);
                const isLast = index === offer.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={offer.name}>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={
                            "https://localhost:7104/resources/" +
                            selectedProduct.image
                          }
                          alt={offer.name}
                          size="xl"
                          className="border border-blue-gray-50 bg-blue-gray-50/50 object-contain p-1"
                        />
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold"
                        >
                          {selectedProduct.name}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {offer.offeredPrice} TL
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {moment(`${offer.modifiedDate}`).format("DD/MM/YYYY HH:mm")}
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
                            {offer.modifiedBy}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={classes}>
                      <Tooltip content="Edit User">
                        <IconButton variant="text" color="blue-gray">
                          <PencilIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>

*/