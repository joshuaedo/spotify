import { currentTrackIdState } from '@/atom/songAtom';
import useSpotify from '@/hooks/useSpotify';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { isPlayingState } from '@/atom/songAtom';
import Image from 'next/image';
import useSongInfo from '@/hooks/useSongInfo';
import { playerIcons } from './playerIcons';
import { ArrowSmUpIcon } from '@heroicons/react/outline';

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
    lyrics,
  ] = playerIcons;

  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);
  const songInfo = useSongInfo();
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
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setVolume(50);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackId, spotifyApi, session]);

  return (
    <div className='h-24 bg-[#181818] text-white grid '>
      <div className='stay space-x-4 grid grid-cols-3 gap-12 px-2 md:8 '>
        {/* Left */}
        <div className='stay text-xs md:text-base space-x-4'>
          <Image
            src={songInfo?.album.images?.[0]?.url}
            alt={songInfo?.album.name}
            width={68}
            height={68}
            className='h-12 w-12'
          />
          <div className='hidden lg:block'>
            <h1 className='text-gray-100 text-clip font-medium text-sm'>
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
            className='w-5'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15'
            />
          </svg>
        </div>

        {/* Center */}
        <div className='stay space-x-10 items-center justify-center'>
          <Image
            src={shuffle}
            alt='shuffle'
            className='button'
            onClick={() => spotifyApi.setShuffle()}
          />
          <Image
            src={previous}
            alt='previous'
            className='button'
            onClick={() => spotifyApi.skipToPrevious()}
          />
          {/* Play/Pause */}
          <Image
            src={next}
            alt='next'
            className='button '
            onClick={() => spotifyApi.skipToNext()}
          />
          <Image
            src={repeat}
            alt='repeat'
            className='button'
            onClick={() => spotifyApi.setRepeat()}
          />
        </div>

        {/* Right */}
        <div className='stay space-x-5 justify-end'>
          <Image src={lyrics} alt='lyrics' className='button res-icon' />
          <Image src={queue} alt='queue' className='button res-icon' />
          <Image
            src={connectDevice}
            alt='connectDevice'
            className='button res-icon'
          />
          <Image src={volumeIcon} alt='volumeIcon' className='button' />
          {/* Volume control */}
          <Image
            src={fullScreen}
            alt='fullScreen'
            className='button res-icon'
          />
        </div>
      </div>
    </div>
  );
}

export default Player;
