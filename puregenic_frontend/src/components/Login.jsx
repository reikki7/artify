// Login page
import React, { useState } from 'react';
import GoogleLogin from 'react-google-login';
import { useNavigate } from 'react-router-dom';
import shareVideo from '../assets/share.mp4';
import logo from '../assets/logowhite.png';
import { client } from '../client';

// Google API token
const clientId = process.env.REACT_APP_GOOGLE_API_TOKEN;

const Login = () => {
  // Navigate to a new route
  const navigate = useNavigate();

  // States
  const [isVisible, setIsVisible] = useState(true);

  // Handle hide
  const handleHide = () => {
    // Hide the message
    setIsVisible(false);
  };

  // Handle show
  return (
    <div className='flex justify-start items-center flex-col h-screen'>
      <div className='relative w-full h-full'>
        {/* Background video  */}
        <video
          src={shareVideo}
          type='video/mp4'
          loop
          controls={false}
          muted
          autoPlay
          className='w-full h-full object-cover'
        />
        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
          <div className='p-5'>
            <img src={logo} width="300px" alt="logo" />
          </div>
          <div className='shadow-2xl'>
            <div id="signInButton">

              {/* Google login button */}
              <GoogleLogin
                clientId={clientId}
                buttonText='Log in with Google'
                onSuccess={credentialResponse => {
                  // Store the user in local storage
                  localStorage.setItem('user', JSON.stringify(credentialResponse.profileObj));

                  // Get the user's name, googleId and image
                  const { name, googleId, imageUrl } = credentialResponse.profileObj;

                  // Create a new user
                  const doc = {
                    _id: googleId,
                    _type: 'user',
                    userName: name,
                    image: imageUrl,
                  }
                  // Create a new user if it doesn't exist
                  client.createIfNotExists(doc).then(() => {
                    navigate('/', { replace: true })
                  })
                }}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
              />
            </div>
          </div>
        </div>
        <div className='flex absolute top-0 left-0 right-0 justify-center'>
          {isVisible && (
            <div className='flex bg-white rounded-2xl px-20 py-5 bg-opacity-75 absolute my-20 break-words items-center flex-col'>
              <div className='mt-6'>(If this message covers the page, scroll down til you see the "Close" button)</div>
              <div className='mt-6'>Hey! This is my first attempt making a web app and it's for my uni project so feel free to promote yourself by posting your art and add a link to your social media or to your commission card! (or just help me filling up the feed)</div>
              <div className='mt-6'>Feel free to share it but make sure to keep it between artists since I don't want random/troll posts coming (Coding is enough pain) :D</div>
              <div className='mt-6'>Please keep it SFW as I don't intend to get dropped out for showing anime tiddies in class.</div>
              <div className='mt-6'>Arts uploaded by "R K", "Reinata Kidd", and "KidKat" are merely placeholders (and were used for user interaction testing) which I plan to delete later, I do not own any of these arts.</div>
              <div className='mt-6'>Keep in mind that the name of your google account will be used as the username, so make sure it's not your personal email if you don't want your real name to be shown.</div>
              <div className='mt-6'>(These messages are temporary. Any review, bug report & feedbacks would be appreciated! You can call it a beta testing :) <a className='font-bold' href='https://forms.gle/y3LiSjnTJjKHbgQW9'>https://forms.gle/y3LiSjnTJjKHbgQW9</a></div>
              <div className='mt-6'>(Upload button is on top right of the home page once you login)</div>
              <button className='bg-violet-700 text-white px-4 py-2 rounded mt-7' onClick={handleHide}>
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
