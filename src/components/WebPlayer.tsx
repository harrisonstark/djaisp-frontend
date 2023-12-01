import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import VolumeSlider from './VolumeSlider';
import PositionSlider from './PositionSlider';
import {BsPlayCircleFill, 
        BsPauseCircleFill,
        BsFillSkipStartFill,
        BsFillSkipEndFill,
        BsHandThumbsUp,
        BsHandThumbsUpFill,
        BsHandThumbsDown,
        BsHandThumbsDownFill,
        BsInfoCircle} 
from 'react-icons/bs'

import {Stack0, Stack1, Stack2, Stack3, Stack4} from '../components/ui/stacks'

import {
    Dialog,
    DialogContent,
    DialogTrigger,
  } from "../components/ui/dialog"

import { logOut } from '../utils/Utils';
import { toast } from './ui/use-toast';

declare global {
    interface Window {
        onSpotifyWebPlaybackSDKReady: () => void;
        Spotify: {
            Player: new (options: any) => any;
        };
    }
}

const track = {
    name: "",
    album: {
        images: [
            { url: "" }
        ],
        uri: ""
    },
    artists: [
        { name: "",
          uri: "" }
    ],
    uri: ""
}

let prev_track = track;

const seedNumberFromCookie = Cookies.get("seedNumber") || 0

let seedNumber = parseInt(seedNumberFromCookie);

let trackList = seedNumber > 0 && Cookies.get("trackList") ? JSON.parse(Cookies.get("trackList")) : {};

const counterFromCookie = Cookies.get("counter") || 0;

let counter = parseInt(counterFromCookie);

const seedSizeFromCookie = Cookies.get("seedSize") || 0;

let seedSize = parseInt(seedSizeFromCookie);

let screenMessage = "Instance not active. Transfer your playback using your Spotify app if it does not automatically.";

function WebPlayback(props) {
    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [player, setPlayer] = useState(undefined);
    const [current_track, setTrack] = useState(track);
    const [device_id, setDeviceId] = useState('');
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const playerRef = useRef(null);

    let selectedTheme = props.selectedTheme;

    // Callback function to receive the volume value from VolumeSlider
    const handleVolumeChange = (newVolume) => {
        if (player) {
            player.setVolume(newVolume);
            Cookies.set("volume", newVolume, { path: "/" });
        }
    };

    const handlePositionChange = (newPosition) => {
        if (player) {
            player.seek(newPosition);
        }
        setPosition(newPosition);
    };

    function handleMessageEvent(event) {
        const data = event.data;
        if (data.command === 'messageCommand') {
            const message = data.message;
            playRandomTracks(message);
        }
    }

    // MAKE SPOTIFY PLAYER
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {

            const player = new window.Spotify.Player({
                name: 'MAISTRO',
                getOAuthToken: cb => { cb(props.token); },
                volume: Cookies.get("volume") || 0.5
            });
            setPlayer(player);
            playerRef.current = player;
            
            player.addListener('ready', ({ device_id }) => {
                setDeviceId(device_id);
            });

            player.addListener('not_ready', () => {
                setDeviceId("");
            });

            player.addListener('player_state_changed', ( state => {
                if (!state) {
                    return;
                }
                
                setTrack(state.track_window.current_track);
                setPaused(state.paused);
                setPosition(state.position);
                setDuration(state.duration);

                player.getCurrentState().then( state => { 
                    (!state)? setActive(false) : setActive(true)
                });

            }));

            player.connect();
            player.activateElement();
            window.addEventListener('message', handleMessageEvent);
        };

        return () => {
            const player = playerRef.current;
            if(player){
                player.pause();
                player.removeListener('ready');
                player.removeListener('not_ready');
                player.removeListener('player_state_changed');
                window.removeEventListener('message', handleMessageEvent);
                player.disconnect();
            }
            if (counting) {
                clearInterval(counting);
                counting = null;
            }
        }
    }, []);
    
    let counting;

    const add = () => {
        setPosition((prevPosition) => {
            return prevPosition + 1000;
          });
    };
  
    const play = () => {
      if (!counting) {
        counting = setInterval(add, 1000);
      }
    };
  
    const stop = (paused = Cookies.get("wasPaused")) => {
      Cookies.set("wasPaused", paused, "/");
      clearInterval(counting);
      counting = null;
    };
  
    useEffect(() => {
      if (!is_paused) {
        play();
      } else {
        stop();
      }
      // Clean up the timer when the component unmounts
      return () => {
        stop(is_paused);
      };
    }, [is_paused]);

    useEffect(() => {
        try {
            if(prev_track["id"] !== current_track["id"] && prev_track["name"] !== "" && seedNumber > 0){
                counter++;
            }
            if(current_track["id"] !== null){
                prev_track = current_track;
            }
        } catch (error) {
            if(current_track === null) {
                setTrack(prev_track);
                if(player){
                    player.togglePlay();
                }
            }
        }
        if(Object.keys(trackList).length > 1 && seedNumber > 0){
            if(counter < 0) {
                counter = 0;
            } else if (counter >= Object.keys(trackList).length) {
                counter = 0;
                playRandomTracks();
            } else {
                if(Object.keys(trackList).length !== 0){
                    const time_listened = position / duration;
                    try {
                        trackList[counter]["time_listened"] = time_listened;
                    } catch(error){
                        console.error(error);
                    }
                }
                Cookies.set("trackList", JSON.stringify(trackList), { path: "/" });
                Cookies.set("counter", counter, { path: "/" });
            }
        }
      }, [current_track]);

      async function getPopularity(uri) {
        const apiUrl = `https://api.spotify.com/v1/tracks/${uri}`;
      
        const headers = {
          'Authorization': `Bearer ${props.token}`
        };
      
        try {
          const response = await axios.get(apiUrl, { headers });      
          return response.data["popularity"];
        } catch (error) {
          console.error('Track get unsuccessful', error);
        }
      }

      async function getTrackFeatures(uri) {
        const apiUrl = `https://api.spotify.com/v1/audio-features/${uri}`;
      
        const headers = {
          'Authorization': `Bearer ${props.token}`
        };
      
        try {
          const response = await axios.get(apiUrl, { headers });
      
          const values = ["danceability", "speechiness", "instrumentalness", "energy", "valence"];

          let result = {};
          for (let value of values) {
            result[value] = response.data[value];
          }
          result["popularity"] = await getPopularity(uri);
          result["uri"] = uri;
          result["time_listened"] = 0;
          result["thumbs"] = "";
          return result;
        } catch (error) {
          console.error('Data get unsuccessful', error);
        }
      }

    function playTracks(uriList) {
        const apiUrl = 'https://api.spotify.com/v1/me/player/play';

        const headers = {
        'Authorization': `Bearer ${props.token}`
        };

        const body = {
        uris: uriList,
        device_ids: [device_id]
        };

        axios.put(apiUrl, body, { headers })
        .then(async () => {
            trackList = {};
            counter = 0;
            prev_track = {name: "", album: {images: [{ url: "" }], uri: ""}, artists: [{ name: "", uri: "" }], uri: ""};
            for(let i = 0; i < uriList.length; i++){
                trackList[i] = await getTrackFeatures(uriList[i].split(':')[2]);
            }
        })
        .catch(error => {
            console.error('Track play unsuccessful', error);
        });
    }

    function playRandomTracks(message = ""){
        const user_id = Cookies.get('user_id');
        const email = Cookies.get('email');
        let queryParams = ""
        if (message.trim() === '') {
            queryParams += `track_list=${JSON.stringify(trackList)}&seed_genres=${Cookies.get("seedGenres")}&seed_number=${seedNumber}`
        } else {
            queryParams += `message=${message}`
        }
        axios.get(`http://localhost:8989/get_recommendation?user_id=${user_id}&email=${email}&${queryParams}`)
        .then((response) => {
            if(response.data?.status){
                toast({
                    title: "Error: Oops, I dropped my baton, please try again later.",
                    description: response.statusText,
                })
            } else {
                Cookies.set("seedGenres", response.data.seed_genres, { path: "/" });
                seedNumber = response.data.seed_number;
                Cookies.set("seedNumber", seedNumber, { path: "/" });
                seedSize = response.data.songs.length
                Cookies.set("seedSize", seedSize, { path: "/" });
                playTracks(response.data.songs);
            }
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        })
    }

    useEffect(() => {
        const apiUrl = 'https://api.spotify.com/v1/me/player';

        const headers = {
        'Authorization': `Bearer ${props.token}`
        };

        const body = {
        device_ids: [device_id],
        play: false,
        };

        axios.put(apiUrl, body, { headers })
        .then(() => {
            setActive(true);
        })
        .catch(error => {
            if(error.message === "Request failed with status code 404"){
                screenMessage = "Loading...";
            } else if(error.message === "Request failed with status code 401"){
                screenMessage = "Refreshing token, please wait...";
                axios.put(`http://localhost:8989/authorize?user_id=${Cookies.get('user_id')}&email=${Cookies.get('email')}`)
                .then(() => {
                    window.location.href = "/";
                })
                .catch((error) => {
                    console.error('There was a fatal error, logging user out', error);
                    logOut();
                });
            } else if (error.message === "Request failed with status code 403"){
                screenMessage = "Something broke :( do you have a paid Spotify premium subscription?";
            } else {
                screenMessage = 'Playback transfer unsuccessful (seriously broke)';
            }
        });
    }, [device_id]);
    
    function isThumbs(direction) {
        return trackList[counter]?.thumbs === direction;
    }

    function isRecommending() {
        return seedNumber > 0;
    }

    function isLastSong() {
        return Object.keys(trackList).length === seedSize && Object.keys(trackList).length === counter + 1;
    }

    // TODO: This needs double checking
    // i want to see if we are over halfway through the current seed
    function isOverHalfway(){
        return counter > (Object.keys(trackList).length / 2) && counter < Object.keys(trackList).length;
    }

    function isFirstSong() {
        return counter === 0;
    }
    
    function toggleThumbs(direction) {
        if(isRecommending()){
            const currentDirection = trackList[counter]["thumbs"];
            if(currentDirection === direction){
                trackList[counter]["thumbs"] = "";
            } else {
                trackList[counter]["thumbs"] = direction;
            }
            if(trackList[counter]["thumbs"] === "down") {
                player.nextTrack();
            }
        }
    }

    function uriToURL(uri) {
        const splitURI = uri.split(":");
        return uri === "" ? "" : splitURI[1] === "artists" ? "artist" : splitURI[1] + "/" + splitURI[2];
    }

    if (!is_active) {
        return (
            <>
                <div>
                    <div className={`${selectedTheme === 'dark' ? 'bg-background text-foreground' : 'bg-[#748E63] text-[#D0E7D2]'} z-[1000] max-h-screen overflow-y-auto main-wrapper flex justify-center items-center`}>
                        <b> {screenMessage} </b>
                    </div>
                </div>
            </>)
    } else {
        return (
            <div className="z-[1000] sticky top-0 left-0 w-full" style={{scrollbarGutter: "stable"}}>
                <header className={`${selectedTheme === 'dark' ? "bg-zinc-800 text-white" : "bg-[#748E63] text-[#D0E7D2]"} flex min-[100px]:flex-col md:flex-row min-[100px]:justify-center md:justify-between relative items-center `}>
                    <div className="flex min-[100px]:justify-center md:justify-self-start min-[100px]:w-full sm:w-2/3 md:w-1/5  max-h-24 text-clip items-center">
                        <div className="flex flex-row px-2 w-full max-h-24 min-[100px]:justify-center lg:justify-start"> 
                            {current_track?.album?.images[0] ? ( 
                                <div className="p-2 w-20 h-20 flex-shrink-0">
                                    <a href={"https://open.spotify.com/" + uriToURL(current_track.album.uri)} target="_blank" rel="noreferrer">
                                    <img
                                        src={current_track.album.images[0].url}
                                        className="aspect-1  rounded-lg hover:opacity-70 transition-opacity duration-100"
                                        alt=""
                                    />
                                    </a>
                                </div>
                            ) : (<></>)}
                            <div className="flex flex-col justify-center ml-2 w-fit overflow-x-hidden">
                                {current_track?.name && current_track?.artists ? (
                                    <div className="overflow-hidden inline truncate">
                                        {/*If the song length is > 25 characters, scroll the text. Yes I know there are 4 copies
                                        thats how it works*/}
                                        {current_track.name.length > 25 ? (
                                            <div className="relative flex overflow-x-hidden">
                                                <div className="animate-marquee whitespace-nowrap">
                                                    <a href={"https://open.spotify.com/" + uriToURL(current_track.uri)} target="_blank" rel="noreferrer">
                                                        <span className="hover:underline mx-4">
                                                        {current_track.name}
                                                        </span>
                                                    </a>
                                                </div>
                                                <div className="animate-marquee whitespace-nowrap">
                                                    <a href={"https://open.spotify.com/" + uriToURL(current_track.uri)} target="_blank" rel="noreferrer">
                                                        <p className="hover:underline mx-4">
                                                        {current_track.name}
                                                        </p>
                                                    </a>
                                                </div>
                                                <div className="animate-marquee2 whitespace-nowrap">
                                                    <a href={"https://open.spotify.com/" + uriToURL(current_track.uri)} target="_blank" rel="noreferrer">
                                                        <span className="hover:underline">
                                                        {current_track.name}
                                                        </span>
                                                    </a>
                                                </div>
                                                <div className="animate-marquee2 whitespace-nowrap">
                                                    <a href={"https://open.spotify.com/" + uriToURL(current_track.uri)} target="_blank" rel="noreferrer">
                                                        <span className="hover:underline">
                                                        {current_track.name}
                                                        </span>
                                                    </a>
                                                </div>
                                            </div>
                                        ) :
                                        (
                                            <div>
                                            <a href={"https://open.spotify.com/" + uriToURL(current_track.uri)} target="_blank" rel="noreferrer">
                                                <span className="hover:underline">
                                                {current_track.name}
                                                </span>
                                            </a>
                                            </div>  
                                        )}
                                        
                                    <div>
                                        {current_track.artists.map((artist, index) => (
                                        <span key={index}>
                                            {index > 0 && ', '}
                                            <a href={"https://open.spotify.com/" + uriToURL(current_track.artists[index].uri)}
                                                target="_blank" rel="noopener noreferrer" title={artist.name}>
                                                <span className="hover:underline inline truncate">{artist.name}</span>
                                            </a>
                                        </span>
                                        ))}
                                    </div>
                                    </div>
                                ) : (<></>)}
                            </div>
                        </div>
                    </div>
                    <div className="py-2 min-[100px]:w-full md:w-1/2 md:absolute md:start-1/4">
                        <div className="flex flex-col w-full items-center justify-center">
                            <div className='flex flex-row items-center w-full justify-center gap-4 pb-1'>   
                                <button className="btn-thumbs-down" onClick={() => {toggleThumbs("down")}} >
                                    { isThumbs("down") ? <BsHandThumbsDownFill className="hover:fill-zinc-700" size={24}/> : 
                                        <BsHandThumbsDown className="hover:fill-zinc-700" size={24}/>}
                                    </button>
                                    <button className="btn-spotify" onClick={() => { player.previousTrack() && counter-- && counter-- }} >
                                        <BsFillSkipStartFill className="hover:fill-zinc-700" size={24} />
                                    </button>
                                    <button className="btn-spotify" onClick={() => { player.togglePlay() }} >
                                        { is_paused ? <BsPlayCircleFill className="hover:fill-zinc-700" size={24}/> : 
                                        <BsPauseCircleFill className="hover:fill-zinc-700" size={24}/> }
                                    </button>
                                    <button className="btn-spotify" onClick={() => { player.nextTrack() }} >
                                        <BsFillSkipEndFill className="hover:fill-zinc-700" size={24} />
                                    </button>
                                    <button className="btn-thumbs-up" onClick={() => {toggleThumbs("up")}} >
                                        { isThumbs("up") ? <BsHandThumbsUpFill className="hover:fill-zinc-700" size={24}/> : 
                                        <BsHandThumbsUp className="hover:fill-zinc-700" size={24}/>}
                                    </button>
                            </div>
                            <div className='items-center justify-center min-[100px]:w-4/5 sm:w-3/4 md:w-full'>
                                <PositionSlider selectedTheme={selectedTheme} onPositionChange={handlePositionChange} duration={duration} position={position}/>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row justify-center flex-shrink-0 py-2">
                        <div className="flex flex-col justify-center">
                            <div className="flex flex-row justify-center items-center mr-8"> 
                                {isRecommending() ?
                                 (isLastSong() ? <Stack1 selectedTheme={selectedTheme} /> : (
                                    isFirstSong() ? <Stack4 /> : (
                                        isOverHalfway() ? <Stack2 selectedTheme={selectedTheme}/> : (
                                            <Stack3 selectedTheme={selectedTheme}/>
                                        )
                                    )
                                   )
                                   ) : <Stack0 />}
                                <div className="flex flex-col w-full pl-3 justify-center">
                                    <VolumeSlider onVolumeChange={handleVolumeChange} selectedTheme={selectedTheme} />
                                </div>
                                <div className="pl-3 pt-1 self-center hover:opacity-50">
                                    <Dialog>
                                        <DialogTrigger><BsInfoCircle size={18} /></DialogTrigger>
                                        <DialogContent className={`${selectedTheme === 'dark' ? 'bg-background text-foreground' : 'bg-[#748E63] text-[#D0E7D2]'} z-[1000] max-h-screen overflow-y-auto`}>
                                            <h1 className="text-foreground text-lg font-semibold"><center>M<i>AI</i>STRO FAQ</center></h1>
                                            <h1 className="text-foreground font-semibold">How does it work?</h1>
                                            <p className={`${selectedTheme === 'dark' ? 'text-muted-foreground' : 'text-[#D0E7D2]'} text-sm`}>
                                            M<i>AI</i>STRO will generate batches of songs based on your messages. Your feedback on the current
                                                batch will affect future batches.
                                            </p>
                                            <h1 className="text-foreground font-semibold">How to start</h1>
                                            <p className={`${selectedTheme === 'dark' ? 'text-muted-foreground' : 'text-[#D0E7D2]'} text-sm`}>
                                                Send a message using the text input box; whether it's your current mood, activity, or general vibe, M<i>AI</i>STRO will attempt to provide the best music for the occasion. Once you are ready
                                                to send, click ENTER or use the green send button.
                                            </p>
                                            <h1 className="text-foreground font-semibold">What is a batch?</h1>
                                            <p className={`${selectedTheme === 'dark' ? 'text-muted-foreground' : 'text-[#D0E7D2]'} text-sm`}>
                                                A batch is a grouping of songs. The first batch gets created once you send a message and is reset upon subsequent messages. To view batch progress, look at the icon to the left of the 
                                                volume slider:
                                            </p>
                                            <div className="flex flex-row justify-between items-center">
                                                <div className="flex flex-col items-center">
                                                    <Stack4 />
                                                    <p className={`${selectedTheme === 'dark' ? 'text-muted-foreground' : 'text-[#D0E7D2]'} mt-2 text-center text-sm`}>
                                                        First song <br /> in batch
                                                    </p>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <Stack3 />
                                                    <p className={`${selectedTheme === 'dark' ? 'text-muted-foreground' : 'text-[#D0E7D2]'} mt-2 text-center text-sm`}>
                                                        First half <br /> of batch
                                                    </p>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <Stack2 />
                                                    <p className={`${selectedTheme === 'dark' ? 'text-muted-foreground' : 'text-[#D0E7D2]'} mt-2 text-center text-sm`}>
                                                        Second half <br /> of batch
                                                    </p>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <Stack1 />
                                                    <p className={`${selectedTheme === 'dark' ? 'text-muted-foreground' : 'text-[#D0E7D2]'} mt-2 text-center text-sm`}>
                                                        Last song <br /> in batch
                                                    </p>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <Stack0 />
                                                    <p className={`${selectedTheme === 'dark' ? 'text-muted-foreground' : 'text-[#D0E7D2]'} mt-2 text-center text-sm`}>
                                                        M<i>AI</i>STRO is <br /> not active
                                                    </p>
                                                </div>
                                            </div>
                                            <h1 className="text-foreground font-semibold">How do batches change?</h1>
                                            <p className={`${selectedTheme === 'dark' ? 'text-muted-foreground' : 'text-[#D0E7D2]'} text-sm`}>
                                            <b>1)</b> Time listened, including skips <br /><b>2)</b> Thumbs up/down buttons <br /> The latter has a greater impact; if you feel strongly about a song, let M<i>AI</i>STRO know.
                                            </p>
                                        </DialogContent>
                                    </Dialog>   
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
            </div>
        );
    }
}

export default WebPlayback