import { Button } from '@nextui-org/react';
import React from 'react'
import { useSignOut } from 'react-auth-kit'
import { useNavigate } from 'react-router-dom';
import { Card, Grid, Row, Text } from "@nextui-org/react";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthHeader } from 'react-auth-kit'
import { Navbar, Link,useTheme } from "@nextui-org/react";




function Home() {


    const authHeader = useAuthHeader();



    const [products, setProducts] = useState([]);
    const config = {
        headers: {
            Accept: 'text/plain',
            "Content-Type": "application/json",
            'Authorization': `${authHeader()}`
        }
    };
    console.log(authHeader());
    useEffect(() => {

        axios.get('https://localhost:7104/api/Product', config)
            .then(response => {
                setProducts(response.data.result);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);


    const { isDark } = useTheme();
    const signOut = useSignOut();
    const navigate = useNavigate();

    const logout = () => {
        signOut();
        navigate("/login");
    }


    return (
        
        <div className='text-2xl flex-col h-screen flex justify-center items-center p-10'>

            {/* <div>
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
                            <tr key={product.id}>
                                <p>Name: {product.name}</p>
                                <p>Description: {product.description}</p>
                                <p>Color: {product.color}</p>
                                <p>Brand: {product.brand}</p>
                                <p>Product Condition: {product.productCondition}</p>
                                <img src={"https://localhost:7104/resources/" + product.image} alt={product.name} />
                                <p>User Name: {product.userName}</p>
                                <p>Price: {product.price}</p>
                                <p>Is Offerable: {product.isOfferable ? "Yes" : "No"}</p>
                                <p>Is Sold: {product.isSold ? "Yes" : "No"}</p>
                                <p>Category Id: {product.categoryId}</p>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div> */}

            <Grid.Container gap={2} justify="flex-start">
                {products.map((product, index) => (
                    <Grid xs={6} sm={3} key={index}>
                        <Card isPressable>
                            <Card.Body css={{ p:20 }}>
                                <Card.Image
                                    src={"https://localhost:7104/resources/" + product.image}
                                    objectFit="cover"
                                    height="100%"
                                    width={140}
                                    alt={product.name}
                                />
                            </Card.Body>
                            <Card.Footer css={{ justifyItems: "flex-start" }}>
                                <Row wrap="wrap" justify="space-between" align="center">
                                    <Text b>{product.name}</Text>
                                    <Text css={{ color: "$accents7", fontWeight: "$semibold", fontSize: "$sm" }}>
                                        {product.price}
                                    </Text>
                                </Row>
                            </Card.Footer>
                        </Card>
                    </Grid>
                ))}
            </Grid.Container>

            <Button shadow color="primary" auto onClick={logout}>
                Çıkış Yap
            </Button>
        </div>
    );
}

export default Home;