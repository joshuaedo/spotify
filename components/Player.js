/* eslint-disable react-hooks/exhaustive-deps */
import { currentTrackIdState } from "@/atom/songAtom";
import useSpotify from "@/hooks/useSpotify";
import { useCallback, useEffect, useState } from "react";
import { isPlayingState } from "@/atom/songAtom";
import Image from "next/image";
import useSongInfo from "@/hooks/useSongInfo";
import { playerIcons } from "./playerIcons";
import {
  PauseIcon,
  PlayIcon,
  VolumeOffIcon,
  ShareIcon,
} from "@heroicons/react/outline";
import MediaShare from "./MediaShare";
import { motion } from "framer-motion";
import { debounce } from "lodash";
import { useSession } from "next-auth/react";
import { shuffle } from "lodash";
import { useRecoilValue, useRecoilState } from "recoil";
import { playlistIdState, playlistState } from "@/atom/playlistAtom";
import FullPlayer from "./FullPlayer";
import Lyrics from "./Lyrics";
import TwitterLike from "@/components/TwitterLike";

export default function Player() {
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
  const [
    connectDevice,
    like,
    next,
    previous,
    queue,
    repeat,
    shuffleIcon,
    volumeIcon,
    fullScreen,
    myLyrics,
    favorite,
  ] = playerIcons;
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [color, setColor] = useState(null);
  const [playlistId, setPlaylistId] = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const songInfo = useSongInfo();
  const [pageTitle, setPageTitle] = useState(songInfo?.album.name);
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [volume, setVolume] = useState(100);

  // const [showLike, setShowLike] = useState(false);

  const debouncedAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch((err) => {});
    }, 500),
    []
  );
  const [isFullScreen, setIsFullScreen] = useState(false);
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };
  const [isLyricsPlayer, setLyricsPlayer] = useState(false);
  const toggleLyricsPlayer = () => {
    setLyricsPlayer(!isLyricsPlayer);
  };
  const [isMediaShare, setIsMediaShare] = useState(false);
  const toggleMediaShare = () => {
    setIsMediaShare(!isMediaShare);
  };

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

  // const toggleLike = () => {
  //   setShowLike(!showLike);
  // };
  const fetchCurrentSong = () => {
    spotifyApi.getMyCurrentPlayingTrack().then((data) => {
      setCurrentTrackId(data.body?.item.id);
      console.log("Now playing this song:", data.body?.item);

      spotifyApi.getMyCurrentPlaybackState().then((data) => {
        setIsPlaying(data.body?.is_playing);
      });
    });
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
    const fetchData = () => {
      fetchCurrentSong();
    };

    // Call the fetchData function immediately
    fetchData();

    // Call the fetchData function every 5 seconds
    const intervalId = setInterval(fetchData, 5000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [spotifyApi, playlistId, currentTrackId, session, songInfo]);
  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume);
    }
  }, [volume]);

  return (
    <>
      {/* Lyrics Player */}
      {isLyricsPlayer && <Lyrics toggleLyricsPlayer={toggleLyricsPlayer} />}

      {/* Fullscreen Player */}
      {isFullScreen && (
        <div className="fixed inset-0 bg-[#121212] z-50 h-screen">
          <FullPlayer toggleFullScreen={toggleFullScreen} />
        </div>
      )}

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

      {/* Default Player */}
      {songInfo && (
        <div
          className="fixed w-full bottom-0 h-24 bg-[#181818] text-white grid "
          onDoubleClick={toggleFullScreen}
        >
          <div className="stay space-x-4 grid grid-cols-4 md:grid-cols-3 gap-0 md:gap-12 px-0 md:px-2">
            {/* Left */}
            <div className="col-span-4 md:col-span-1 stay text-xs md:text-base space-x-4">
              <Image
                src={songInfo?.album.images?.[0]?.url}
                alt={songInfo?.album.name}
                width={68}
                height={68}
                className="h-12 w-12"
              />
              <div className="pr-12 md:pr-0">
                <h1 className="text-gray-100 text-clip font-medium text-xs md:text-sm">
                  {songInfo?.name}
                </h1>
                <p className="text-gray-400 text-clip text-xs">
                  {songInfo?.artists[0]?.name}
                </p>
              </div>
              {/* {showLike ? (
                <Image
                  src={favorite}
                  alt="You just liked this song!"
                  className="button res-icon motion-safe:animate-ping 1s linear 1"
                  onClick={toggleLike}
                />
              ) : (
                <Image
                  src={like}
                  alt="like"
                  className="button res-icon"
                  onClick={toggleLike}
                />
              )} */}
              <TwitterLike />
              <ShareIcon
                className="button res-icon"
                onClick={toggleMediaShare}
              />

              <div className="absolute inset-y-5 right-2 flex md:hidden">
                {isPlaying ? (
                  <PauseIcon
                    onClick={handlePlayPause}
                    className="button w-14 h-14"
                  />
                ) : (
                  <PlayIcon
                    onClick={handlePlayPause}
                    className="button w-14 h-14"
                  />
                )}
              </div>
            </div>

            {/* Center */}
            <div className=" hidden md:inline col-span-1  ">
              <div className="stay space-x-10 items-center justify-center">
                <Image
                  src={shuffleIcon}
                  alt="shuffle"
                  className="button res-icon"
                  onClick={handleShuffle}
                />
                <Image
                  src={previous}
                  alt="previous"
                  className="button res-icon"
                  onClick={() => spotifyApi.skipToPrevious()}
                />
                {isPlaying ? (
                  <PauseIcon
                    onClick={handlePlayPause}
                    className="button w-14 h-14"
                  />
                ) : (
                  <PlayIcon
                    onClick={handlePlayPause}
                    className="button w-14 h-14"
                  />
                )}
                <Image
                  src={next}
                  alt="next"
                  className="button res-icon"
                  onClick={() => spotifyApi.skipToNext()}
                />
                <Image
                  src={repeat}
                  alt="repeat"
                  className="button res-icon"
                  onClick={handleRepeat}
                />
              </div>
            </div>

            {/* Right */}
            <div className="hidden xl:inline col-span-1 ">
              <div className="stay space-x-5 justify-end ">
                <Image
                  src={myLyrics}
                  alt="lyrics"
                  className="button res-icon"
                  onClick={toggleLyricsPlayer}
                />
                <Image
                  src={queue}
                  alt="queue"
                  className="h-4 w-4 cursor-not-allowed res-icon"
                />
                <Image
                  src={connectDevice}
                  alt="connectDevice"
                  className="h-4 w-4 cursor-not-allowed res-icon"
                />
                {/* Volume control */}
                <VolumeOffIcon
                  className="button text-gray-300 res-icon"
                  onClick={() => volume > 0 && setVolume(volume - 10)}
                />
                <input
                  className=" accent-gray-300 hover:accent-[#13a34a] res-icon border-none outline-none focus:ring-transparent cursor-pointer"
                  type="range"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  min={0}
                  max={100}
                ></input>
                <Image
                  src={volumeIcon}
                  alt="volumeIcon"
                  className="button res-icon"
                  onClick={() => volume < 100 && setVolume(volume + 10)}
                />

                <Image
                  src={fullScreen}
                  alt="fullScreen"
                  className="button res-icon"
                  onClick={toggleFullScreen}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
