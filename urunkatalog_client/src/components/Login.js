import { Input, useInput, Link, Grid,Loading, Spacer, Container, Card, Row, Text, Button } from "@nextui-org/react";
import { UnLockIcon } from "./UnlockIcon.js";
import { LockIcon } from "./LockIcon.js";
import { useSignIn } from "react-auth-kit";
import { useFormik } from "formik";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import React from 'react'


function Login() {

    const [error, setError] = useState("");
    const signIn = useSignIn();

    const onSubmit = async (values) => {
        console.log("Values: ", values);
        setError("");
        try {
            const response = await axios.post(
                "https://localhost:7104/Authenticate/login",
                values
            );

            signIn({
                token: response.data.token,
                expiresIn: 3600,
                tokenType: "Bearer",
                authState: { email: values.email },
            });
        } catch (err) {
            if (err && err instanceof AxiosError)
                setError(err.response?.data.message);
            else if (err && err instanceof Error) setError(err.message);

            console.log("Error: ", err);
        }
    };
    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        onSubmit,
    });

    const { value, reset, bindings } = useInput("");

    const validateEmail = (value) => {
        return value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);
    };

    const helper = React.useMemo(() => {
        if (!value)
            return {
                text: "",
                color: "",
            };
        const isValid = validateEmail(value);
        return {
            text: isValid ? "Correct email" : "Enter a valid email",
            color: isValid ? "success" : "error",
        };
    }, [value]);



    return (

        <div className='header__container min-vh-100 d-flex justify-content-center align-items-center'>


            <Grid.Container gap={1} justify="center"

            >
                <Grid sm={3} >

                    <Card variant="bordered" >
                        <Card.Body justify='center' className='p-5 d-flex justify-content-center'>




                            {/* <Input
                                {...bindings}
                                clearable
                                shadow={false}
                                onChange={formik.values.email}
                                onClearClick={reset}
                                status={helper.color}
                                color={helper.color}
                                helperColor={helper.color}
                                helperText={helper.text}
                                type="email"
                                label="Email"
                                placeholder="With regex validation"
                            /> */}
                            <Spacer y={1} />

                            <form onSubmit={formik.handleSubmit}>
                                <Input
                                    clearable
                                    helperText="Please enter your name"
                                    label="Name"
                                    placeholder="Enter your name"

                                    onChange={formik.handleChange}
                                />

                                <Spacer y={2} />
                                <Input.Password width='250px'
                                    clearable label="Şifre"
                                    placeholder="Şifre"

                                    onChange={formik.handleChange}
                                    visibleIcon={<UnLockIcon fill="currentColor" />}
                                    hiddenIcon={<LockIcon fill="currentColor" />}
                                />

                                <Spacer y={1} />
                                <Button disabled auto bordered color="primary" css={{ px: "$13" }}>
                                    <Loading color="currentColor" size="sm" />
                                </Button>
                                <Button shadow color="secondary" auto onPressChange={formik.isSubmitting}>
                                    Giriş Yap
                                </Button>
                            </form>
                            <Spacer y={0.5} />
                            <Text color='grey'>
                                Hesabınız yok mu?
                                <Link block color="secondary" href="#">
                                    Kayıt Ol
                                </Link>
                            </Text>

                        </Card.Body>
                    </Card>
                </Grid>
            </Grid.Container >

        </div>
    );
}

export default Login;