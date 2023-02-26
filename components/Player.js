import { currentTrackIdState } from '@/atom/songAtom';
import useSpotify from '@/hooks/useSpotify';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { isPlayingState } from '@/atom/songAtom';
import Image from 'next/image';
import useSongInfo from '@/hooks/useSongInfo';

function Player() {
  const spotifyApi = useSpotify;
  const { data: session, status } = useSession;
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);
  const songInfo = useSongInfo();

  return (
    <div>
      {/* Left */}
      <div>
        <Image
          src={songInfo?.album.images?.[0]?.url}
          alt={songInfo?.album.name}
          width={27}
          height={27}
          className='rounded'
        />
      </div>
    </div>
  );
}

export default Player;
