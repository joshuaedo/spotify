import { playlistIdState } from '@/atom/playlistAtom';
import useSpotify from '@/hooks/useSpotify';
import {
  HomeIcon,
  SearchIcon,
  LibraryIcon,
  HeartIcon,
  RssIcon,
  PlusCircleIcon,
} from '@heroicons/react/solid';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import spotifylogo from 'assets/images/spotify-logo.png';
import Image from 'next/image';
import Link from 'next/link';

function Sidebar() {
  const { data: session, status } = useSession();
  const spotifyApi = useSpotify();
  const [playlists, setPlaylists] = useState([]);
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        setPlaylists(data.body.items);
      });
    }
  }, [session, spotifyApi]);

  // console.log(playlists);

  // console.log('You picked playlist', playlistId);

  return (
    <div className='text-gray-500 text-xs lg:text-sm sm:max-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex pl-5 bg-black overflow-y-scroll scrollbar-hide h-screen'>
      <div className=''>
        <div className='space-y-6'>
          <Link href='/'>
            <Image
              src={spotifylogo}
              width={140}
              className='mt-9'
              alt='spotify-logo'
            />
          </Link>
          <button className='flex items-center space-x-2 text-white font-bold'>
            <HomeIcon className='h-6 w-6' />
            <p>Home</p>
          </button>
          <button className='flex items-center space-x-2 text-white font-bold'>
            <SearchIcon className='h-6 w-6' />
            <p>Search</p>
          </button>
          <button className='flex items-center space-x-2 text-white font-bold'>
            <LibraryIcon className='h-6 w-6' />
            <p>Your Library</p>
          </button>

          <hr className='border-t-(0.1px) border-black' />

          <button className='flex items-center space-x-2 text-white font-bold'>
            <PlusCircleIcon className='h-6 w-6' />
            <p>Create Playlist</p>
          </button>
          <button className='flex items-center space-x-2 text-white font-bold'>
            <HeartIcon className='h-6 w-6' />
            <p>Liked Songs</p>
          </button>
          <button className='flex items-center space-x-2 text-white font-bold'>
            <RssIcon className='h-6 w-6' />
            <p>Your Episodes</p>
          </button>

          <hr className='border-t-(0.1px) border-gray-900 mr-9 pb-5' />
        </div>
        <div className='playlists space-y-4'>
          {playlists.map((playlist) => (
            <p
              key={playlist.id}
              onClick={() => setPlaylistId(playlist.id)}
              className='cursor-pointer hover:text-white'
            >
              {playlist.name}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
