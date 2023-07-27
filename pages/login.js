import Head from 'next/head';
import Image from 'next/image';
import { getProviders, signIn } from 'next-auth/react';
import spotifyLogo from 'assets/images/spotify.png';

function login({ providers }) {
  return (
    <>
      <Head>
        <title>Stream</title>
        <meta name='description' content='Listen to any song, anywhere' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <div className='flex  flex-col items-center bg-black min-h-screen w-full justify-center'>
        <Image
          width={''}
          height={''}
          src={spotifyLogo}
          alt='spotify-logo'
          className='w-52 mb-5'
        />

        <div>
          <button
            className='bg-[#13a34a] text-gray-200 p-5 rounded-full shadow-inner font-semibold hover:bg-[#13a33a]'
            onClick={() =>
              signIn('spotify', {
                callbackUrl: '/',
              })
            }
          >
            Login with Spotify
          </button>
        </div>

        {/* {providers &&
          providers.length &&
          Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <button
                className='bg-[#18D860] text-white p-5 rounded-full'
                onClick={() => signIn(provider.id)}
              >
                Login with {provider.name}
              </button>
            </div>
          ))} */}
      </div>
    </>
  );
}

export default login;

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}
