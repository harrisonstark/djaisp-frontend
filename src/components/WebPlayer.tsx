import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import VolumeSlider from './VolumeSlider';
import PositionSlider from './PositionSlider';
import {BsPlayCircleFill, 
        BsPauseCircleFill,
        BsFillSkipStartFill,
        BsFillSkipEndFill} 
from 'react-icons/bs'

import ChatBox from './ChatBox';
import { logOut, removeDuplicates } from '../utils/Utils';

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

let trackList = {};

let counter = 0;

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
        console.log(newVolume);
        if (player) {
            player.setVolume(newVolume);
            Cookies.set("volume", newVolume, { path: "/" });
        }
    };

    const handlePositionChange = (newPosition) => {
        console.log(newPosition);
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
                name: 'DJAISP',
                getOAuthToken: cb => { cb(props.token); },
                volume: Cookies.get("volume") || 0.5
            });
            setPlayer(player);

            player.addListener('ready', ({ device_id }) => {
                setDeviceId(device_id);
            });

            player.addListener('not_ready', ({ device_id }) => {
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
        const handleBeforeUnload = async () => {
            if (player) {
                player.disconnect();
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
        setPosition((prevPosition) => {
            return prevPosition + 1000;
          });
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

    useEffect(() => {
        if(prev_track["id"] !== current_track["id"] && prev_track["name"] !== ""){
            counter++;
        }
        prev_track = current_track;
        if(counter < 0) {
            counter = 0;
        } else if (counter >= Object.keys(trackList).length && Object.keys(trackList).length !== 0) {
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
        }
      }, [current_track]);

      async function getTrackFeatures(uri) {
        const apiUrl = `https://api.spotify.com/v1/audio-features/${uri}`;
      
        const headers = {
          'Authorization': `Bearer ${props.token}`
        };
      
        try {
          const response = await axios.get(apiUrl, { headers });
      
          const values = ["danceability", "energy", "instrumentalness", "speechiness", "valence"];

          let result = {};
          for (let value of values) {
            result[value] = response.data[value];
          }
          result["time_listened"] = 0;
          return result;
        } catch (error) {
          console.error('Track play unsuccessful', error);
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
            queryParams += `track_list=${JSON.stringify(trackList)}&seed_genres=${Cookies.get("seed_genres")}`
        } else {
            queryParams += `message=${message}`
        }
        axios.get(`http://localhost:8989/get_recommendation?user_id=${user_id}&email=${email}&${queryParams}`)
        .then((response) => {
            Cookies.set("seed_genres", response.data.seed_genres, { path: "/" });
            playTracks(removeDuplicates(response.data.songs));
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
                screenMessage = "Refreshing token, your page will reload, please wait...";
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

    if (!is_active) {
        return (
            <>
                <div>
                    <div className="main-wrapper">
                        <b> {screenMessage} </b>
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
                                {current_track?.album?.images[0]  ? (
                                    <img src={current_track.album.images[0].url} className="w-16 h-16 bg-blue-400" alt="" />
                                ): (<></>)}
                            </div>
                            <div className="flex flex-col pl-3 justify-center">
                            {current_track?.name && current_track?.artists[0]?.name ? (
                                <div>
                                    <div id="sample-title">{current_track.name}</div>
                                    <div id="sample-artist">{current_track.artists[0].name}</div>
                                </div>
                            ) : (<></>)}
                            </div>
                        </div>
                        <div className="w-1/2 flex flex-row justify-center mx-2">
                            <div className="flex flex-col w-full justify-center">
                                <div className='flex flex-row items-center justify-center gap-4 pb-1'>
                                    <button className="btn-spotify" onClick={() => { player.previousTrack() && counter-- && counter-- }} >
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

                    <ChatBox onSendMessage={(message) => { message !== "" && playRandomTracks(message) }}/>

                    <button className="btn-spotify" onClick={() => { playTracks(["spotify:track:3TGRqZ0a2l1LRblBkJoaDx"]) }} >
                        CMM
                    </button>
                </div>
            </>
        );
    }
}

export default WebPlayback