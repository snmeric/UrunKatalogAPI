import { Input, useInput, Link, Grid, Spacer, Card, Text, Button } from "@nextui-org/react";
import { UnLockIcon } from "./UnlockIcon.js";
import { LockIcon } from "./LockIcon.js";
import { AuthProvider, useSignIn } from "react-auth-kit";
import { useFormik } from "formik";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import React from 'react'

import COVER_IMAGE from '../assets/loginbg.png'
import toast, { Toaster } from 'react-hot-toast';


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
            }
            );
            toast('Good Job!', {
                icon: '👏',
            });
        } catch (err) {
            if (err && err instanceof AxiosError)
                setError(err.response?.data.message);
            else if (err && err instanceof Error) setError(err.message);
            toast.error("Hatalı Giriş");
            console.log("Error: ", err);
        }
    };
    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        onSubmit: values => {
            console.log('onSubmit', values);
        },
    });

    const { value, reset, bindings } = useInput("");

    const validateEmail = (value) => {
        return value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);
    };

    const helper = React.useMemo(() => {
        if (!formik.values.email)
            return {
                text: "",
                color: "",
            };
        const isValid = validateEmail(formik.values.email);
        return {
            text: isValid ? "Doğru Eposta" : "Emailinizi doğru giriniz",
            color: isValid ? "success" : "error",
        };
    }, [formik.values.email]);



    return (

        <div className="w-full h-screen flex items-start">
            <div className="relative w-1/2 h-full flex flex-col">

                <img src={COVER_IMAGE} className="w-full h-full object-cover"></img>

            </div>

            <div className="w-1/2 h-full  p-20 flex flex-col justify-center items-center">
                <div className="w-full flex flex-col items-center justify-center">
                    <form initialValues={formik.initialValues} onSubmit={onSubmit} className="w-80 flex flex-col mb-5 ">
                        <Input
                            {...bindings}
                            clearable
                            shadow={false}

                            onClearClick={reset}
                            status={helper.color}
                            color={helper.color}
                            helperColor={helper.color}
                            helperText={helper.text}
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            type="email"
                            labelPlaceholder="Email"

                        />
                        <Spacer y={2} />

                        {/*                            
                                <Input
                                    clearable
                                    helperText="Please enter your name"
                                    label="Name"
                                    placeholder="Enter your name"
                                    value={formik.email}
                                    onChange={formik.handleChange}
                                /> */}


                        <Input.Password
                            clearable
                            type="password"

                            name="password"
                            onBlur={formik.handleBlur}
                            labelPlaceholder="Şifre"
                            value={formik.values.password}
                            onChange={formik.handleChange}

                        />

                        <Spacer y={2} />

                        <Button flat color="primary" type="submit">
                            Giriş Yap
                        </Button>
                        <Toaster />
                    </form>
                    <Spacer y={0.5} />
                    <Text color='grey'>
                        Hesabınız yok mu?
                        <Link block color="secondary" href="#">
                            Kayıt Ol
                        </Link>
                    </Text>
                </div>
            </div>


        </div>

    );
}

export default Login;