import React, { useState, useEffect } from 'react'
import { GoogleLogout } from 'react-google-login'
import { useParams, useNavigate } from 'react-router-dom'

import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../utils/data';
import { client } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

const randomImage = 'https://source.unsplash.com/1600x900/?animals,nature,food,photography,art'

const activeBtnStyle = 'bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none'
const notActiveBtnStyle = 'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none'

const UserProfile = () => {

    const [user, setUser] = useState(null);
    const [pins, setPins] = useState(null);
    const [text, setText] = useState('Created');
    const [activeBtn, setActiveBtn] = useState('Created');
    const navigate = useNavigate();
    const { userId } = useParams();

    const handleLogoutSuccess = () => {
        localStorage.removeItem('user');
        const auth2 = window.gapi.auth2.getAuthInstance();
        auth2.signOut().then(() => {
            navigate('/login', { replace: true });
        });
    };

    const handleLogoutFailure = (err) => {
        console.log(err);
    }


    useEffect(() => {
        const query = userQuery(userId);

        client.fetch(query).then((data) => {
            setUser(data[0])
        })
    }, [])

    useEffect(() => {
        if (text === 'Created') {
            const createdPinsQuery = userCreatedPinsQuery(userId);

            client.fetch(createdPinsQuery).then((data) => {
                setPins(data);
            })
        } else {
            const savedPinsQuery = userSavedPinsQuery(userId);

            client.fetch(savedPinsQuery).then((data) => {
                setPins(data);
            })
        }
    }, [text, userId])

    if (!user) {
        return <Spinner message='Loading profile...' />
    }

    return (
        <div className='relative pb-2 h-full justify-center items-center'>
            <div className='flex flex-col pb-5'>
                <div className='relative flex flex-col mb-7'>
                    <div className='flex flex-col justify-center items-center'>
                        <img src={randomImage}
                            className='w-full h-370 2xl:h-510 shadow-lg object-cover'
                            alt='banner-picture' />
                        <img
                            className='rounded-full w-20 h-20 -mt-10 shadow-xl shadow-cover'
                            src={user.image}
                            alt='user-pfp' />
                        <h1 className='font-bold text-3xl text-center mt-3'>
                            {user.userName}
                        </h1>
                        <div className='absolute top-0 z-1 right-0 p-2'>
                            {userId === user._id && (
                                <GoogleLogout
                                    clientId={'924070860016-basb2cuoqn1rrda2lv3npfv4bh5d3ap3.apps.googleusercontent.com'}
                                    buttonText='Log Out'
                                    onSuccess={handleLogoutSuccess}
                                    onFailure={handleLogoutFailure}
                                    cookiePolicy={'single_host_origin'}
                                    isSignedIn={true}
                                />
                            )}
                        </div>
                    </div>
                    <div className='text-center mb-7'>
                        <button
                            type="button"
                            onClick={(e) => {
                                setText(e.target.textContent);
                                setActiveBtn('Created');
                            }}
                            className={`${activeBtn === 'Created' ? activeBtnStyle : notActiveBtnStyle}`}
                        >
                            Created
                        </button>
                        <button
                            type="button"
                            onClick={(e) => {
                                setText(e.target.textContent);
                                setActiveBtn('Saved');
                            }}
                            className={`${activeBtn === 'Saved' ? activeBtnStyle : notActiveBtnStyle}`}
                        >
                            Saved
                        </button>
                    </div>
                    {pins?.length ? (

                        <div className='px-2'>
                            <MasonryLayout pins={pins} />
                        </div>
                    ) : (
                        <div className='flex justify-center font-bold items-center w-full text-xl mt-2'>No pins found.</div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UserProfile