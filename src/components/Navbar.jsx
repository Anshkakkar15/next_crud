"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import Link from "next/link";

export const Navbar = () => {
  const { data } = useSession();
  const user = data?.user;
  return (
    <header>
      <nav className="bg-gray-900 px-4 lg:px-6 py-2.5">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <a href="/" className="flex items-center">
            <span className="self-center text-xl font-semibold whitespace-nowrap text-white">
              NextCrud
            </span>
          </a>
          <div className="flex items-center lg:order-2">
            {user ? (
              <>
                <span className="mr-4 text-white">
                  Welcome, {user.username || user.email}
                </span>
                <Button
                  onClick={() => signOut()}
                  className="w-full md:w-auto bg-slate-100 text-black"
                  variant="outline"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link href={"/sign-in"}>
                <Button className=" text-white font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2hover:bg-gray-700 focus:outline-nonefocus:ring-gray-800">
                  Sign in
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};
