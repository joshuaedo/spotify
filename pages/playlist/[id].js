/* eslint-disable react-hooks/exhaustive-deps */
import { getSession } from "next-auth/react";
import Sidebar from "@/components/Sidebar";
import Player from "@/components/Player";
import Header from "@/components/Header";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  LogoutIcon,
} from "@heroicons/react/solid";
import { useState, useEffect } from "react";
import { shuffle } from "lodash";
import { useRecoilValue, useRecoilState } from "recoil";
import { playlistIdState, playlistState } from "@/atom/playlistAtom";
import useSpotify from "@/hooks/useSpotify";
import Songs from "@/components/Songs";
import useDeviceSize from "@/hooks/useDeviceSize";
import Head from "next/head";
import Favorite from "assets/icons/favorite.png";
import Play from "assets/icons/play.png";
import { isPlayingState } from "@/atom/songAtom";
import useSongInfo from "@/hooks/useSongInfo";
// import WebPackPlayer from '@/components/WebPackPlayer';

export default function Playlist() {
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
  const spotifyApi = useSpotify();
  const [color, setColor] = useState(null);
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [width, height] = useDeviceSize();
  const isMobile = width <= 767;
  const songInfo = useSongInfo();
  const [pageTitle, setPageTitle] = useState(songInfo?.album.name);
  const playPlaylist = () => {
    spotifyApi.play({
      context_uri: `https://open.spotify.com/playlist/${playlist.id}`,
    });
    setIsPlaying(true);
  };

  useEffect(() => {
    if (!isPlayingState) {
      setPageTitle(playlist?.name);
    } else {
      setPageTitle(songInfo?.name + " • " + songInfo?.artists[0].name);
    }
  }, [isPlayingState, playlist?.name, songInfo?.album.name]);
  useEffect(() => {
    setColor(shuffle(colors).pop());
    setPageTitle(playlist?.name);
  }, [playlistId]);
  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistId)
      .then((data) => {
        setPlaylist(data.body);
      })
      .catch((err) => console.error("something went wrong", err));
  }, [spotifyApi, playlistId]);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="A spotify clone made with Next.js" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="h-screen overflow-hidden">
        <Header />
        <main className="flex">
          {/* Sidebar */}
          <Sidebar />
          <div className="center flex-grow h-screen overflow-y-scroll scrollbar-hide bg-[#121212]">
            {/* Drop-Down Toggle Menu */}

            {/* Hero */}
            <section
              className={`flex items-end bg-gradient-to-b to-[#121212] ${color} h-80 text-white p-8 `}
              style={{
                backgroundImage:
                  isMobile && `url(${playlist?.images?.[0].url})`,
                backgroundSize: "cover",
              }}
            >
              <Image
                src={playlist?.images?.[0].url}
                width={220}
                height={220}
                className="shadow-2xl mr-4 hidden md:block rounded"
                alt=""
              />

              <div className="space-y-4">
                <p className="text-xs font-bold">PLAYLIST</p>
                <h2 className="text-5xl lg:text-6xl font-bold">
                  {playlist?.name}
                </h2>

                <div>
                  <p className="text-xs opacity-70">
                    {playlist?.description.includes("href")
                      ? null
                      : playlist?.description}
                  </p>

                  <span className="font-bold">
                    {playlist?.owner.display_name} •{" "}
                  </span>
                  <span>
                    {playlist?.followers.total.toLocaleString("en-US")}{" "}
                    followers •{" "}
                  </span>
                  <span>{playlist?.tracks.total} songs</span>
                </div>
              </div>
            </section>

            <div>
              <div className="flex space-x-4 md:space-x-6 items-center">
                <Image
                  src={Play}
                  alt="Playlist"
                  className="cursor-pointer animate-bounce temporary-bounce"
                  onClick={playPlaylist}
                />
                <Image
                  src={Favorite}
                  alt="Favorite"
                  contain="true"
                  className="w-10 h-10 hidden md:inline"
                />
                <span className="text-2xl md:text-5xl text-gray-500 pb-5 hover:text-white hidden md:inline">
                  ...
                </span>
                {/* Songs */}
              </div>
              <Songs />
            </div>
          </div>
        </main>

        {/* Default Player */}
        <Player />

        {/* WebPack Player */}
        {/* <div>
          <WebPackPlayer />
        </div> */}
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
