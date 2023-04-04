// Fetching the data from the Sanity API and passing it to the MasonryLayout component.
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';

import { client } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import { feedQuery, searchQuery } from '../utils/data';

// Fetching the data from the Sanity API and passing it to the MasonryLayout component.
const Feed = () => {
  const [pins, setPins] = useState();
  const [loading, setLoading] = useState(false);
  const { categoryId } = useParams();

  // Fetch data from Sanity
  useEffect(() => {
    if (categoryId) {
      setLoading(true);
      const query = searchQuery(categoryId);
      client.fetch(query).then((data) => {
        setPins(data);
        setLoading(false);
      });
    } else {
      setLoading(true);

      client.fetch(feedQuery).then((data) => {
        setPins(data);
        setLoading(false);
      });
    }
  }, [categoryId]);

  // Show spinner while loading
  const topic = categoryId || 'new things';
  if (loading) {
    return (
      <Spinner message={`Imagining ${topic}...`} />
    );
  }

  // Show message if no arts are available
  if (!pins?.length) return <h2>No art available :(</h2>

  // Show pins
  return (
    <div>
      {pins && (
        <MasonryLayout pins={pins} />
      )}
    </div>
  );
};

export default Feed