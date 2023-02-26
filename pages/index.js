import { getSession } from 'next-auth/react';
import Head from 'next/head';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid';
import { useState, useEffect } from 'react';
import { shuffle } from 'lodash';
import { useRecoilValue, useRecoilState } from 'recoil';
import { playlistIdState, playlistState } from '@/atom/playlistAtom';
import useSpotify from '@/hooks/useSpotify';
import { LogoutIcon } from '@heroicons/react/solid';
import useDeviceSize from '@/hooks/useDeviceSize';
import Link from 'next/link';

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

export default function Home() {
  const [playlists, setPlaylists] = useState([]);
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);

  const [playlist, setPlaylist] = useRecoilState(playlistState);

  const [showDiv, setShowDiv] = useState(false);

  const toggleDiv = () => {
    setShowDiv(!showDiv);
  };

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
      .catch((err) => console.error('something went wrong', err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spotifyApi, playlistId]);

  const [width, height] = useDeviceSize();

  const backgroundImageUrl = {
    url: playlist?.images?.[0].url,
  };

  const isMobile = width <= 767;
  return (
    <>
      <Head>
        <title>Spotify - Library</title>
        <meta name='description' content='A spotify clone made with Next.js' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <div className='h-screen overflow-hidden'>
        <div className='center flex-grow h-screen overflow-y-scroll scrollbar-hide bg-[#121212]'>
          <header className='absolute top-5 right-8'>
            <div className='flex items-center bg-black space-x-3  cursor-pointer rounded-full p-1 pr-2 text-white font-bold'>
              <Image
                src={session?.user.image}
                // fill={true}
                // contain={true}
                width={27}
                height={27}
                alt='User'
                className='rounded-full'
              />
              <h2>{session?.user.name}</h2>
              {showDiv ? (
                <ChevronUpIcon
                  className='h-5 w-5 opacity-90 hover:opacity-60'
                  onClick={toggleDiv}
                />
              ) : (
                <ChevronDownIcon
                  className='h-5 w-5 opacity-90 hover:opacity-60'
                  onClick={toggleDiv}
                />
              )}
            </div>
            {showDiv && (
              <div
                className='flex items-center bg-black space-x-2  cursor-pointer rounded pl-3 p-2 text-white m-1 text-sm hover:opacity-90'
                onClick={() => signOut()}
              >
                <p>Log out</p>
                <LogoutIcon className='h-5 w-5 hover:scale-110' />
              </div>
            )}
          </header>

          <section
            className={`flex items-end space-k-7 bg-gradient-to-b to-[#121212] ${color} h-80 text-white p-8 `}
          >
            <div className='space-y-4'>
              <h2 className='text-7xl lg:text-9xl font-bold'>Your Library</h2>

              <div>
                <p className='text-xs opacity-70'>
                  All your {playlists?.length} favorite playlists from Spotify
                </p>
              </div>
            </div>
          </section>

          <div>
            <div className='px-8 flex flex-col pb-28 space-y-1 text-white'>
              {playlists?.map((playlist, order) => (
                <Link
                  href={`/playlist/${playlist.id}`}
                  key={playlist.id}
                  onClick={() => setPlaylistId(playlist.id)}
                >
                  <div className='grid grid-cols-5 text-gray-500 py-4 px-5 hover:bg-gray-900 rounded-lg cursor-pointer'>
                    <div className='flex items-center truncate space-x-4 col-span-4'>
                      <p>{order + 1}</p>
                      <Image
                        src={playlist.images[0].url}
                        width={44}
                        height={44}
                        alt={playlist.name}
                      />
                      <div>
                        <p className='w-36 lg:w-64 text-white'>
                          {' '}
                          {playlist.name}
                        </p>
                        <p className='truncate'>
                          {playlist.owner.display_name}
                        </p>
                      </div>
                    </div>

                    <div className='flex mr-auto md:ml-0 text-sm col-span-1'>
                      <p className='w-40 hidden md:inline truncate'>
                        {playlist?.tracks.total} songs
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
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
