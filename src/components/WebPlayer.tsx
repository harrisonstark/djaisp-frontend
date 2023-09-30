import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import VolumeSlider from './VolumeSlider';
import PositionSlider from './PositionSlider';
import ChatBox from './ChatBox';

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

const listeningHistory = []

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

    function playRandomTracks(limit, message){
        if (message.trim() === '') {
            return;
        }
        const user_id = Cookies.get('user_id');
        const email = Cookies.get('email');
        const values = ["acousticness", "danceability", "energy", "instrumentalness", "liveness", "popularity", "speechiness", "valence"];
        let queryParams = `message=${message}&limit=${limit}&seed_genres=indie-pop`
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

        axios.put(apiUrl, body, { headers })
        .then(() => {
            setActive(true);
        })
        .catch(error => {
            if(error.message === "Request failed with status code 404"){
                console.error("Loading...", error);
            } else if(error.message === "Request failed with status code 401"){
                console.error("Refreshing token...", error);
                axios.put(`http://localhost:8989/authorize?user_id=${Cookies.get('user_id')}&email=${Cookies.get('email')}`)
                .then(() => {
                    window.location.href = "/";
                })
                .catch((error) => {
                    // TODO: MAKE THIS A UTILS FUNCTION
                    console.error('There was a fatal error, logging user out', error);
                    Cookies.set("loggedIn", 'false', { path: "/" });
                    Cookies.set("email", '', { path: "/" });
                    Cookies.set("user_id", '', { path: "/" });
                    window.location.href = "/";
                });
            } else if (error.message === "Request failed with status code 403"){
                console.error("Something broke :( do you have a paid Spotify premium subscription?", error);
            } else {
                console.error('Playback transfer unsuccessful', error);
            }
        });
        return (
            <>
                <div className="container">
                    <div className="main-wrapper">
                        <b> Instance not active. Transfer your playback using your Spotify app if it does not automatically. </b>
                    </div>
                </div>
            </>)
    } else {
        return (
            <>
                <div className="container">
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
                            <PositionSlider onPositionChange={handlePositionChange} duration={duration} position={position} />
                            <VolumeSlider onVolumeChange={handleVolumeChange} />
                            <ChatBox onSendMessage={(message) => { playRandomTracks(10, message) }}/>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default WebPlayback