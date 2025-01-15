import React from "react";
import HeaderItem from "./HeaderItem";
import { HiOutlineUser } from "react-icons/hi";
import { FaChessBoard, FaChessKnight, FaChess } from "react-icons/fa";
function Header() {
  const menu = [
    {
      name: "Data",
      link: "/Data",
      Icon: FaChessKnight,
    },
    {
      name: "Global",
      link: "/Global",
      Icon: FaChess,
    },
    {
      name: "Analysis",
      link: "/Analysis",
      Icon: FaChessBoard,
    },
    {
      name: "",
      link: "/Register",
      Icon: HiOutlineUser,
    },
  ];

  return (
     <header className="bg-black text-white border-b border-white/20">
      <nav className="container mx-auto px-2 sm:px-4">
        <ul className="flex items-center justify-between">
          {menu.map((item) => (
            <li key={item.name} className="flex-1">
              <HeaderItem name={item.name} Icon={item.Icon} link={item.link} />
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
