import React, { useState, useEffect } from 'react';
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
        BsHourglass,
        BsHourglassTop,
        BsHourglassSplit,
        BsHourglassBottom} 
from 'react-icons/bs'

import ChatBox from './ChatBox';
import { logOut } from '../utils/Utils';
import { Button } from './ui/button';
import { Input } from "./ui/input"

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
        ]
    },
    artists: [
        { name: "" }
    ]
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
            window.addEventListener('message', function (event) {
                const data = event.data;
                if (data.command === 'messageCommand') {
                    const message = data.message;
                    // TODO: SEND LOADING CIRCLE!!!!!!!!!
                    playRandomTracks(message);
                }
            });
        };
        
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
        function cleanUp() {
            if(player){
                player.pause();
                player.disconnect();
            }
        }
          return () => cleanUp();
      }, []);

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
            prev_track = {name: "", album: {images: [{ url: "" }]}, artists: [{ name: "" }]};
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
        axios.get(`https://k4tbefuguv.loclx.io/get_recommendation?user_id=${user_id}&email=${email}&${queryParams}`)
        .then((response) => {
            if(response.data?.status){
                console.error("We had a problem, sorry!");
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
                axios.put(`https://k4tbefuguv.loclx.io/authorize?user_id=${Cookies.get('user_id')}&email=${Cookies.get('email')}`)
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

    if (!is_active) {
        return (
            <>
                <div>
                    <div className="main-wrapper flex justify-center items-center">
                        <b> {screenMessage} </b>
                    </div>
                </div>
            </>)
    } else { // TODO: PRINT ALL ARTISTS SEPARATED BY COMMAS, LINK ALBUM WITH IMAGE, SONG WITH SONG, AND ARTISTS WITH ARTISTS
        return (
            <div className="z-[1000] sticky top-0 left-0 w-full">
                <header className=" bg-zinc-800 flex min-[100px]:flex-col md:flex-row min-[100px]:justify-center md:justify-between relative items-center">
                    <div className="flex min-[100px]:justify-center md:justify-self-start min-[100px]:w-full md:w-1/5  max-h-24 text-clip items-center">
                        <div className="flex flex-row px-2 py-2"> 
                            <div className='rounded-lg'>
                                {current_track?.album?.images[0] ? (
                                    <img src={current_track.album.images[0].url} className="min-w-16 max-w-16 h-16 bg-blue-400 object-cover rounded-lg" alt="" />
                                ) : (<></>)}
                            </div>
                            <div className="flex flex-col pl-4 justify-center ">
                                {current_track?.name && current_track?.artists[0]?.name ? (
                                    <div className="overflow-hidden">
                                        <div>{current_track.name}</div>
                                        <div>{current_track.artists[0].name}</div> 
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
                            <div className='items-center justify-center min-[100px]:w-4/5 sm:w-3/4 md:w-full border-2 border-green-300'>
                                <PositionSlider onPositionChange={handlePositionChange} duration={duration} position={position}/>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row justify-center flex-shrink-0 py-2">
                        <div className="flex flex-col justify-center">
                            <div className="flex flex-row justify-center items-center mr-8"> 
                                {isRecommending() ? (isLastSong() ? <BsHourglassBottom color="#22C55E" size={24}/> : (isFirstSong() ? <BsHourglassTop size={24}/> : <BsHourglassSplit size={24}/>)) : <BsHourglass size={24}/> }
                                <div className="flex flex-col w-full pl-3 justify-center">
                                    <VolumeSlider onVolumeChange={handleVolumeChange} />
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