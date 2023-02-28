import { currentTrackIdState } from '@/atom/songAtom';
import useSpotify from '@/hooks/useSpotify';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { isPlayingState } from '@/atom/songAtom';
import Image from 'next/image';
import useSongInfo from '@/hooks/useSongInfo';

function Player() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);
  const songInfo = useSongInfo();
  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        setCurrentTrackId(data.body?.item.id);
        console.log('Now playing:', data.body?.item);

        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing);
        });
      });
    }
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setVolume(50);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackId, spotifyApi, session]);

  return (
    <div>
      {/* Left */}
      <div>
        <Image
          src={songInfo?.album.images?.[0]?.url}
          alt={songInfo?.album.name}
          width={48}
          height={48}
          className='h-10 w-10'
        />
      </div>
    </div>
  );
}

export default Player;
