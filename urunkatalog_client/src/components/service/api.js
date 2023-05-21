import axios from 'axios';

const fetchData = async (url, config) => {
  try {
    const response = await axios.get(url, config);
    return response.data.result;
  } catch (error) {
    console.error(error);
    return [];
  }
};
export const fetchProduct = async (config) => {
    try {
      const response = await axios.get('https://localhost:7104/api/Product', config);
      return response.data.result;
    } catch (error) {
      console.error(error);
      return [];
    }
  };
export const fetchColors = async (config) => {
  const url = "https://localhost:7104/api/Color";
  return await fetchData(url, config);
};

export const fetchBrands = async (config) => {
  const url = "https://localhost:7104/api/Brand";
  return await fetchData(url, config);
};

export const fetchCategories = async (config) => {
  const url = "https://localhost:7104/api/Category";
  return await fetchData(url, config);
};
