// BreweryDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const BreweryDetail = () => {
  const { id } = useParams();
  const [brewery, setBrewery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBreweryDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://api.openbrewerydb.org/v1/breweries/${id}`);
        const data = await response.json();
        setBrewery(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching brewery details:", err);
        setError(err);
        setLoading(false);
      }
    };
    fetchBreweryDetails();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error || !brewery) return <div>Error loading brewery details.</div>;

  return (
    <div>
      <h2>{brewery.name}</h2>
      <p>Type: {brewery.brewery_type}</p>
      <p>Location: {brewery.city}, {brewery.state}</p>
      <p>Address: {brewery.street}</p>
      <p>Phone: {brewery.phone}</p>
      <p><a href={brewery.website_url} target="_blank" rel="noopener noreferrer">Visit Website</a></p>
    </div>
  );
};

export default BreweryDetail;
