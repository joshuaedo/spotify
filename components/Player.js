/* eslint-disable react-hooks/exhaustive-deps */
import { currentTrackIdState } from '@/atom/songAtom';
import useSpotify from '@/hooks/useSpotify';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { isPlayingState } from '@/atom/songAtom';
import Image from 'next/image';
import useSongInfo from '@/hooks/useSongInfo';
import { playerIcons } from './playerIcons';
import { ChevronDownIcon } from '@heroicons/react/outline';

function Player() {
  const [
    connectDevice,
    like,
    next,
    previous,
    queue,
    repeat,
    shuffle,
    volumeIcon,
    fullScreen,
    myLyrics,
  ] = playerIcons;

  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);
  const songInfo = useSongInfo();
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
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

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackId, spotifyApi, session, songInfo]);

  return (
    <>
      {/* Expanded Player */}
      {isFullScreen && (
        <div className='fixed inset-0 z-50'>
          <div
            className='absolute inset-0 bg-black bg-contain p-10'
            style={{
              backgroundImage: `url(${songInfo?.album.images?.[0]?.url})`,

              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
          >
            <div className='absolute inset-0 bg-black opacity-60'>
              <ChevronDownIcon
                className='h-10 w-10 text-white'
                onClick={toggleFullScreen}
              />
              {/* <div
                className='text-white text-center'
                style={{ whiteSpace: 'pre' }}
              >
                {lyrics}
              </div> */}
            </div>
          </div>
        </div>
      )}

      {/* Default Player */}
      <div
        className='h-24 bg-[#181818] text-white grid '
       onDoubleClick={toggleFullScreen}
      >
        <div className='stay space-x-4 grid grid-cols-4 md:grid-cols-3 gap-0 md:gap-12 px-0 md:px-2'>
          {/* Left */}
          <div className='col-span-4 md:col-span-1 stay text-xs md:text-base space-x-4'>
            <Image
              src={songInfo?.album.images?.[0]?.url}
              alt={songInfo?.album.name}
              width={68}
              height={68}
              className='h-12 w-12'
            />
            <div className='pr-12 md:pr-0'>
              <h1 className='text-gray-100 text-clip font-medium text-xs md:text-sm'>
                {songInfo?.name}
              </h1>
              <p className='text-gray-400 text-clip text-xs'>
                {songInfo?.artists[0]?.name}
              </p>
            </div>
            <Image src={like} alt='like' className='button res-icon' />

            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='button res-icon'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15'
              />
            </svg>
            {/* Play/Pause */}
          </div>

          {/* Center */}
          <div className='col-span-1 stay space-x-10 items-center justify-center hidden md:inline'>
            <Image
              src={shuffle}
              alt='shuffle'
              className='button res-icon'
              onClick={() => spotifyApi.setShuffle()}
            />
            <Image
              src={previous}
              alt='previous'
              className='button res-icon'
              onClick={() => spotifyApi.skipToPrevious()}
            />
            {/* Play/Pause */}
            <Image
              src={next}
              alt='next'
              className='button res-icon'
              onClick={() => spotifyApi.skipToNext()}
            />
            <Image
              src={repeat}
              alt='repeat'
              className='button res-icon'
              onClick={() => spotifyApi.setRepeat()}
            />
          </div>

          {/* Right */}
          <div className='col-span-1 stay space-x-5 justify-end hidden md:inline'>
            <Image
              src={myLyrics}
              alt='lyrics'
              className='button res-icon'
              onClick={toggleFullScreen}
            />
            <Image src={queue} alt='queue' className='button res-icon' />
            <Image
              src={connectDevice}
              alt='connectDevice'
              className='button res-icon'
            />
            <Image
              src={volumeIcon}
              alt='volumeIcon'
              className='button res-icon'
            />
            {/* Volume control */}
            <Image
              src={fullScreen}
              alt='fullScreen'
              className='button res-icon'
              onClick={toggleFullScreen}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Player;
