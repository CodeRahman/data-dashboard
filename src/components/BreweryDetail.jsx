import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const BreweryDetail = () => {
  const { id } = useParams();
  const [brewery, setBrewery] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrewery = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://api.openbrewerydb.org/v1/breweries/${id}`);
        const data = await response.json();
        setBrewery(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching brewery details:", error);
        setLoading(false);
      }
    };

    fetchBrewery();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!brewery) return <div>Brewery not found.</div>;

  return (
    <div className='brewco'>
      <h1>{brewery.name}</h1>
      <p>Type: {brewery.brewery_type}</p>
      <p>Description</p>
      <p>This brewery is a {brewery.brewery_type} brewery located in {brewery.city}, {brewery.state} in the nation of {brewery.country}. The address for this brewery is {brewery.street} {brewery.postal_code}. You can reach the brewery at {brewery.phone}</p>
      <button>
        <a href={brewery.website_url} target="_blank" rel="noopener noreferrer">
          Visit Website
        </a>
      </button>
      <p> </p>
      {/* Home Button */}
      <Link to="/" style={{ display: 'inline-block', marginTop: '20px', padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
        Home
      </Link>
    </div>
  );
};

export default BreweryDetail;
