import Head from 'next/head';

function login() {
  return (
    <>
      <Head>
        <title>Login to Spotify</title>
        <meta name='description' content='Spotify clone login page' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div>Login Here!</div>
    </>
  );
}

export default login;
