import { getSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";
import useSpotify from "@/hooks/useSpotify";
import Player from "@/components/Player";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "@/components/Sidebar";
import { Form } from "react-bootstrap";
import Header from "@/components/Header";
// import WebPackPlayer from '@/components/WebPackPlayer';

export default function Search() {
  const spotifyApi = useSpotify();
  const accessToken = spotifyApi.getAccessToken();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return;
    let cancel = false;
    spotifyApi.searchTracks(search).then((res) => {
      if (cancel) return;
      setSearchResults(
        res.body.tracks.items.map((track) => {
          return {
            artist: track?.artists[0].name,
            title: track?.name,
            uri: track?.uri,
            albumUrl: track?.album.images[0].url,
            id: track?.id,
          };
        })
      );
    });

    return () => (cancel = true);
  }, [search, accessToken]);

  return (
    <>
      <Head>
        <title>Stream - Search</title>
        <meta name="description" content="Search for your favorite songs" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="">
        <main className=" h-screen overflow-hidden flex flex-row">
          <Header />
          <Sidebar className="w-[15%]" />
          <div className="center w-[100%] md:w-[85%] h-screen overflow-y-scroll scrollbar-hide bg-[#121212]">
            <section className={`space-y-5 bg-[#202020] h-30 text-white p-8`}>
              <div className="pt-9 md:pt-0">
                <div className="p-2 font-bold text-2xl">Search</div>
                <div className="space-y-4 flex">
                  <Form.Control
                    type="search"
                    placeholder="What song you want to listen to?"
                    className="search--input"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </section>

            <>
              <div className="">
                <div className="row pb-24">
                  {searchResults?.map((searchResults) => (
                    <div
                      className="col d-flex align-items-center justify-content-center "
                      key={searchResults.id}
                      onClick={() => {
                        spotifyApi.play({
                          uris: [searchResults.uri],
                        });
                      }}
                    >
                      <div className="card">
                        <div className="text-gray-500">
                          <Image
                            src={searchResults.albumUrl}
                            width={244}
                            height={244}
                            alt={searchResults.title}
                            className="card--img shadow-2xl"
                          />
                          <div className="card--text truncate  cursor-pointer mt-3">
                            <p className="w-36 lg:w-64 text-white font-bold m-0">
                              {" "}
                              {searchResults.title}
                            </p>
                            <p className="font-semibold">
                              {searchResults.artist}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>

            {/* WebPack Player */}
            {/* <div>
          <WebPackPlayer />
        </div> */}
          </div>
        </main>
        {/* Default Player */}
        <Player />
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
