"use client";
import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { Sparkles } from "lucide-react";

function Header() {
  const { user } = useUser();
  const path = usePathname();
  useEffect(() => {
    console.log(path);
  }, []);

  return (
    <div className="flex p-4 items-center justify-between bg-secondary shadow-md sticky top-0 bg-white text-lg">
      <Link href={"/"} className="flex items-center space-x-2">
        <Image src={"/images/logo.webp"} width={50} height={100} alt="logo" />
        <span className="text-3xl">Interview-Saathi.AI</span>
      </Link>
      <ul className="hidden md:flex gap-6">
        <Link href={"/dashboard"}>
          <li
            className={`hover:text-primary hover:font-bold transition-all
            cursor-pointer
            ${path == "/dashboard" && "text-primary font-bold"}
            `}
          >
            Dashboard
          </li>
        </Link>

        <li
          className={`hover:text-primary hover:font-bold transition-all
            cursor-pointer
            ${path == "/dashboard/questions" && "text-primary font-bold"}
            `}
        >
          Questions
        </li>
        <Link href={"/dashboard/upgrade"}>
          <li
            className={`hover:text-primary hover:font-bold transition-all
            cursor-pointer
            ${path == "/dashboard/upgrade" && "text-primary font-bold"}
            `}
          >
            Upgrade
          </li>
        </Link>
        <Link href={"/#howItWorks"}>
          <li
            className={`hover:text-primary hover:font-bold transition-all
            cursor-pointer
            ${path == "/dashboard/how" && "text-primary font-bold"}
            `}
          >
            How it Works?
          </li>
        </Link>
        <Link href={"/apply/Home"}>
          <li
            className={`hover:text-primary hover:font-bold transition-all
            cursor-pointer flex
            ${path == "/apply/Home" && "text-primary font-bold"}
            `}
          >
            Careers{" "}
            <Sparkles className="text-yellow-300 relative bottom-3 right-1" />
          </li>
        </Link>
      </ul>
      {user?.primaryEmailAddress?.emailAddress != "the.igloo18@gmail.com" && (
        <UserButton />
      )}
    </div>
  );
}

export default Header;
