import { useState } from "react";

export const useProductHooks = () => {
  const [product, setProduct] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);

  const [selproduct, setSelProduct] = useState([]);

  const [buyproduct, setBuyProduct] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [isBuyOpen, setBuyIsOpen] = useState(false);

  return {
    product,
    setProduct,
    categories,
    setCategories,
    brands,
    setBrands,
    colors,
    setColors,
    selproduct,
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
  };
};

export const useCreateDeleteProductHooks = () => {
    const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState();
  const [products, setProducts] = useState([]);
  const [previews, setPreviews] = useState();
  const [fileNames, setFileNames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  return {
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
  };
};

export const useOfferHooks = () => {
    const [loading, setLoading] = useState(false);
    const [myOffer, setMyOffer] = useState([]);
    const [product, setProduct] = useState([]);
    const [offers, setOffers] = useState([]);
  
    return {
      loading,
      setLoading,
      myOffer,
      setMyOffer,
      product,
      setProduct,
      offers,
      setOffers,
    };
  };