import React from 'react'
import GoogleLogin from 'react-google-login';
import { useNavigate } from 'react-router-dom';
import shareVideo from '../assets/share.mp4';
import logo from '../assets/logowhite.png';
import { client } from '../client';

const clientId = process.env.REACT_APP_GOOGLE_API_TOKEN;

const Login = () => {

  const navigate = useNavigate();

  return (
    <div className='flex justify-start items-center flex-col h-screen'>
      <div className='relative w-full h-full'>
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
              <GoogleLogin
                clientId={clientId}
                buttonText='Log in with Google'
                onSuccess={credentialResponse => {
                  localStorage.setItem('user', JSON.stringify(credentialResponse.profileObj));

                  const { name, googleId, imageUrl } = credentialResponse.profileObj;

                  const doc = {
                    _id: googleId,
                    _type: 'user',
                    userName: name,
                    image: imageUrl,
                  }

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
      </div>
    </div>
  )
}

export default Login