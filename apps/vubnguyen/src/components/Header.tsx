import { Suspense, type FC } from "react";
import Link from "next/link";
import { faSignIn, faSignOut } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar } from "vujita-ui/avatar";

import { auth } from "@vujita/auth";
import ThemeSwitcher from "@vujita/vubnguyen/src/components/theme-switcher";

export const Header: FC = async () => {
  const session = await auth();

  return (
    <header className="bg-white-900 fixed w-full select-none border-gray-200 bg-gray-100 shadow-md backdrop-blur-md dark:bg-gray-900">
      <div className="mx-auto flex flex-wrap items-center justify-between p-2">
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
          <Avatar
            className="flexBasis mr-3"
            placeholder={session?.user?.name ?? "?"}
            size="xs"
            src={session?.user?.image}
          />
          <Link
            className="h-[28] w-[28]"
            href={session ? "/api/auth/signout" : "/api/auth/signin"}
            prefetch={false}
          >
            <FontAwesomeIcon
              className="h-[28px] w-[28px] text-gray-400"
              icon={session ? faSignOut : faSignIn}
            />
          </Link>
        </div>
      </div>
    </header>
  );
};
