import { getSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { shuffle } from "lodash";
import { useRecoilState } from "recoil";
import { playlistIdState, playlistState } from "@/atom/playlistAtom";
import useSpotify from "@/hooks/useSpotify";
import Link from "next/link";
import Player from "@/components/Player";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

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

  return (
    <>
      <Head>
        <title>Stream • Your Library</title>
        <meta name="description" content="Your Stream library" />
        {/* OpenGraph */}
        <meta property="og:title" content="Stream • Your Library" />
        <meta
          property="og:url"
          content="https://joshuaedo-spotify.vercel.app/"
        />
        <meta
          property="og:image:url"
          content="https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Spotify_App_Logo.svg/2048px-Spotify_App_Logo.svg.png"
        />

        {/* Twitter  */}
        <meta name="twitter:title" content="Stream • Your Library" />
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:image"
          content="https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Spotify_App_Logo.svg/2048px-Spotify_App_Logo.svg.png"
        />
      </Head>

      <div className="">
        <main className=" h-screen overflow-hidden flex flex-row">
          <Header />
          {/* Sidebar */}
          <Sidebar className="w-[15%]" />
          <div className="center w-[100%] md:w-[85%] h-screen overflow-y-scroll scrollbar-hide bg-[#121212]">
            <section
              className={`space-y-5 bg-[#202020] h-60   text-white p-8  `}
            >
              <div className="pt-9 md:pt-0">
                <div className="space-y-4 flex">
                  <div className=" sm:mt-7 md:pl-10 ">
                    <h2 className="text-6xl xl:text-8xl font-bold ">
                      Your Library
                    </h2>
                    {playlists && (
                      <p className="text-xs opacity-70">
                        All your {playlists?.length} favorite playlists from
                        Spotify
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <>
              {playlists ? (
                <div className="">
                  <div className="row pb-24">
                    {playlists?.map((playlist) => (
                      <div
                        className="col d-flex align-items-center justify-content-center "
                        key={playlist.id}
                      >
                        <Link
                          href={`/playlist/${playlist.id}`}
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
              ) : (
                <p>Don&apos;t have any saved playlists? Try the search page</p>
              )}
            </>
          </div>
        </main>
        <Player />
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
