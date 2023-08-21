/* eslint-disable @next/next/no-img-element */
import type { FC } from "react";
import { Suspense } from "react";
import Link from "next/link";
import { faSignIn, faSignOut } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import type { Session } from "@vujita/auth";
import { auth } from "@vujita/auth";
import cn from "@vujita/classnames";

import ThemeSwitcher from "./theme-switcher";

export const Header: FC = async () => {
  const session = (await auth()) as Session | null;
  return (
    <header className="bg-white-900 fixed w-full border-gray-200 bg-gray-100 shadow-md backdrop-blur-md dark:bg-gray-900">
      <div className="mx-auto flex flex-wrap items-center justify-between p-4">
        <Suspense
          fallback={
            <button
              aria-controls="navbar-user"
              aria-expanded="false"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              type="button"
            >
              {/**
               * TODO: Make this a client componet with a popout drawer
               */}
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 17 14"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1h15M1 7h15M1 13h15"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </button>
          }
        >
          <button
            aria-controls="navbar-user"
            aria-expanded="false"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            type="button"
          >
            {/**
             * TODO: Make this a client componet with a popout drawer
             */}
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 17 14"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1h15M1 7h15M1 13h15"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </button>
        </Suspense>
        <div className="flex items-center space-x-2 md:order-2">
          <ThemeSwitcher />
          <div className={cn("mr-3 flex rounded-full bg-gray-800 md:mr-0")}>
            <div className="relative	h-10 w-10 select-none overflow-hidden rounded-full bg-gray-100 dark:bg-gray-600">
              {session?.user.image ? (
                <img
                  alt="Bordered avatar"
                  className="h-10 w-10 rounded-full"
                  src={session.user.image}
                />
              ) : (
                <svg
                  className="absolute -left-1 h-12 w-12 text-gray-400"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    fillRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </div>
          <Link
            className="h-[32px]"
            href={session ? "/api/auth/signout" : "/api/auth/signin"}
          >
            <FontAwesomeIcon
              className="h-[32px] w-[32px] text-gray-400"
              icon={session ? faSignOut : faSignIn}
            />
          </Link>
        </div>
      </div>
    </header>
  );
};
