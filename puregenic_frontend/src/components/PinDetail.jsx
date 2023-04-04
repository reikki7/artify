// Display the details of a pin.
import React, { useState, useEffect } from "react";
import { BsFillPostcardHeartFill, BsDownload } from "react-icons/bs";
import { Link, useParams, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import contact from "../assets/contact me.png";

import { client, urlfor } from "../client";
import MasonryLayout from "./MasonryLayout";
import { pinDetailMorePinQuery, pinDetailQuery } from "../utils/data";
import Spinner from "./Spinner";

// Display the details of a pin.
const PinDetail = ({ user }) => {
  // State
  const [pins, setPins] = useState(null);
  const [pinDetail, setPinDetail] = useState(null);
  const [setComments] = useState(pinDetail?.comments);
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const { pinId } = useParams();
  const navigate = useNavigate();

  const addComment = () => {
    if (comment) {
      setAddingComment(true);

      // Add comment to Sanity
      client
        // Get the document with the ID of pinId
        .patch(pinId)
        // If the document doesn't have a comments field, create one
        .setIfMissing({ comments: [] })
        // Add the comment to the comments array
        .insert("after", "comments[-1]", [
          {
            comment,
            _key: uuidv4(),
            postedBy: { _type: "postedBy", _ref: user._id },
          },
        ])
        .commit()
        // Reload the page
        .then(() => {
          // Clear the comment field
          setComment("");
          setAddingComment(false);
          setComments((prevComments) => [
            ...prevComments,
            {
              comment,
              _key: uuidv4(),
              postedBy: { _type: "postedBy", _ref: user._id },
            },
          ]);
          window.location.reload();
        });
    }
  };

  // Fetch data from Sanity
  const fetchPinDetail = () => {
    // Fetch the pin details
    let query = pinDetailQuery(pinId);

    // If the query is not null, fetch the data
    if (query) {
      client.fetch(query).then((data) => {
        setPinDetail(data[0]);

        if (data[0]) {
          query = pinDetailMorePinQuery(data[0]);

          client.fetch(query).then((res) => setPins(res));
        }
      });
    }
  };

  // Fetch data from Sanity
  useEffect(() => {
    fetchPinDetail();
  }, [pinId]);

  // Show spinner while loading
  if (!pinDetail) return <Spinner message="Loading Pin" />;

  return (
    <>
      <div
        className="flex xl:flex-row flex-col m-auto bg-white"
        style={{ maxWidth: "1500px", borderRadius: "32px" }}
      >
        <div className="flex justify-center items-center md:items-start flex-initial">
          <img
            src={pinDetail?.image && urlfor(pinDetail.image).url()}
            className="rounded-t-3xl rounded-b-lg"
            alt="user-post"
          />
        </div>
        <div className="w-full p-5 flex-1 xl:min-w-620">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <a
                href={`${pinDetail.image?.asset?.url}?dl=`}
                download
                onClick={(e) => e.stopPropagation()}
                className="w-9 h-9 flex rounded-full items-center justify-center text-dark text-cl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
              >
                <BsDownload size={22} />
              </a>
            </div>
            <div className="flex justify-end">
              <img src={contact} className="w-40 h-auto mt-7" alt="" />
              <a href={pinDetail.destination} target="blank" rel="noreferrer">
                <BsFillPostcardHeartFill
                  className=" hover:text-violet-700 transition-all duration-500 ml-2"
                  size={30}
                />
              </a>
            </div>
          </div>
          <div>
            <div className="flex items-center">
              <h1 className="text-4xl font-bold break-words mt-2 font-sans mr-3">
                {pinDetail.title}
              </h1>
              <button
                className="flex items-center justify-center align-middle h-8 mt-4 px-3 leading-none font-bold font-sans bg-violet-700 rounded-full text-white hover:bg-violet-500"
                style={{ width: "auto" }}
                onClick={() => navigate(`/category/${pinDetail?.category}`)}
              >
                {pinDetail?.category}
              </button>
            </div>
            <p className="px-2 mt-4 outline rounded-full outline-slate-300 outline-offset-4">
              {pinDetail.about}
            </p>
          </div>
          <Link
            to={`/user-profile/${pinDetail.postedBy._id}`}
            className="flex gap-2 mt-5 items-center bg-white rounded-lg"
          >
            <img
              className="w-8 h-8 rounded-full object-cover"
              src={pinDetail.postedBy?.image}
              alt="user-profile"
            />
            <p className="font-semibold capitalize">
              {pinDetail.postedBy?.userName}
            </p>
          </Link>
          <h2 className="font-sans mt-5 text-xl">Comments</h2>
          <div className="max-h-370 overflow-y-auto">
            {pinDetail?.comments?.map((comment, i) => (
              <div
                className="flex gap-2 mt-5 items-center bg-white rounded-lg"
                key={comment._id}
              >
                <img
                  src={comment.postedBy.image}
                  alt="user-profile"
                  className="w-10 h-10 rounded-full cursor-pointer"
                />
                <div className="flex flex-col">
                  <p className="font-bold">{comment.postedBy?.userName}</p>
                  <p>{comment.comment}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap mt-6 gap-3">
            <Link to={`user-profile/${pinDetail.postedBy?._id}`}>
              <img
                className="w-10 h-10 rounded-full cursor-pointer"
                src={user.image}
                alt="user-profile"
              />
            </Link>
            <input
              className="flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
              type="text"
              placeholder="Your thoughts?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              type="button"
              className="bg-violet-700 text-white rounded-full px-6 py-2 font-semibold text-base outline-none hover:bg-violet-500"
              onClick={addComment}
            >
              {addingComment ? "Hmmm..." : "Comment"}
            </button>
          </div>
        </div>
      </div>
      {pins?.length > 0 ? (
        <>
          <h2 className="text-center font-bold text-2x mt-8 mb-4">
            Like the art?
          </h2>
          <MasonryLayout pins={pins} />
        </>
      ) : (
        <Spinner message="Where art..." />
      )}
    </>
  );
};

export default PinDetail;
