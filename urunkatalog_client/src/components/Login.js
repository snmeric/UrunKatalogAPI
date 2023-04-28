import { Input, useInput, Link, Grid, Spacer, Card, Text, Button } from "@nextui-org/react";

import { useSignIn } from "react-auth-kit";
import { useFormik } from "formik";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import React from 'react'
import { useNavigate } from "react-router-dom";
import COVER_IMAGE from '../assets/loginbg.png'
import toast, { Toaster } from 'react-hot-toast';


function Login() {

    const [error, setError] = useState("");
    const signIn = useSignIn();
    const [isButtonDisabled, setIsButtonDisabled] = React.useState(true);
    const navigate = useNavigate();
    const [isLoading,setisLoading]=useState();

    const onSubmit = async (values) => {
        console.log("Values: ", values);
        setError("");
        setisLoading(true);
        const data = {
            email: values.email,
            password: values.password
        }

        const config = {
            
            headers: {
                "Content-Type": "application/json",
            },
        };
        try {
            
            
            const response = await axios.post(
                "https://localhost:7104/Authenticate/login",
                data,
                config
            );
            console.log(response);
            const token = await response.data.accessToken;
            signIn({
                token: token,
                expiresIn: 3600,
                tokenType: "Bearer",
                authState: { email: values.email },
            }
            );

            toast('Giriş Başarılı', { icon: '👏' });
            setTimeout(() => {
                navigate('/');
              }, 2000); 
        
             
          
        } catch (err) {
            if (err && err instanceof AxiosError)
                setError(err.response?.data.message);
            else if (err && err instanceof Error) setError(err.message);
            toast.error("Hatalı Giriş");
            console.log("Error: ", err);
        }
        finally{
            setisLoading(false);
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
    const validatePassword = (value) => {
        return value.length >= 8 && value.length <= 20;
    };



    const helperEmail = React.useMemo(() => {
        if (!formik.values.email)
            return {
                text: "",
                color: "",
            };
        const isEmailValid = validateEmail(formik.values.email);
        return {
            text: isEmailValid ? "Doğru Eposta" : "Emailinizi doğru giriniz",
            color: isEmailValid ? "success" : "error",
        };
    }, [formik.values.email]);

    const helperPassword = React.useMemo(() => {
        if (!formik.values.password)
            return {
                text: "",
                color: "",
            };
        const isValid = validatePassword(formik.values.password);


        return {
            text: isValid ? "Doğru Şifre" : "Şifreniz en az 8 en fazla 20 karakter olmalı",
            color: isValid ? "success" : "error",
        };
    }, [formik.values.password]);


    React.useEffect(() => {
        if (helperEmail.color === "success" && helperPassword.color === "success") {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    }, [helperEmail.color, helperPassword.color]);






    return (

        <div className="bg-gray-50 min-h-screen flex items-center justify-center">
            <div className="rounded-2xl bg-[#E5EDF9] shadow-lg flex max-w-3xl">

                {/* IMAGE */}

                <div className="md:block hidden w-1/2 p-5">

                    <img src={COVER_IMAGE} className="rounded-2xl w-full h-full object-cover"></img>

                </div>


                {/* LOGIN FORM */}

                <div className="md:w-1/2 px-16 h-full  p-20 flex flex-col justify-center items-center">
                    <div className="w-full flex flex-col items-center justify-center">
                        <h2 className="text-[#5A6180] font-bold text-2xl ">Giriş</h2>
                        <Spacer y={2} />
                        <form onSubmit={formik.handleSubmit} className="w-80 flex flex-col mb-5 ">
                            <Text>{error}</Text>
                            <Input
                                {...bindings}
                                clearable
                                shadow={false}

                                onClearClick={reset}
                                status={helperEmail.color}
                                color={helperEmail.color}
                                helperColor={helperEmail.color}
                                helperText={helperEmail.text}
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                type="email"
                                labelPlaceholder="Email"

                            />
                            <Spacer y={2} />




                            <Input.Password
                                clearable
                                type="password"
                                status={helperPassword.color}
                                color={helperPassword.color}
                                helperColor={helperPassword.color}
                                helperText={helperPassword.text}
                                name="password"
                                onBlur={formik.handleBlur}
                                labelPlaceholder="Şifre"
                                value={formik.values.password}
                                onChange={formik.handleChange}

                            />

                            <Spacer y={2} />

                            <Button flat color="primary" type="submit" disabled={isLoading}>
                                Giriş Yap
                            </Button>
                            <Toaster />
                        </form>
                        <Spacer y={0.5} />
                        <p className="text-sm mt-4 text-gray-600">
                            Hesabınız yok mu?
                            <Link block color="secondary" href="#">
                                Kayıt Ol
                            </Link>
                        </p>
                    </div>
                </div>
            </div>


        </div>

    );
}

export default Login;