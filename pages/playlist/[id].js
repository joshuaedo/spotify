import { getSession } from 'next-auth/react';
import Sidebar from '@/components/Sidebar';
import Player from '@/components/Player';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid';
import { useState, useEffect } from 'react';
import { shuffle } from 'lodash';
import { useRecoilValue, useRecoilState } from 'recoil';
import { playlistIdState, playlistState } from '@/atom/playlistAtom';
import useSpotify from '@/hooks/useSpotify';
import Songs from '@/components/Songs';
import { LogoutIcon } from '@heroicons/react/solid';
import useDeviceSize from '@/hooks/useDeviceSize';
import Head from 'next/head';

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

export default function Playlist() {
  const [showDiv, setShowDiv] = useState(false);

  const toggleDiv = () => {
    setShowDiv(!showDiv);
  };

  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [color, setColor] = useState(null);
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);

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
        <title>{playlist?.name}</title>
        <meta name='description' content='A spotify clone made with Next.js' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <div className='h-screen overflow-hidden'>
        <main className='flex'>
          <Sidebar />
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
              style={{
                backgroundImage: isMobile && `url(${backgroundImageUrl.url})`,
                backgroundSize: 'cover',
              }}
            >
              <Image
                src={playlist?.images?.[0].url}
                width={220}
                height={220}
                className='shadow-4xl mr-4 hidden md:block rounded'
                alt=''
              />

              <div className='space-y-4'>
                <p className='text-xs font-bold'>PLAYLIST</p>
                <h2 className='text-5xl lg:text-6xl font-bold'>
                  {playlist?.name}
                </h2>

                <div>
                  <p className='text-xs opacity-70'>
                    {playlist?.description.includes('href')
                      ? null
                      : playlist?.description}
                  </p>

                  <span className='font-bold'>
                    {playlist?.owner.display_name} •{' '}
                  </span>
                  <span>
                    {playlist?.followers.total.toLocaleString('en-US')}{' '}
                    followers •{' '}
                  </span>
                  <span>{playlist?.tracks.total} songs</span>
                </div>
              </div>
            </section>

            <div>
              <Songs />
            </div>
          </div>
        </main>
        <div className='sticky bottom-0'>
          <Player />
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


