import React, { useState, useEffect } from 'react';

const App = () => {
  const [breweries, setBreweries] = useState([]); // State to hold breweries
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [searchTerm, setSearchTerm] = useState(''); // Search term
  const [filterType, setFilterType] = useState(''); // Filter by type
  const [stateFilter, setStateFilter] = useState(''); // Filter by state
  const [page, setPage] = useState(1); // Current page for pagination

  const US_STATES = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", 
    "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", 
    "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", 
    "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", 
    "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", 
    "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
  ];

  useEffect(() => {
    const fetchBreweries = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const response = await fetch(`https://api.openbrewerydb.org/v1/breweries?by_country=United States&per_page=50&page=${page}`);
        const data = await response.json();
        
        // Remove duplicates based on brewery id
        setBreweries(prevBreweries => {
          const newBreweries = data.filter(brewery => 
            !prevBreweries.some(existingBrewery => existingBrewery.id === brewery.id)
          );
          return [...prevBreweries, ...newBreweries];
        });

        setLoading(false); // Set loading to false after fetching
      } catch (err) {
        console.error("Error fetching breweries:", err);
        setError(err);
        setLoading(false);
      }
    };

    fetchBreweries();
  }, [page]); // Re-fetch when page number changes

  if (loading && page === 1) {
    return <div>Loading...</div>; // Show loading text
  }

  if (error) {
    return <div>Error fetching data.</div>; // Show error message
  }

  // Filter breweries based on search term, type, and state
  const filteredBreweries = breweries
    .filter(brewery => 
      brewery.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
      (filterType === '' || brewery.brewery_type === filterType) &&
      (stateFilter === '' || brewery.state === stateFilter)
    );

  return (
    <div>
      <h1>Brewery Dashboard</h1>
      
      {/* Search Bar */}
      <input 
        type="text" 
        placeholder="Search breweries..." 
        onChange={(e) => setSearchTerm(e.target.value)} 
      />

      {/* Filter by Brewery Type */}
      <label>Filter by type:</label>
      <select onChange={(e) => setFilterType(e.target.value)} value={filterType}>
        <option value="">All</option>
        <option value="micro">Micro</option>
        <option value="nano">Nano</option>
        <option value="regional">Regional</option>
        <option value="brewpub">Brewpub</option>
        <option value="large">Large</option>
        <option value="planning">Planning</option>
        <option value="bar">Bar</option>
        <option value="contract">Contract</option>
        <option value="proprietor">Proprietor</option>
        <option value="closed">Closed</option>
      </select>

      {/* Filter by State */}
      <label>Filter by state:</label>
      <select onChange={(e) => setStateFilter(e.target.value)} value={stateFilter}>
        <option value="">All</option>
        {US_STATES.map(state => (
          <option key={state} value={state}>{state}</option>
        ))}
      </select>

      {/* List of Breweries */}
      <div className='brews'>
        {filteredBreweries.map(brewery => (
          <div key={brewery.id} className='brewsco' id={brewery.brewery_type}>
            <h2>{brewery.name}</h2>
            <p>{brewery.brewery_type}</p>
            <p>{brewery.city}, {brewery.state}</p>
            <button onClick={() => window.open(brewery.website_url)}>Visit Website</button>
          </div>
        ))}
      </div>

      {/* Load More Breweries Button */}
      <button className="load" onClick={() => setPage(prevPage => prevPage + 1)}>
        Load More Breweries
      </button>
    </div>
  );
};

export default App;
