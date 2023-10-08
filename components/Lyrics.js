import useSongInfo from "@/hooks/useSongInfo";
import { ChevronDownIcon } from "@heroicons/react/outline";

export default function Lyrics(props) {
  const songInfo = useSongInfo();

  return (
    <div className="fixed inset-0 z-20 h-screen">
      <div
        className="absolute inset-0 bg-black bg-contain p-10"
        style={{
          backgroundImage: `url(${songInfo?.album.images?.[0]?.url})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-60">
          <ChevronDownIcon
            className="h-10 w-10 text-white p-1 m-3 md:m-5 cursor-pointer hover:opacity-75"
            onClick={props.toggleLyricsPlayer}
          />
          <div className="text-white text-center" style={{ whiteSpace: "pre" }}>
            {/* {lyrics} */}
            We don&apos;t have any lyrics for {songInfo?.name}... yet
          </div>
        </div>
      </div>
    </div>
  );
}
