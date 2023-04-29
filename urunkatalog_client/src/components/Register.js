import { Input, useInput, Link, Grid, Spacer, Card, Text, Button } from "@nextui-org/react";
import { useSignIn } from "react-auth-kit";
import { useFormik } from "formik";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import React from 'react'
import { useNavigate } from "react-router-dom";
import COVER_IMAGE from '../assets/loginbg.png'
import toast, { Toaster } from 'react-hot-toast';

import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
} from "@material-tailwind/react";


export default function Register() {
    const { value, reset, bindings } = useInput("");
    const [error, setError] = useState("");
    const signIn = useSignIn();
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const navigate = useNavigate();
    const [isLoading, setisLoading] = useState();

    const validateEmail = (value) => {
        return value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);
    };
    const validatePassword = (value) => {
        return value.length >= 8 && value.length <= 20;
    };
    
    const onSubmit = async (values) => {
        console.log("Values: ", values);
        setError("");
        setIsButtonDisabled(true);
        const data = {
            username: values.username,
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
                "https://localhost:7104/Authenticate/register",
                data,
                config
            );
            console.log(response);
            const token = await response.data.accessToken;


            toast('Kayıt Başarılı. Lütfen Giriş Yapınız', { icon: '👏' });
            setTimeout(() => {
                window.location.reload();
            }, 2000);



        } catch (err) {
            if (err && err instanceof AxiosError)
                setError(err.response?.data.message);
            else if (err && err instanceof Error) setError(err.message);
            toast.error("Hatalı Giriş");
            console.log("Error: ", err);
        }
        finally {
            setIsButtonDisabled(false);
        }
    };

    const registerFormik = useFormik({
        initialValues: {
            username: "",
            email: "",
            password: "",
        },
        onSubmit,


    });
    const registerhelperEmail = React.useMemo(() => {
        if (!registerFormik.values.email)
            return {
                text: "",
                color: "",
            };
        const isEmailValid = validateEmail(registerFormik.values.email);
        return {
            text: isEmailValid ? "Doğru Eposta" : "Emailinizi doğru giriniz",
            color: isEmailValid ? "success" : "error",
        };
    }, [registerFormik.values.email]);

    const registerhelperPassword = React.useMemo(() => {
        if (!registerFormik.values.password)
            return {
                text: "",
                color: "",
            };
        const isValid = validatePassword(registerFormik.values.password);


        return {
            text: isValid ? "Doğru Şifre" : "Şifreniz en az 8 en fazla 20 karakter olmalı",
            color: isValid ? "success" : "error",
        };
    }, [registerFormik.values.password]);

    return (
        <form onSubmit={registerFormik.handleSubmit} className="w-80 flex flex-col">

            <Input
                clearable
                shadow={false}
                status="default"
                onClearClick={reset}
                name="username"
                value={registerFormik.values.username}
                onChange={registerFormik.handleChange}
                onBlur={registerFormik.handleBlur}
                type="username"
                labelPlaceholder="Kullanıcı Adı"


            />
            <Spacer y={2} />
            <Input
                {...bindings}
                clearable
                shadow={false}
                onClearClick={reset}
                status={registerhelperEmail.color}
                color={registerhelperEmail.color}
                helperColor={registerhelperEmail.color}
                helperText={registerhelperEmail.text}
                name="email"
                value={registerFormik.values.email}
                onChange={registerFormik.handleChange}
                onBlur={registerFormik.handleBlur}
                type="email"
                labelPlaceholder="Email"

            />
            <Spacer y={2} />

            <Input.Password
                clearable
                type="password"
                status={registerhelperPassword.color}
                color={registerhelperPassword.color}
                helperColor={registerhelperPassword.color}
                helperText={registerhelperPassword.text}
                name="password"
                onBlur={registerFormik.handleBlur}
                labelPlaceholder="Şifre"
                value={registerFormik.values.password}
                onChange={registerFormik.handleChange}

            />
            <Spacer y={2} />

            <Button flat color="primary" type="submit" disabled={isButtonDisabled}>
                Kayıt Ol
            </Button>
            <Toaster />
        </form>
    )
}
