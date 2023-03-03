/* eslint-disable react-hooks/exhaustive-deps */
import { currentTrackIdState } from '@/atom/songAtom';
import useSpotify from '@/hooks/useSpotify';
import { useCallback, useEffect, useState } from 'react';
import { isPlayingState } from '@/atom/songAtom';
import Image from 'next/image';
import useSongInfo from '@/hooks/useSongInfo';
import { playerIcons } from './playerIcons';
import { ChevronDownIcon, PauseIcon, PlayIcon } from '@heroicons/react/outline';
import { motion } from 'framer-motion';
import { debounce } from 'lodash';
import { useSession } from 'next-auth/react';
import { shuffle } from 'lodash';
import { useRecoilValue, useRecoilState } from 'recoil';
import { playlistIdState, playlistState } from '@/atom/playlistAtom';

export default function FullPlayer(props) {
  const colors = [
    'from-indigo-500',
    'from-blue-500',
    'from-green-500',
    'from-yellow-500',
    'from-purple-500',
    'from-pink-500',
    'from-orange-500',
    'from-red-500',
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
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const songInfo = useSongInfo();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [volume, setVolume] = useState(50);
  const debouncedAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch((err) => {});
    }, 500),
    []
  );
  const [isLyricsPlayer, setLyricsPlayer] = useState(false);
  const toggleLyricsPlayer = () => {
    setLyricsPlayer(!isLyricsPlayer);
  };
  const [isMediaShare, setIsMediaShare] = useState(false);
  const toggleMediaShare = () => {
    setIsMediaShare(!isMediaShare);
  };
  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        setCurrentTrackId(data.body?.item.id);
        console.log('Now playing:', data.body?.item);

        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing);
        });
      });
    }
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
      if (data.body?.repeat_state === 'off') {
        spotifyApi.setRepeat('track');
      } else {
        spotifyApi.setRepeat('off');
      }
    });
  };

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [playlistId]);
  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistId)
      .then((data) => {
        setPlaylist(data.body);
      })
      .catch((err) => console.error('something went wrong', err));
  }, [spotifyApi, playlistId]);
  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume);
    }
  }, [volume]);
  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackId, spotifyApi, session, songInfo]);

  return (
    <div className='text-white flex-grow h-screen overflow-y-scroll scrollbar-hide bg-[#121212]'>
      <header className='absolute inset-x-0 top-0 flex space-x-3 space-y-5 justify-evenly md:justify-start'>
        <div className='flex '>
          <ChevronDownIcon
            className='h-5 w-5 lg:h-10 lg:w-10 place-self-center '
            onClick={props.toggleFullScreen}
          />{' '}
        </div>
        <div className='opacity-70 text-center md:text-start'>
          <p className='text-xs font-bold inline-block'>
            PLAYING FROM PLAYLIST
          </p>
          <p> {playlist?.name}</p>
        </div>

        <div className='flex p-1'>
          <Image
            src={myLyrics}
            alt='lyrics'
            className='button cursor-not-allowed'
          />
        </div>
      </header>

      <section
        className={`grid md:flex bg-gradient-to-b to-[#121212] ${color} text-white p-8 h-2/3 md:h-5/6`}
      >
        <motion.div
          className='space-y-6 place-self-center md:place-self-end block md:flex'
          initial={{
            opacity: 0,
            y: -50,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
        >
          <div className=''>
            <Image
              src={songInfo?.album.images?.[0]?.url}
              alt={songInfo?.name}
              width={220}
              height={220}
              className='h-96 w-96 md:h-36 md:w-36 shadow-2xl mr-0 md:mr-4 rounded '
            />
          </div>
          <div className='font-bold md:place-self-center'>
            <h2 className='text-2xl lg:text-5xl '>{songInfo?.name}</h2>
            <p className='text-gray-400 text-clip text-md'>
              {songInfo?.artists[0]?.name}
            </p>
          </div>
        </motion.div>
      </section>

      <section>
        <div className=''>
          <div className='stay space-x-10 items-center justify-center p-3 m-1'>
            <Image
              src={shuffleIcon}
              alt='shuffle'
              className='fullscreen-button'
              onClick={handleShuffle}
            />
            <Image
              src={previous}
              alt='previous'
              className='fullscreen-button'
              onClick={() => spotifyApi.skipToPrevious()}
            />
            {isPlaying ? (
              <PauseIcon
                onClick={handlePlayPause}
                className='cursor-pointer hover:opacity-75 w-16 h-16'
              />
            ) : (
              <PlayIcon
                onClick={handlePlayPause}
                className='cursor-pointer hover:opacity-75 w-16 h-16'
              />
            )}
            <Image
              src={next}
              alt='next'
              className='fullscreen-button'
              onClick={() => spotifyApi.skipToNext()}
            />
            <Image
              src={repeat}
              alt='repeat'
              className='fullscreen-button'
              onClick={handleRepeat}
            />
          </div>
        </div>
      </section>
      
    </div>
  );
}
