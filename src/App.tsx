import LoginCard from './components/LoginCard';
import axios from 'axios';
import Cookies from 'js-cookie';
import WebPlayer from './components/WebPlayer';
import { Chat } from './components/chat/chat';
import SettingsButton from './components/SettingsButton';
import React, { useEffect, useState } from 'react';

// Resources for ChatPanel
import {ChatPanel} from './components/chat/chat-panel';
import { useChat, type Message } from 'ai/react';
import { useLocalStorage } from './lib/hooks/use-local-storage';

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
}

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return width;
}

function App({ id, initialMessages, className }: ChatProps) {
  const [token, setToken] = useState('');

  async function refreshToken() {
    await axios.put(`http://localhost:8989/authorize?user_id=${Cookies.get('user_id')}&email=${Cookies.get('email')}`);
    getToken();
  }

  async function getToken() {
    const response = await axios.get(`http://localhost:8989/get_credentials?user_id=${Cookies.get('user_id')}&email=${Cookies.get('email')}`);
    setToken(response.data["access_token"]);
    getProfilePictureURL();
  }

  async function getProfilePictureURL() {
    const response = await axios.get(`http://localhost:8989/get_user_information?user_id=${Cookies.get('user_id')}&email=${Cookies.get('email')}`);
    Cookies.set("profilePicture", response.data["url"], "/");
  }

  useEffect(() => {
    if (Cookies.get('loggedIn') === 'true') {
      // Initial token retrieval
      refreshToken();

      // Set up interval to refresh token every 55m
      const intervalId = setInterval(refreshToken, 55 * 60 * 1000);

      // Clean up interval when the component is unmounted
      return () => clearInterval(intervalId);
    }
  }, []);

  // Handle which layout is selected A, B, C, or D
  const [selectedLayout, setSelectedLayout] = useState('B');

  const handleSelectedLayoutChange = (layout) => {
    setSelectedLayout(layout);
  };

  // Handle which theme is selected ('dark' or 'light')
  const [selectedTheme, setSelectedTheme] = useState('dark');

  const handleSelectedThemeChange = (theme) => {
    setSelectedTheme(theme);
  };


  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Items required for ChatPanel
  const [previewToken] = useLocalStorage<string | null>(
    'ai-token',
    null
  )
  // May need this later
  // const [previewTokenDialog, setPreviewTokenDialog] = useState(IS_PREVIEW)
  // const [previewTokenInput, setPreviewTokenInput] = useState(previewToken ?? '')
  const { messages, append, reload, stop, isLoading, input, setInput } =
    useChat({
      initialMessages,
      id,
      body: {
        id,
        previewToken
      },
      api: "http://localhost:8989/chat",
      onResponse(response) {
        if (response.status === 401) {
            // showToastError(response.statusText);
            console.log(response.statusText);
        }
      }
    })
    useEffect(() => {
      if(messages.length && messages.length % 2 === 0) {
        Cookies.set("userRecentMessage", JSON.stringify(messages[messages.length - 2]), { path: "/" });
        Cookies.set("maistroRecentMessage", JSON.stringify(messages[messages.length - 1]), { path: "/" });
      }
    }, [messages]);
    function getRecentMessages(){
      messages.push(JSON.parse(Cookies.get("userRecentMessage")));
      messages.push(JSON.parse(Cookies.get("maistroRecentMessage")));
    }
    if(messages.length === 0 && Cookies.get('userRecentMessage') && Cookies.get('maistroRecentMessage')) {
      getRecentMessages();
  }


  return (
    <div className={`dark ${selectedTheme === 'dark' ? 'bg-background' : 'bg-[#D0E7D2]'} h-screen overflow-y-scroll`}>
      <div className={`dark ${selectedTheme === 'dark' ? 'bg-background' : 'bg-[#D0E7D2]'} text-foreground`}>
        <div className="flex flex-col justify-center items-center w-full">
          {/* Option A Selected */}
          {token !== '' && (selectedLayout === 'A' || windowDimensions <= 900) ?
          (
          <div className='w-full h-full'>
            <WebPlayer key={token} token={token} selectedTheme={selectedTheme} />
            <Chat messages={messages} setInput={setInput} className={""} selectedTheme={selectedTheme} selectedLayout={selectedLayout} />
            <ChatPanel
                id={id}
                isLoading={isLoading}
                stop={stop}
                append={append}
                reload={reload}
                messages={messages}
                input={input}
                setInput={setInput}
                currentAppLayout={selectedLayout}
                selectedTheme={selectedTheme}
              />
              <div className="min-[100px]:hidden md:flex mr-14 mb-[4.5rem] absolute bottom-0 right-0 h-8 w-10">
                  <SettingsButton  
                    selectedLayout={selectedLayout}
                    onSelectedLayoutChange={handleSelectedLayoutChange}
                    selectedTheme={selectedTheme}
                    onSelectedThemeChange={handleSelectedThemeChange}
                  />
              </div>
          </div>) : (<div />)}


          {/* Option B Selected */}
          {token !== '' && (selectedLayout === 'B' && windowDimensions > 900)  ?
          (
          <div className='flex flex-col w-full h-screen'>
            <div className={`${selectedTheme === "dark" ? "bg-background z-[100] sticky inset-x-0 top-0 md:pt-28 h-full" :
             "bg-[#D0E7D2] z-[100] sticky inset-x-0 top-0 md:pt-28 h-full"}`}>
              <ChatPanel
                id={id}
                isLoading={isLoading}
                stop={stop}
                append={append}
                reload={reload}
                messages={messages}
                input={input}
                setInput={setInput}
                selectedTheme={selectedTheme}
              />
            </div>
            <div className="z-[1000] min-[100px]:hidden md:flex mr-14 mt-16 absolute top-0 right-0 h-8 w-10">
                  <SettingsButton  
                    selectedLayout={selectedLayout}
                    onSelectedLayoutChange={handleSelectedLayoutChange}
                    selectedTheme={selectedTheme}
                    onSelectedThemeChange={handleSelectedThemeChange}
                  />
              </div>
            <div className="">
              <Chat messages={messages} setInput={setInput} className={""} selectedTheme={selectedTheme} selectedLayout={selectedLayout} />
            </div>
            
            
              
            <div className="sticky inset-x-0 bottom-0 left-0">
              <WebPlayer key={token} token={token} selectedTheme={selectedTheme} />
            </div>
          </div>) : (<div />)}
        </div>
        <div className="flex justify-center items-center w-full">
          {Cookies.get('loggedIn') === 'true' ? (
            <div />
          ) : (
            <LoginCard />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;