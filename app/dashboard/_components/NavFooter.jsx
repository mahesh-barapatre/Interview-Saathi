"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { Info, LayoutDashboard, Plus, UserRoundSearch } from "lucide-react";

function NavFooter() {
  const path = usePathname();
  useEffect(() => {
    console.log(path);
  }, []);

  return (
    <div className="m-auto flex items-center justify-between bg-secondary shadow-md bg-blue-100 py-2 text-xs z-50">
      <ul className="gap-6 w-full flex flex-row justify-evenly items-center">
        <Link href={"/dashboard"}>
          <li
            className={`hover:text-primary hover:font-bold transition-all items-center flex flex-col
            cursor-pointer
            ${path == "/dashboard" && "text-primary font-bold"}
            `}
          >
            <LayoutDashboard />
            Dashboard
          </li>
        </Link>

        {/* <li
          className={`hover:text-primary hover:font-bold transition-all
            cursor-pointer
            ${path == "/dashboard/questions" && "text-primary font-bold"}
            `}
        >
          Questions
        </li> */}
        <Link href={"/dashboard/upgrade"}>
          <li
            className={`hover:text-primary hover:font-bold transition-all items-center flex flex-col
            cursor-pointer
            ${path == "/dashboard/upgrade" && "text-primary font-bold"}
            `}
          >
            <Plus />
            Upgrade
          </li>
        </Link>
        <Link href={"/#howItWorks"}>
          <li
            className={`hover:text-primary hover:font-bold transition-all items-center flex flex-col
            cursor-pointer
            ${path == "/dashboard/how" && "text-primary font-bold"}
            `}
          >
            <Info />
            How it Works?
          </li>
        </Link>
        <Link href={"/apply/Home"}>
          <li
            className={`hover:text-primary hover:font-bold transition-all items-center flex flex-col
            cursor-pointer
            ${path == "/apply/Home" && "text-primary font-bold"}
            `}
          >
            <UserRoundSearch />
            Careers{" "}
          </li>
        </Link>
      </ul>
    </div>
  );
}

export default NavFooter;
