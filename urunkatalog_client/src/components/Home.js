import { Button } from '@nextui-org/react';
import React from 'react'
import { useSignOut } from 'react-auth-kit'
import { useNavigate } from 'react-router-dom';
import { Card, Grid, Row, Text } from "@nextui-org/react";
import { useState, useEffect } from 'react';
import axios from 'axios';
import {useAuthHeader} from 'react-auth-kit'


function Home() {
    const [products, setProducts] = useState([]);
   
    const authHeader = useAuthHeader()



      const config = {
        headers: {
          'Authorization': `${authHeader()}`
        }
      };


    useEffect(() => {
       
        axios.get('https://localhost:7104/api/Product',config)
            .then(response => setProducts(response.data.result));
  
    }, []);

   
    console.log(authHeader());


    const signOut = useSignOut();
    const navigate = useNavigate();

    const logout = () => {
        signOut();
        navigate("/login");
    }
    const list = [
        {
            title: "Orange",
            img: "/images/fruit-1.jpeg",
            price: "$5.50",
        },
        {
            title: "Tangerine",
            img: "/images/fruit-2.jpeg",
            price: "$3.00",
        },
        {
            title: "Cherry",
            img: "/images/fruit-3.jpeg",
            price: "$10.00",
        },
        {
            title: "Lemon",
            img: "/images/fruit-4.jpeg",
            price: "$5.30",
        },
        {
            title: "Avocado",
            img: "/images/fruit-5.jpeg",
            price: "$15.70",
        },
        {
            title: "Lemon 2",
            img: "/images/fruit-6.jpeg",
            price: "$8.00",
        },
        {
            title: "Banana",
            img: "/images/fruit-7.jpeg",
            price: "$7.50",
        },
        {
            title: "Watermelon",
            img: "/images/fruit-8.jpeg",
            price: "$12.20",
        },
    ];

    return (
        <div className='text-2xl flex-col h-screen flex justify-center items-center p-10'>
           
           <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Color</th>
            <th>Brand</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.result.id}>
              <td>{product.result.brand}</td>
              <td>{product.description}</td>
              <td>{product.color}</td>
              <td>{product.brand}</td>
              <td>{product.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

            {/* <Grid.Container gap={2} justify="flex-start">
                {list.map((item, index) => (
                    <Grid xs={6} sm={3} key={index}>
                        <Card isPressable>
                            <Card.Body css={{ p: 0 }}>
                                <Card.Image
                                    src={"https://nextui.org" + item.img}
                                    objectFit="cover"
                                    width="100%"
                                    height={140}
                                    alt={item.title}
                                />
                            </Card.Body>
                            <Card.Footer css={{ justifyItems: "flex-start" }}>
                                <Row wrap="wrap" justify="space-between" align="center">
                                    <Text b>{item.title}</Text>
                                    <Text css={{ color: "$accents7", fontWeight: "$semibold", fontSize: "$sm" }}>
                                        {item.price}
                                    </Text>
                                </Row>
                            </Card.Footer>
                        </Card>
                    </Grid>
                ))}
            </Grid.Container> */}
            <Button shadow color="primary" auto onClick={logout}>
                Çıkış Yap
            </Button>
        </div>
    );
}

export default Home;