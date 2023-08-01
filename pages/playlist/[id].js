/* eslint-disable react-hooks/exhaustive-deps */
import { getSession } from "next-auth/react";
import Sidebar from "@/components/Sidebar";
import Player from "@/components/Player";
import Header from "@/components/Header";
import Image from "next/image";
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
import Pause from "assets/icons/pause.png";
import { isPlayingState } from "@/atom/songAtom";
import useSongInfo from "@/hooks/useSongInfo";
import { ShareIcon } from "@heroicons/react/outline";
import MediaShare from "@/components/MediaShare";
import { motion } from "framer-motion";
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
  const [isMediaShare, setIsMediaShare] = useState(false);
  const toggleMediaShare = () => {
    setIsMediaShare(!isMediaShare);
  };

  const playPlaylist = () => {
    spotifyApi.play({
      context_uri: `https://open.spotify.com/playlist/${playlist.id}`,
    });
    setIsPlaying(true);
  };

  const pausePlaylist = () => {
    spotifyApi.pause();
    setIsPlaying(false);
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
        {/* OpenGraph */}
        <meta property="og:title" content={pageTitle} />
        <meta
          property="og:url"
          content="https://joshuaedo-spotify.vercel.app/"
        />
        <meta
          property="og:image:url"
          content={playlist?.images?.[0].url}
        />

        {/* Twitter  */}
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:image"
          content={playlist?.images?.[0].url}
        />
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
                className="mr-4 hidden md:block rounded shaddy"
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
              <div className="flex space-x-4 md:space-x-6 items-center px-8">
                {isPlaying ? (
                  <Image
                    src={Pause}
                    width={220}
                    height={220}
                    alt="Pause Playlist"
                    className="m-3 w-12 h-12 cursor-pointer animate-bounce temporary-bounce shaddy"
                    onClick={pausePlaylist}
                  />
                ) : (
                  <Image
                    src={Play}
                    width={220}
                    height={220}
                    alt="Play Playlist"
                    className="m-3 w-12 h-12 cursor-pointer animate-bounce temporary-bounce shaddy"
                    onClick={playPlaylist}
                  />
                )}

                <Image
                  src={Favorite}
                  width={220}
                  height={220}
                  alt="Favorite"
                  contain="true"
                  className="w-7 h-7 md:w-10 h-10 m-3 shaddy"
                />
                <ShareIcon
                  className="w-7 h-7 md:w-10 h-10 m-3 shaddy text-gray-300 hover:text-white cursor-pointer"
                  onClick={toggleMediaShare}
                />
                {/* Songs */}
              </div>
              <Songs />
            </div>
          </div>
        </main>

        {/* Default Player */}
        {/* Share on Social Media Screen */}
        {isMediaShare && (
          <motion.div
            className="fixed inset-x-0 bottom-0 bg-black z-20"
            initial={{
              opacity: 0,
              y: -50,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
          >
            <MediaShare toggleMediaShare={toggleMediaShare} />
          </motion.div>
        )}
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
