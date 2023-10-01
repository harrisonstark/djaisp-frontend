import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import VolumeSlider from './VolumeSlider';
import PositionSlider from './PositionSlider';
import {BsPlayCircleFill, 
        BsPauseCircleFill,
        BsFillSkipStartFill,
        BsFillSkipEndFill} 
from 'react-icons/bs'


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

function WebPlayback(props) {
    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [player, setPlayer] = useState(undefined);
    const [current_track, setTrack] = useState(track);
    const [device_id, setDeviceId] = useState('');
    const [current_volume, setVolume] = useState(Cookies.get("volume") || 0.5);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);

    const playerRef = useRef(null);

    // Callback function to receive the volume value from VolumeSlider
    const handleVolumeChange = (newVolume) => {
        if (playerRef.current) {
            playerRef.current.setVolume(newVolume);
        }
        setVolume(newVolume);
    };

    const handlePositionChange = (newPosition) => {
        if (playerRef.current) {
            playerRef.current.seek(newPosition);
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
                name: 'DJAISP',
                getOAuthToken: cb => { cb(props.token); },
                volume: current_volume
            });
            playerRef.current = player;
            setPlayer(player);

            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
                setDeviceId(device_id);
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
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

        };
        
    }, []);

    useEffect(() => {
        const handleBeforeUnload = () => {
          // Set the cookie to true when the page is about to be closed
          if (playerRef.current) {
            playerRef.current.getVolume().then(volume => {
                Cookies.set("volume", volume, { path: "/" });
            });
            playerRef.current.disconnect();
          }
        };
    
        // Add the "beforeunload" event listener when the component mounts
        window.addEventListener('beforeunload', handleBeforeUnload);
    
        // Remove the event listener when the component unmounts
        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);
    
    let counting;

    const add = () => {
      setPosition((prevPosition) => prevPosition + 1000);
    };
  
    const play = () => {
      if (!counting) {
        counting = setInterval(add, 1000);
      }
    };
  
    const stop = () => {
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
        stop();
      };
    }, [is_paused]);

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
        .then(() => {
            setActive(true);
        })
        .catch(error => {
            console.error('Track play unsuccessful', error);
        });
    }

    function playRandomTracks(limit){
            const user_id = Cookies.get('user_id');
            const email = Cookies.get('email');
            const values = ["acousticness", "danceability", "energy", "instrumentalness", "liveness", "popularity", "speechiness", "valence"];
            let queryParams = `limit=${limit}&seed_genres=indie-pop`
            for(let value of values){
                let num = Math.random();
                if(value === "popularity"){
                    num *= 100;
                    num = Math.floor(num);
                }
                queryParams += `&target_${value}=${num}`
            }
            axios.get(`http://localhost:8989/get_recommendation?user_id=${user_id}&email=${email}&${queryParams}`)
            .then((response) => {
                playTracks(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            })
    }

    if (!is_active) {
        const apiUrl = 'https://api.spotify.com/v1/me/player';

        

        const headers = {
        'Authorization': `Bearer ${props.token}`
        };

        const body = {
        device_ids: [device_id],
        play: false,
        };

        console.log(props.token)
        console.log(device_id)

        axios.put(apiUrl, body, { headers })
        .then(() => {
            setActive(true);
        })
        .catch(error => {
            console.error('Playback transfer unsuccessful', error);
            if(error.message === "Request failed with status code 401"){
                console.error("TOKEN RELOAD TIME!!!!!!!!!")
            }
        });
        return (
            <>
                <div>
                    <div className="main-wrapper">
                        <b> Instance not active. Transfer your playback using your Spotify app if it does not automatically </b>
                    </div>
                </div>
            </>)
    } else {
        return (
            <>
                <div className="w-full">
                    <div className="py-2 bg-zinc-800 inset-x-0 top-0  flex flex-wrap items-center lg:justify-between sm:justify-center">
                        <div className="flex flex-row mx-2"> 
                            <div className='rounded-lg'>
                                <img src={current_track.album.images[0].url} className="w-16 h-16 bg-blue-400" alt="" />
                            </div>
                            <div className="flex flex-col pl-3 justify-center">
                                <div id="sample-title">{current_track.name}</div>
                                <div id="sample-artist">{current_track.artists[0].name}</div>
                            </div>
                        </div>
                        <div className="w-1/2 flex flex-row justify-center mx-2">
                            <div className="flex flex-col w-full justify-center">
                                <div className='flex flex-row items-center justify-center gap-4 pb-1'>
                                    <button className="btn-spotify" onClick={() => { player.previousTrack() }} >
                                        <BsFillSkipStartFill className="hover:fill-zinc-700" size={26} />
                                    </button>
                                    <button className="btn-spotify" onClick={() => { player.togglePlay() }} >
                                        { is_paused ? <BsPlayCircleFill className="hover:fill-zinc-700" size={24}/> : 
                                        <BsPauseCircleFill className="hover:fill-zinc-700" size={26}/> }
                                    </button>
                                    <button className="btn-spotify" onClick={() => { player.nextTrack() }} >
                                        <BsFillSkipEndFill className="hover:fill-zinc-700" size={26} />
                                    </button>
                                </div>
                                <PositionSlider onPositionChange={handlePositionChange} duration={duration} position={position} /> 
                            </div>
                        </div>
                        <div className="w-40 flex flex-row justify-center items-center mx-2"> 
                            <div className="flex flex-col w-full pl-3 justify-center">
                                <VolumeSlider onVolumeChange={handleVolumeChange} />
                            </div>
                        </div>
                    </div>

                    {/* <div className="container">
                        <div className="main-wrapper">

                            <img src={current_track.album.images[0].url} className="now-playing__cover" alt="" />

                            <div className="now-playing__side">
                                <div className="now-playing__name">{current_track.name}</div>
                                <div className="now-playing__artist">{current_track.artists[0].name}</div>

                                <button className="btn-spotify" onClick={() => { playTracks(["spotify:track:3TGRqZ0a2l1LRblBkJoaDx"]) }} >
                                    CMM
                                </button>

                                <button className="btn-spotify" onClick={() => { player.previousTrack() }} >
                                    &lt;&lt;
                                </button>

                                <button className="btn-spotify" onClick={() => { player.togglePlay() }} >
                                    { is_paused ? "PLAY" : "PAUSE" }
                                </button>

                                <button className="btn-spotify" onClick={() => { player.nextTrack() }} >
                                    &gt;&gt;
                                </button>

                                <button className="btn-spotify" onClick={() => { playRandomTracks(10) }} >
                                    ++
                                </button>
                                <PositionSlider onPositionChange={handlePositionChange} duration={duration} position={position} />
                                <VolumeSlider onVolumeChange={handleVolumeChange} />
                            </div>
                        </div>
                    </div> */}
                </div>
            </>
        );
    }
}

export default WebPlayback