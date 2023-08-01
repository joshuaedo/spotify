import Head from "next/head";
import Image from "next/image";
import { getProviders, signIn } from "next-auth/react";
import spotifyLogo from "assets/images/spotify.png";

function login({ providers }) {
  return (
    <>
      <Head>
        <title>Stream</title>
        <meta name="description" content="Listen to any song, anywhere" />
        {/* OpenGraph */}
        <meta property="og:title" content="Stream • Your Library" />
        <meta
          property="og:url"
          content="https://joshuaedo-spotify.vercel.app/"
        />
        <meta
          property="og:image:url"
          content="https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Spotify_App_Logo.svg/2048px-Spotify_App_Logo.svg.png"
        />

        {/* Twitter  */}
        <meta name="twitter:title" content="Stream • Your Library" />
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:image"
          content="https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Spotify_App_Logo.svg/2048px-Spotify_App_Logo.svg.png"
        />
      </Head>
      <div className="flex  flex-col items-center bg-black min-h-screen w-full justify-center">
        <Image
          width={""}
          height={""}
          src={spotifyLogo}
          alt="spotify-logo"
          className="w-52 mb-5"
        />

        <div>
          <button
            className="bg-[#13a34a] text-gray-200 p-5 rounded-full shadow-inner font-semibold hover:bg-[#13a33a]"
            onClick={() =>
              signIn("spotify", {
                callbackUrl: "/",
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
