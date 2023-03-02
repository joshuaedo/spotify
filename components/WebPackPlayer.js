import SpotifyPlayer from 'react-spotify-web-playback';

const WebPackPlayer = ({ OAuthToken, trackUri }) => {
  return (
    <SpotifyPlayer
      token={OAuthToken}
      showSaveIcon
      uris={trackUri ? [trackUri] : []}
      styles={{
        activeColor: '#fff',
        bgColor: '#333',
        color: '#fff',
        loaderColor: '#fff',
        sliderColor: '#1cb954',
        trackArtistColor: '#ccc',
        trackNameColor: '#fff',
      }}
    />
  );
};

// export default WebPackPlayer;
