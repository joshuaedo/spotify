import { getSession } from 'next-auth/react';
import Sidebar from '@/components/Sidebar';
import Center from '@/components/Center';
import Head from 'next/head';
export default function Home() {
  return (
    <>
      <Head>
        <title>Spotify</title>
        <meta name='description' content='A spotify clone made with Next.js' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <div className='bg-black h-screen overflow-hidden'>
        <main className='flex'>
          <Sidebar />
          <Center />
        </main>
        <div>{/* Player */}</div>
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
