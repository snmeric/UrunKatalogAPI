import React from "react";
import {
  Navbar,
  MobileNav,
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Card,
  IconButton,
} from "@material-tailwind/react";
import { FaUser } from "react-icons/fa";
import {
  CubeTransparentIcon,
  UserCircleIcon,
  CodeBracketSquareIcon,
  Square3Stack3DIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  InboxArrowDownIcon,
  LifebuoyIcon,
  PowerIcon,
  RocketLaunchIcon,
  Bars2Icon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useAuthHeader, useSignOut } from "react-auth-kit";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";

// profile menu component

function ProfileMenu() {
  const navigate = useNavigate();
  const signOut = useSignOut();
 
  const logout = () => {
    signOut();
   // navigate("/login");
  };


  const profileMenuItems = [
    {
      label: "Profilim",
      icon: UserCircleIcon,
    },

    {
      label: "Teklifler",
      icon: InboxArrowDownIcon,
      onClick: () => {
        navigate("/offer");
      },
    },
    {
      label: "Kategori",
      icon: LifebuoyIcon,
      onClick: () => {
        navigate("/category");
      },
    },
    {
      label: "Çıkış Yap",
      icon: PowerIcon,
      onClick: () => {
        logout();
      },
    },
  ];

 
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const closeMenu = () => setIsMenuOpen(false);


  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          color="blue-gray"
          className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"
        >
         
            {/* <FaUser className="h-6 w-7 to-blue-gray-300" /> */}
       
          <Avatar
            variant="circular"
            size="sm"
            alt="candice wu"
            className="border border-blue-500 p-0.5"
           
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
          />
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3 w-3 transition-transform ${
              isMenuOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </MenuHandler>
      <MenuList className="p-1">
        {profileMenuItems.map(({ label, icon, onClick }, key) => {
          const isLastItem = key === profileMenuItems.length - 1;
          return (
            <MenuItem
              key={label}
              onClick={onClick}
              className={`flex items-center gap-2 rounded ${
                isLastItem
                  ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                  : ""
              }`}
            >
              {React.createElement(icon, {
                className: `h-4 w-4 ${isLastItem ? "text-red-500" : ""}`,
                strokeWidth: 2,
              })}
              <Typography
                as="span"
                variant="small"
                className="font-normal"
                color={isLastItem ? "red" : "inherit"}
              >
                {label}
              </Typography>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
}


// nav list menu
const navListMenuItems = [
  {
    title: "Elektronik",
    description:
      "Bilgisayar/Tablet Yazıcılar & ProjeksiyonTelefon & Telefon Aksesuarları TV, Görüntü & Ses Sistemleri Beyaz Eşya Klima ve Isıtıcılar Elektrikli Ev Aletleri Foto & Kamera Oyun & Oyun Konsolları",
  },
  {
    title: "Moda",
    description:
      "Elbise Triko & Kazak Kaban, Mont Sweatshirt Bluz Gömlek Pantolon",
  },
  {
    title: "Ev, Yaşam, Kırtasiye, Ofis",
    description: "Yemek & Kahvaltı Takımı, Abajur, Masa Lambası, Ampul ",
  },
];


// nav list component
const navListItems = [
  {
    label: "Hesap",
    icon: UserCircleIcon,
    
  },
  {
    label: "Ürün",
    icon: CubeTransparentIcon,
    title:"/createProduct"
  },
 
];

function NavList() {
  
  return (
    <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
      {/* <NavListMenu /> */}
      {navListItems.map(({ label, icon, title }, key) => (
        <Typography
          key={label}
          as="a"
          href={title}
          variant="small"
          color="blue-gray"
          className="font-normal"
        >
          <MenuItem className="flex items-center gap-2 lg:rounded-full">
            {React.createElement(icon, { className: "h-[18px] w-[18px]" })}{" "}
            {label}
          </MenuItem>
        </Typography>
      ))}
    </ul>
  );
}

export default function ComplexNavbar() {
  const [isNavOpen, setIsNavOpen] = React.useState(false);
  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setIsNavOpen(false)
    );
  }, []);

  return (
    <Navbar className="mt-8 mx-auto max-w-screen-xl p-2 lg:rounded-full lg:pl-6">
      <div className="relative mx-auto flex items-center text-blue-gray-900">
        <Typography
      
          as="a"
          href="/"
          className="mr-4 ml-2 cursor-pointer py-1.5 font-bold"
        >
          Ürün Katalog Projem
        </Typography>
        <div className="absolute top-2/4 left-2/4 hidden -translate-x-2/4 -translate-y-2/4 lg:block">
          <NavList />
        </div>
        <IconButton
          size="sm"
          color="blue-gray"
          variant="text"
          onClick={toggleIsNavOpen}
          className="ml-auto mr-2 lg:hidden"
        >
          <Bars2Icon className="h-6 w-6" />
        </IconButton>
        <ProfileMenu />
      </div>
      <MobileNav open={isNavOpen} className="overflow-scroll">
        <NavList />
      </MobileNav>
    </Navbar>
  );
}