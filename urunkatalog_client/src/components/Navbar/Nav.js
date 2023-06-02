import { Navbar, Link, Text, Avatar, Dropdown } from "@nextui-org/react";
import { Layout } from "./Layout.js";
import { AcmeLogo } from "./AcmeLogo.js";
import { useAuthUser, useSignOut } from "react-auth-kit";
import { useNavigate, NavLink } from "react-router-dom";
import { useState } from "react";

export default function Nav() {
    const collapseItems = [
        {
          name: "Ürün OLuştur veya Sil",
          item: "/createProduct",
        },
        {
          name: "Marka, Renk, Kategori",
          item: "/category",
        },
        {
          name: "Teklifler",
          item: "/offer",
        },
        {
          name: "Yardım",
          item: "/",
        },
        {
          name: "Çıkış Yap",
          item: "/logout",
        },
      ];
  const auth = useAuthUser();
  const navigate = useNavigate();
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // Dropdown açık/kapalı durumu

  const handleItemClick = (actionKey) => {
    if (actionKey === "/logout") {
      logout();
    } else {
      
      navigate(`${actionKey}`);
      setIsOpen(false); // Dropdown'u kapat
    }
  };
  const signOut = useSignOut();

  const logout = () => {
    signOut();
    // navigate("/login");
  };

  return (
    <Layout>
      <Navbar isBordered variant="floating">
        <Navbar.Toggle showIn="xs" />
        <Navbar.Brand
          css={{
            "@xs": {
              w: "12%",
              cursor: "pointer",
            },
          }}
          onClick={() => navigate("/")}
        >
          <AcmeLogo />
          <Text b color="inherit" hideIn="xs">
            URUN KATALOG
          </Text>
        </Navbar.Brand>
        <Navbar.Content
          enableCursorHighlight
          activeColor="secondary"
          hideIn="xs"
          variant="highlight"
        >
          <Navbar.Link href="/createProduct">Ürün Oluştur veya Sil</Navbar.Link>
          <Navbar.Link href="/category">Marka, Renk, Kategori</Navbar.Link>
        </Navbar.Content>
        <Navbar.Content
          css={{
            "@xs": {
              w: "12%",
              jc: "flex-end",
            },
          }}
        >
          <Dropdown placement="bottom-right">
            <Navbar.Item>
              <Dropdown.Trigger>
                <Avatar
                  bordered
                  as="button"
                  color="secondary"
                  size="md"
                  src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                />
              </Dropdown.Trigger>
            </Navbar.Item>
            <Dropdown.Menu
              aria-label="User menu actions"
              color="secondary"
              onAction={handleItemClick}
            >
              <Dropdown.Item key="/profile" css={{ height: "$18" }}>
                <Text b color="inherit" css={{ d: "flex" }}>
                  Hoşgeldin {auth().username}
                </Text>
                <Text b color="inherit" css={{ d: "flex" }}>
                  {auth().email}
                </Text>
              </Dropdown.Item>
              <Dropdown.Item key="/offer" withDivider>
                Teklifler
              </Dropdown.Item>

              <Dropdown.Item key="/logout" withDivider color="error" >
                Çıkış Yap
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Content>
        <Navbar.Collapse>
          {collapseItems.map((item, index) => (
            <Navbar.CollapseItem
              key={item.name}
              activeColor="secondary"
              css={{
                color: index === collapseItems.length - 1 ? "$error" : "",
              }}
              isActive={index === selectedItemIndex}
            >
              <Link
                color="inherit"
                css={{
                  minWidth: "100%",
                }}
                href={item.item}
              >
                {item.name}
              </Link>
            </Navbar.CollapseItem>
          ))}
        </Navbar.Collapse>
      </Navbar>
    </Layout>
  );
}
