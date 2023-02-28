/* eslint-disable react-hooks/exhaustive-deps */
import { getSession } from 'next-auth/react';
import Sidebar from '@/components/Sidebar';
import Player from '@/components/Player';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  LogoutIcon,
} from '@heroicons/react/solid';
import { useState, useEffect } from 'react';
import { shuffle } from 'lodash';
import { useRecoilValue, useRecoilState } from 'recoil';
import { playlistIdState, playlistState } from '@/atom/playlistAtom';
import useSpotify from '@/hooks/useSpotify';
import Songs from '@/components/Songs';
import useDeviceSize from '@/hooks/useDeviceSize';
import Head from 'next/head';
import LibraryIcon from 'assets/images/image.webp';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { isPlayingState } from '@/atom/songAtom';
import useSongInfo from '@/hooks/useSongInfo';

export default function Playlist() {
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
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [color, setColor] = useState(null);
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  const [width, height] = useDeviceSize();
  const isMobile = width <= 767;
  const backgroundImageUrl = {
    url: playlist?.images?.[0].url,
  };
  const songInfo = useSongInfo();
  const [pageTitle, setPageTitle] = useState(songInfo?.album.name);
  const [showDiv, setShowDiv] = useState(false);
  const toggleDiv = () => {
    setShowDiv(!showDiv);
  };
  console.log(songInfo);

  useEffect(() => {
    if (!isPlayingState) {
      setPageTitle(playlist?.name);
    } else {
      setPageTitle(songInfo?.name + ' • ' + songInfo?.artists[0].name);
    }
  }, [isPlayingState, playlist?.name, songInfo?.album.name]);

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

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name='description' content='A spotify clone made with Next.js' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <div className='h-screen overflow-hidden'>
        <main className='flex'>
          {/* Sidebar */}
          <Sidebar />
          <div className='center flex-grow h-screen overflow-y-scroll scrollbar-hide bg-[#121212]'>
            {/* Drop-Down Toggle Menu */}
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
                <>
                  <motion.div
                    className=' bg-black space-y-2  cursor-pointer rounded p-2 text-white m-1 text-sm '
                    initial={{
                      opacity: 0,
                      y: 50,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                  >
                    <div>
                      <Link
                        href='/'
                        className='hover:opacity-90 flex text-white '
                      >
                        <button className='flex items-center space-x-2  font-bold'>
                          <span>Library</span>
                          <div className='h-6 w-6'>
                            <Image
                              src={LibraryIcon}
                              width={24}
                              height={24}
                              alt='Link to your library'
                            />
                          </div>
                        </button>
                      </Link>
                    </div>
                    <hr className='pr-5' />
                    <div className='flex items-center space-x-2  font-bold hover:opacity-90'>
                      <p>Log out</p>
                      <div className='h-6 w-6 pr-5' onClick={() => signOut()}>
                        <LogoutIcon width={24} height={24} alt='Log Out' />
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </header>

            {/* Hero */}
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
                className='shadow-2xl mr-4 hidden md:block rounded'
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

            {/* Songs */}
            <div>
              <Songs />
            </div>
          </div>
        </main>

        {/* Player */}
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
