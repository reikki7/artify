import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { FiDownload } from 'react-icons/fi';
import { AiTwotoneDelete } from 'react-icons/ai';
import { BsFillPostcardHeartFill, BsBookmark, BsBookmarkCheck } from 'react-icons/bs';

import { client, urlfor } from '../client';


const Pin = ({ pin: { postedBy, image, _id, destination, save } }) => {
    const [postHovered, setPostHovered] = useState(false);

    const navigate = useNavigate();

    const user = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear();

    const alreadySaved = !!(save?.filter((item) => item.postedBy?._id === user?.googleId))?.length;

    const savePin = (id) => {
        if (alreadySaved) {
            const savedIndex = save.findIndex((item) => item.postedBy._id === user?.googleId);
            const savedCopy = [...save];
            savedCopy.splice(savedIndex, 1);
            client
                .patch(id)
                .set({ save: savedCopy })
                .commit()
                .then(() => {
                    window.location.reload();
                })
        } else {
            client
                .patch(id)
                .setIfMissing({ save: [] })
                .insert('after', 'save[-1]', [{
                    _key: uuidv4(),
                    userId: user.googleId,
                    postedBy: {
                        _type: 'postedBy',
                        _ref: user.googleId
                    }
                }])
                .commit()
                .then(() => {
                    window.location.reload();
                })
        }
    }

    const deletePin = (id) => {
        client.delete(id).then(() => {
            window.location.reload();
        })
    }

    return (
        <div className='m-2'>
            <div
                onMouseEnter={() => setPostHovered(true)}
                onMouseLeave={() => setPostHovered(false)}
                onClick={() => navigate(`/pin-detail/${_id}`)}
                className="relative cursor-pointer w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
            >
                <img className='rounded-lg w-full' alt='user-post' src={urlfor(image).width(1200).url()} />
                {postHovered && (
                    <div className='absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50'
                        style={({ height: '100%' })}>
                        <div className='flex items-center justify-between'>
                            <div className='flex gap-2'>
                                <a href={`${image?.asset?.url}?dl=`} download
                                    onClick={(e) => e.stopPropagation()}
                                    className='w-11 h-8 flex items-center justify-center text-white text-cl opacity-75 hover:opacity-100 hover:shadow-md outline-none'>
                                    <FiDownload className='bg-gray-800 rounded-full p-1.5' size={28} />
                                </a>
                            </div>
                            {alreadySaved ? (
                                <button type='button'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        savePin(_id);
                                    }}
                                    className='opacity-70 hover:opacity-100 text-white bg-slate-800 font-bold p-1 rounded-2xl hover:shadow-md outline-none'>
                                    <BsBookmarkCheck className='p-0.5' size={21} />
                                </button>

                            ) : (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        savePin(_id);
                                    }}
                                    type='button' className='opacity-70 hover:opacity-100 bg-slate-800 text-white font-bold p-1 rounded-2xl hover:shadow-md outline-none'>
                                    <BsBookmark className='p-0.5' size={21} />
                                </button>
                            )}
                        </div>
                        <div className='px-2 flex jutisfy-between items-center gap-2 w-full'>

                            {postedBy?._id === user?.googleId && (
                                <button
                                    type='button'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deletePin(_id);
                                    }}
                                    className='text-md bg-slate-800 text-white p-1 opacity-70 hover:opacity-100 font-bold rounded-2xl hover:shadow-md outline-none'>
                                    <AiTwotoneDelete className='p-0' />
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <div className='flex justify-between items-center px-1'>
                <Link to={`user-profile/${postedBy._id}`} className='flex gap-2 mt-2 items-center'>
                    <img
                        className='w-8 h-8 rounded-full object-cover shadow-md hover:shadow-none'
                        src={postedBy?.image}
                        alt='user-profile' />
                    <p className='font-semibold text-sm capitalize'>{postedBy?.userName}</p>
                </Link>
                {destination && (
                    <a
                        href={destination}
                        target='_blank'
                        rel='noreferrer'
                        className='bg-flex items-center gap-2 text-2xl text-gray-800 font-bold opacity-70 hover:opacity-100 transition-all duration-500'
                    >
                        <BsFillPostcardHeartFill />

                    </a>
                )
                }
            </div>
        </div>
    )
}

export default Pin