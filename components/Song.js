import { currentTrackIdState } from "@/atom/songAtom";
import useSpotify from "@/hooks/useSpotify";
import Image from "next/image";
import { useRecoilState } from "recoil";
import Time from "../lib/time";
import { isPlayingState } from "@/atom/songAtom";

function Song({ order, track }) {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  const playSong = () => {
    setCurrentTrackId(track.track.id);
    setIsPlaying(true);
    spotifyApi.play({
      uris: [track?.track?.uri],
    });
  };

  // console.log(track.track.uri);

  return (
    <div
      className="grid grid-cols-2 text-gray-500 py-4 px-5 hover:bg-[#282828] rounded-lg cursor-pointer "
      onClick={playSong}
    >
      <div className="flex items-center space-x-4 font-sm md:font-md">
        <p>{order + 1}</p>
        <Image
          src={track.track.album.images[0].url}
          width={44}
          height={44}
          alt={track.track.album.name}
          className="shadow-2xl shaddy"
        />
        <div>
          <p className="w-36 lg:w-64 truncate text-white ">
            {track.track.name}
          </p>
          <p className="truncate ">{track.track.artists[0].name}</p>
        </div>
      </div>

      <div className="flex items-center justify-between ml-auto md:ml-0 text-sm">
        <p className="w-40 hidden md:inline truncate">
          {track.track.album.name}
        </p>
        <p>{Time(track.track.duration_ms)}</p>
      </div>
    </div>
  );
}

export default Song;
