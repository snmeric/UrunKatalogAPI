import {
  Input,
  useInput,
  Link,
  Grid,
  Spacer,
  Card,
  Text,
  Button,
} from "@nextui-org/react";
import { Loading } from "@nextui-org/react";
import { useSignIn } from "react-auth-kit";
import { useFormik } from "formik";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import COVER_IMAGE from "../../assets/loginbg.png";
import toast, { Toaster } from "react-hot-toast";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import Register from "./Register";

function Login() {
  const signIn = useSignIn();
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState();

  const onSubmit = async (values) => {
   

    setisLoading(true);
    const data = {
      email: values.email,
      password: values.password,
    };

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
      toast("Giriş Başarılı", { icon: "👏" });
      
      const token = await response.data.token.accessToken;
      const username = await response.data.userName;
      signIn({
        token: token,
        expiresIn: 3600,
        tokenType: "Bearer",
        authState: { email: values.email, username: username },
      });

      // navigate("/");
    } catch (error) {
      const errorMessage = error.response.data;
      toast.error(`${errorMessage}`);
      console.error(error);
    } finally {
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
      text: isValid
        ? "Doğru Şifre"
        : "Şifreniz en az 8 en fazla 20 karakter olmalı",
      color: isValid ? "success" : "error",
    };
  }, [formik.values.password]);

  const data = [
    {
      label: "Giriş Yap",
      value: "giris",
      pageContent: () => {
        return (
          <form onSubmit={formik.handleSubmit} className="w-80 flex flex-col ">
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
        );
      },
    },
    {
      label: "Kayıt Ol",
      value: "kayit",
      pageContent: () => {
        return <Register />;
      },
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="rounded-2xl bg-[#E5EDF9] shadow-lg flex max-w-3xl">
        {/* IMAGE */}

        <div className="md:block hidden w-1/2 p-5">
          <img
            src={COVER_IMAGE}
            className="rounded-2xl w-full h-full object-cover"
          ></img>
        </div>

        {/* LOGIN FORM */}

        <div className="md:w-1/2 h-full px-10 p-20 flex flex-col justify-center items-center">
          <div className="w-full flex flex-col items-center justify-center">
            <Tabs value="giris">
              <TabsHeader>
                {data.map(({ label, value }) => (
                  <Tab key={value} value={value}>
                    {label}
                  </Tab>
                ))}
              </TabsHeader>
              <TabsBody>
                {data.map(({ value, pageContent }) => (
                  <TabPanel
                    key={value}
                    value={value}
                    className="h-96 w-full flex flex-col items-center justify-center"
                  >
                    {pageContent()}
                  </TabPanel>
                ))}
              </TabsBody>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
