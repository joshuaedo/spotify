/* eslint-disable react-hooks/exhaustive-deps */
import useSpotify from "@/hooks/useSpotify";
import { useEffect, useState } from "react";
import { isPlayingState } from "@/atom/songAtom";
import Image from "next/image";
import useSongInfo from "@/hooks/useSongInfo";
import playerIcons from "./playerIcons";
import { ChevronDownIcon, PauseIcon, PlayIcon } from "@heroicons/react/outline";
import { motion } from "framer-motion";
import { shuffle } from "lodash";
import { useRecoilState } from "recoil";

export default function FullPlayer(props) {
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
  const { next, previous, repeat, shuffleIcon, myLyrics } = playerIcons;
  const spotifyApi = useSpotify();
  const [color, setColor] = useState(null);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const songInfo = useSongInfo();
  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body?.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  };
  const handleShuffle = () => {
    spotifyApi.getMyCurrentPlaybackState().then(function (data) {
      if (data.body?.shuffle_state) {
        spotifyApi.setShuffle(false);
      } else {
        spotifyApi.setShuffle(true);
      }
      console.log(data.body);
    });
  };
  const handleRepeat = () => {
    spotifyApi.getMyCurrentPlaybackState().then(function (data) {
      if (data.body?.repeat_state === "off") {
        spotifyApi.setRepeat("track");
      } else {
        spotifyApi.setRepeat("off");
      }
    });
  };
  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [songInfo]);

  return (
    <div className="text-white flex-grow h-screen overflow-y-scroll scrollbar-hide bg-[#121212]">
      <header className="absolute inset-x-0 top-0 flex space-x-3 space-y-5 justify-evenly md:justify-start">
        <div className="flex ">
          <ChevronDownIcon
            className="h-5 w-5 md:h-10 md:w-10 place-self-center cursor-pointer hover:opacity-75"
            onClick={props.toggleFullScreen}
          />{" "}
        </div>
        <div className="opacity-70 text-center md:text-start text-xs">
          <p className="font-bold inline-block">PLAYING FROM ALBUM</p>
          <p> {songInfo?.album?.name}</p>
        </div>

        <div className="flex p-1">
          <Image
            src={myLyrics}
            alt="lyrics"
            className="button cursor-not-allowed"
          />
        </div>
      </header>

      <section
        className={`grid md:flex bg-gradient-to-b to-[#121212] ${color} text-white p-8 h-2/3 md:h-3/4`}
      >
        <motion.div
          className="space-y-6 place-self-center md:place-self-end block md:flex mt-6 pt-6 md:mt-1 md:pt-1"
          initial={{
            opacity: 0,
            y: -50,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
        >
          <div className="">
            <Image
              src={songInfo?.album.images?.[0]?.url}
              alt={songInfo?.name}
              width={220}
              height={220}
              className="h-72 w-72 md:h-36 md:w-36 shadow-2xl mr-0 md:mr-4 rounded "
            />
          </div>
          <div className="font-bold md:place-self-center">
            <h2 className="text-2xl lg:text-5xl ">{songInfo?.name}</h2>
            <p className="text-gray-400 text-clip text-md">
              {songInfo?.artists[0]?.name}
            </p>
          </div>
        </motion.div>
      </section>

      <section>
        <div className="">
          <div className="stay space-x-10 items-center justify-center p-3 m-1 mt-3 ">
            <Image
              src={shuffleIcon}
              alt="shuffle"
              className="w-5 h-4"
              onClick={handleShuffle}
            />
            <Image
              src={previous}
              alt="previous"
              className="fullscreen-button"
              onClick={() => spotifyApi.skipToPrevious()}
            />
            {isPlaying ? (
              <PauseIcon
                onClick={handlePlayPause}
                className="cursor-pointer hover:opacity-75 w-16 h-16"
              />
            ) : (
              <PlayIcon
                onClick={handlePlayPause}
                className="cursor-pointer hover:opacity-75 w-16 h-16"
              />
            )}
            <Image
              src={next}
              alt="next"
              className="fullscreen-button"
              onClick={() => spotifyApi.skipToNext()}
            />
            <Image
              src={repeat}
              alt="repeat"
              className="w-5 h-4"
              onClick={handleRepeat}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
