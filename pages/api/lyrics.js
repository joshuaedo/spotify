// Code for @/pages/api/lyrics starts here
import axios from 'axios';
import dotenv from 'dotenv';
import useSongInfo from '@/hooks/useSongInfo';

dotenv.config();

async function FetchLyrics(songInfo) {
  const response = await axios.get(
    'https://api.musixmatch.com/ws/1.1/track.search',
    {
      params: {
        q_track_artist: `${songInfo?.name} ${songInfo?.artists[0]?.name}`,
        apikey: process.env.MUSIXMATCH_ACCESS_TOKEN,
      },
    }
  );

  const trackId = response.data.message.body.track_list[0].track.track_id;

  const lyricsResponse = await axios.get(
    'https://api.musixmatch.com/ws/1.1/track.lyrics.get',
    {
      params: {
        track_id: trackId,
        apikey: process.env.MUSIXMATCH_ACCESS_TOKEN,
      },
    }
  );

  const lyrics = lyricsResponse.data.message.body.lyrics.lyrics_body;

  return lyrics;
}

export async function getServerSideProps(context) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const songInfo = useSongInfo();

  const lyrics = await FetchLyrics(songInfo);

  return {
    props: {
      lyrics,
    },
  };
}
// Code for  @/pages/api/lyrics stops here
