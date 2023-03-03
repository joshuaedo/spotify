import React, { useEffect, useState } from 'react';
import useSpotify from './useSpotify';
import Player from '@/components/Player.js';

function useSDK() {
  const spotifyApi = useSpotify();
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const token = spotifyApi.getAccessToken();
    const newPlayer = new Spotify.Player({
      name: `joshuaedo's spotify clone`,
      getOAuthToken: (cb) => {
        cb(token);
      },
      volume: 0.5,
    });

    // Ready
    newPlayer.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id);
    });

    // Not Ready
    newPlayer.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
    });

    newPlayer.addListener('initialization_error', ({ message }) => {
      console.error(message);
    });

    newPlayer.addListener('authentication_error', ({ message }) => {
      console.error(message);
    });

    newPlayer.addListener('account_error', ({ message }) => {
      console.error(message);
    });

    newPlayer.connect();
    setPlayer(newPlayer);

    return () => {
      newPlayer.disconnect();
    };
  }, [spotifyApi]);

  return <div>{player && <Player player={player} />}</div>;
}

export default useSDK;
