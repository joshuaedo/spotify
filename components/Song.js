import useSpotify from '@/hooks/useSpotify';
import Image from 'next/image';
import Time from '../lib/time';

function Song({ order, track }) {
  const spotifyApi = useSpotify();
  return (
    <div className='grid grid-cols-2 text-gray-500 py-4 px-5 hover:bg-gray-900 rounded-lg cursor-pointer'>
      <div className='flex items-center space-x-4'>
        <p>{order + 1}</p>
        <Image
          src={track.track.album.images[0].url}
          width={44}
          height={44}
          alt={track.track.album.name}
        />
        <div>
          <p className='w-36 lg:w-64 truncate text-white'>{track.track.name}</p>
          <p className='truncate'>{track.track.artists[0].name}</p>
        </div>
      </div>

      <div className='flex items-center justify-between ml-auto md:ml-0 text-sm'>
        <p className='w-40 hidden md:inline truncate'>
          {track.track.album.name}
        </p>
        <p>{Time(track.track.duration_ms)}</p>
      </div>
    </div>
  );
}

export default Song;
