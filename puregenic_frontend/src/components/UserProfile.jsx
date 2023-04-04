// Display the user profile page. It displays the user's profile picture, name, and the pins they have created or saved. It also has a logout button that logs the user out of the application.
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ImExit } from "react-icons/im";

import {
  userCreatedPinsQuery,
  userQuery,
  userSavedPinsQuery,
} from "../utils/data";
import { client } from "../client";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
import { gapi } from "gapi-script";

const randomImage =
  "https://source.unsplash.com/1600x900/?anime,fantasy,cartoon,art,illustration,design,graphic,artist";

// Styles
const activeBtnStyle =
  "bg-violet-700 text-white shadow-md font-bold p-2 rounded-full w-20 outline-none hover:shadow-inner transition-all duration-300";
const notActiveBtnStyle =
  "bg-primary text-black font-bold p-2 rounded-full w-20 outline-none hover:shadow-inner transition-all duration-300";

// States
const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState("My Art");
  const [activeBtn, setActiveBtn] = useState("My Art");
  const navigate = useNavigate();
  const { userId } = useParams();

  // Handle logout
  const handleLogout = () => {
    gapi.auth2.getAuthInstance().disconnect();
    localStorage.clear();
    navigate("/login");
  };

  // Fetch user data
  useEffect(() => {
    const query = userQuery(userId);

    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, [userId]);

  // Fetch arts
  useEffect(() => {
    if (text === "My Art") {
      const createdPinsQuery = userCreatedPinsQuery(userId);

      client.fetch(createdPinsQuery).then((data) => {
        setPins(data);
      }).catch((error) => {
        console.error(error);
        setPins([]);
      });
      // Fetch saved arts
    } else {
      const savedPinsQuery = userSavedPinsQuery(userId);

      client.fetch(savedPinsQuery).then((data) => {
        setPins(data);
      }).catch((error) => {
        console.error(error);
        setPins([]);
      });
    }
  }, [text, userId]);

  if (!user) {
    return <Spinner message="Loading profile..." />;
  }

  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img
              src={randomImage}
              className="w-full h-370 2xl:h-510 shadow-lg object-cover"
              alt="banner"
            />
            <img
              className="rounded-full w-30 h-30 -mt-12 shadow-xl shadow-cover"
              src={user?.image}
              alt="user-pfp"
            />
            <h1 className="font-bold text-3xl text-center mt-3">
              {user?.userName}
            </h1>
          </div>
          <div className="absolute center right-0 p-4 xl:mt-96 mt-320">
            {userId === user._id && (
              <ImExit
                className="cursor-pointer transition-all duration-450 mt-12 2xl:mt-32 xl:-mt-1 text-violet-700 hover:text-violet-400"
                size={30}
                onClick={handleLogout}
              />
            )}
          </div>
          <div className="text-center mb-7 mt-1.5">
            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn("My Art");
              }}
              className={`${activeBtn === "My Art" ? activeBtnStyle : notActiveBtnStyle
                }`}
            >
              My Art
            </button>
            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn("Saved");
              }}
              className={`${activeBtn === "Saved" ? activeBtnStyle : notActiveBtnStyle
                }`}
            >
              Saved
            </button>
          </div>
          {pins?.length ? (
            <div className="px-2">
              <MasonryLayout pins={pins} />
            </div>
          ) : (
            <div className="flex justify-center font-bold items-center w-full text-xl mt-2">
              No art found :(
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
