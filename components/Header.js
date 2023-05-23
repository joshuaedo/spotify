import { getSession } from "next-auth/react";
import { signOut, useSession } from "next-auth/react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  LogoutIcon,
} from "@heroicons/react/solid";
import LibraryIcon from "assets/images/image.webp";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { HomeIcon, SearchIcon } from "@heroicons/react/solid";

export default function Header() {
  const { data: session } = useSession();
  const [showDiv, setShowDiv] = useState(false);
  const toggleDiv = () => {
    setShowDiv(!showDiv);
  };
  return (
    <header className="absolute top-3 right-3 z-50">
      <div className="flex items-center bg-black space-x-3  cursor-pointer rounded-full p-1 pr-2 text-white font-bold">
        {session?.user.image ? (
          <Image
            src={session?.user.image}
            width={27}
            height={27}
            alt="User"
            className="rounded-full"
          />
        ) : (
          <Image
            src="https://i1.wp.com/similarpng.com/wp-content/plugins/userswp/assets/images/no_profile.png?ssl=1"
            width={27}
            height={27}
            alt="User"
            className="rounded-full"
          />
        )}
        <p>{session?.user.name}</p>

        {showDiv ? (
          <ChevronUpIcon
            className="h-5 w-5 opacity-90 hover:opacity-60"
            onClick={toggleDiv}
          />
        ) : (
          <ChevronDownIcon
            className="h-5 w-5 opacity-90 hover:opacity-60"
            onClick={toggleDiv}
          />
        )}
      </div>
      {showDiv && (
        <>
          <motion.div
            className=" bg-black space-y-2  cursor-pointer rounded p-2 text-white m-1 text-sm "
            initial={{
              opacity: 0,
              y: 50,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
          >
            <button>
              <Link
                href="/search"
                className="hover:opacity-90 flex text-white "
              >
                <button className="flex items-center space-x-2  font-bold">
                  <span>Search</span>
                  <div className="h-6 w-6">
                    <SearchIcon
                      className="h-6 w-6"
                      width={54}
                      height={54}
                      alt="Link to search songs"
                    />
                  </div>
                </button>
              </Link>
            </button>

            <hr className="pr-5" />

            <button>
              <Link href="/" className="hover:opacity-90 flex text-white ">
                <button className="flex items-center space-x-2  font-bold">
                  <span>Library</span>
                  <div className="h-6 w-6">
                    <Image
                      src={LibraryIcon}
                      width={24}
                      height={24}
                      alt="Link to your library"
                    />
                  </div>
                </button>
              </Link>
            </button>

            <hr className="pr-5" />

            <button className="flex items-center space-x-2  font-bold hover:opacity-90">
              <p>Log out</p>
              <div className="h-6 w-6 pr-5" onClick={() => signOut()}>
                <LogoutIcon width={24} height={24} alt="Log Out" />
              </div>
            </button>
          </motion.div>
        </>
      )}
    </header>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
