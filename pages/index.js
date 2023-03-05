import { getSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { shuffle } from "lodash";
import { useRecoilValue, useRecoilState } from "recoil";
import { playlistIdState, playlistState } from "@/atom/playlistAtom";
import useSpotify from "@/hooks/useSpotify";
import { LogoutIcon } from "@heroicons/react/outline";
import useDeviceSize from "@/hooks/useDeviceSize";
import Link from "next/link";
import Player from "@/components/Player";
import "bootstrap/dist/css/bootstrap.min.css";
// import WebPackPlayer from '@/components/WebPackPlayer';

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-yellow-500",
  "from-purple-500",
  "from-pink-500",
  "from-orange-500",
  "from-red-500",
];

export default function Home() {
  const [playlists, setPlaylists] = useState([]);
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);

  const [playlist, setPlaylist] = useRecoilState(playlistState);

  const [showDiv, setShowDiv] = useState(false);

  const toggleDiv = () => {
    setShowDiv(!showDiv);
  };

  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [color, setColor] = useState(null);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        setPlaylists(data.body.items);
      });
    }
  }, [session, spotifyApi]);

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [playlistId]);

  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistId)
      .then((data) => {
        setPlaylist(data.body);
      })
      .catch((err) => console.error("something went wrong", err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spotifyApi, playlistId]);

  const [width, height] = useDeviceSize();

  const backgroundImageUrl = {
    url: session?.user.image,
  };

  const isMobile = width <= 767;
  return (
    <>
      <Head>
        <title>Spotify - Your Library</title>
        <meta name="description" content="A spotify clone made with Next.js" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="h-screen overflow-hidden">
        <div className="center flex-grow h-screen overflow-y-scroll scrollbar-hide bg-[#121212]">
          <header className="absolute top-5 right-8 z-20">
            <div
              className="flex items-center bg-[#121212] space-x-2  cursor-pointer rounded pl-3 p-2 text-white m-1 text-sm hover:opacity-80"
              onClick={() => signOut()}
            >
              Log out <LogoutIcon className=" pl-1 h-5 w-5 hover:scale-110" />
            </div>
          </header>

          <section
            className={`space-y-5 bg-[#202020] h-60   text-white p-8  `}
            style={{
              backgroundImage: isMobile && `url(${backgroundImageUrl.url})`,
              backgroundSize: "cover",
            }}
          >
            <div className="pt-9 md:pt-0">
              <div className="space-y-4 flex">
                <div className="">
                  <Image
                    src={session?.user.image}
                    width={176}
                    height={176}
                    className=" hidden md:block rounded-full m-auto shadow-2xl"
                    aspectRatio={1 / 1}
                    alt="User"
                  />
                </div>

                <div className=" sm:mt-7 md:pl-10 ">
                  <h2 className="text-6xl lg:text-8xl font-bold ">
                    Your Library
                  </h2>
                  <p className="text-xs opacity-70">
                    All your {playlists?.length} favorite playlists from Spotify
                  </p>
                </div>
              </div>
            </div>
          </section>

          <>
            <div className="">
              <div className="row">
                {playlists?.map((playlist) => (
                  <div className="col d-flex align-items-center justify-content-center ">
                    <Link
                      href={`/playlist/${playlist.id}`}
                      key={playlist.id}
                      onClick={() => setPlaylistId(playlist.id)}
                    >
                      <div className="card">
                        <div className="text-gray-500">
                          <Image
                            src={playlist.images[0].url}
                            width={244}
                            height={244}
                            alt={playlist.name}
                            className="card--img shadow-2xl"
                          />
                          <div className="card--text truncate  cursor-pointer mt-3">
                            <p className="w-36 lg:w-64 text-white font-bold m-0">
                              {" "}
                              {playlist.name}
                            </p>
                            <p className="">
                              by{" "}
                              {playlist.owner.display_name &&
                                playlist.owner.display_name.toLowerCase()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </>
          {/* Default Player */}
          <Player />

          {/* WebPack Player */}
          {/* <div>
          <WebPackPlayer />
        </div> */}
        </div>
      </div>
    </>
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
