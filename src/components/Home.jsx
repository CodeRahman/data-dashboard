import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Home = () => {
  const [breweries, setBreweries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [nationFilter, setNationFilter] = useState(''); // State for nation filter
  const [page, setPage] = useState(1);
  const [visualizationType, setVisualizationType] = useState('type'); // Track the current visualization type

  const US_STATES = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
    "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
    "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
    "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
    "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
    "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
    "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
  ];

  // Add the NATIONS array
  const NATIONS = [
    "Austria", "England", "France", "Isle of Man", "Ireland", "Poland", "Portugal", 
    "Scotland", "Singapore", "South Korea", "United States"
  ];

  useEffect(() => {
    const fetchBreweries = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://api.openbrewerydb.org/v1/breweries?per_page=200&page=${page}`);
        const data = await response.json();

        setBreweries(prevBreweries => {
          const newBreweries = data.filter(brewery =>
            !prevBreweries.some(existingBrewery => existingBrewery.id === brewery.id)
          );
          return [...prevBreweries, ...newBreweries];
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching breweries:", err);
        setError(err);
        setLoading(false);
      }
    };

    fetchBreweries();
  }, [page]);

  if (loading && page === 1) return <div>Loading...</div>;
  if (error) return <div>Error fetching data.</div>;

  const filteredBreweries = breweries
    .filter(brewery =>
      brewery.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterType === '' || brewery.brewery_type === filterType) &&
      (stateFilter === '' || brewery.state === stateFilter) &&
      (nationFilter === '' || brewery.country === nationFilter) // Add the nation filter
    );

  const getBreweryTypeData = () => {
    const typeCounts = breweries.reduce((acc, brewery) => {
      const type = brewery.brewery_type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(typeCounts).map(([type, count]) => ({ type, count }));
  };

  const getBreweryStateData = () => {
    const stateCounts = breweries.reduce((acc, brewery) => {
      const state = brewery.state;
      acc[state] = (acc[state] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(stateCounts).map(([state, count]) => ({ state, count }));
  };

  const getBreweryNationData = () => {
    const nationCounts = breweries.reduce((acc, brewery) => {
        const nation = brewery.country;
        acc[nation] = (acc[nation] || 0) + 1;
        return acc;
    }, {});

    return Object.entries(nationCounts).map(([nation, count]) => ({ nation, count }));
    };
    


    const toggleVisualization = () => {
        if (visualizationType === 'type') {
          setVisualizationType('state');
        } else if (visualizationType === 'state') {
          setVisualizationType('nation');
        } else {
          setVisualizationType('type');
        }
      };

  return (
    <div>
      <h2>Brewery Visualization</h2>
      <button onClick={toggleVisualization}>
        {visualizationType === 'type' ? 'Show by US State' : visualizationType === 'state' ? 'Show by Nation' : 'Show by Type'}
      </button>

      <ResponsiveContainer width="100%" height={300}>
        {visualizationType === 'type' ? (
          <BarChart data={getBreweryTypeData()}>
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        ) : visualizationType === 'state' ? (
          <BarChart data={getBreweryStateData()}>
            <XAxis dataKey="state" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        ) : (
          <BarChart data={getBreweryNationData()}>
            <XAxis dataKey="nation" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#ff7300" />
          </BarChart>
        )}
      </ResponsiveContainer>

      <button className="load" onClick={() => setPage(prevPage => prevPage + 1)}>
        Load More Breweries
      </button>
      <p> </p>

      <input 
        type="text" 
        placeholder="Search breweries..." 
        onChange={(e) => setSearchTerm(e.target.value)} 
      />
      <p> </p>
      
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
      <p> </p>

      <label>Filter by state (US only):</label>
      <select onChange={(e) => setStateFilter(e.target.value)} value={stateFilter}>
        <option value="">All</option>
        {US_STATES.map(state => (
          <option key={state} value={state}>{state}</option>
        ))}
      </select>
        <p> </p>

      {/* Nation Filter */}
      <label>Filter by nation:</label>
      <select onChange={(e) => setNationFilter(e.target.value)} value={nationFilter}>
        <option value="">All</option>
        {NATIONS.map(nation => (
          <option key={nation} value={nation}>{nation}</option>
        ))}
      </select>

      <div className='brews'>
        {filteredBreweries.map(brewery => (
          <div key={brewery.id} className='brewsco' id={brewery.brewery_type}>
            <h2><Link to={`/brewery/${brewery.id}`}>{brewery.name}</Link></h2>
            <p>{brewery.brewery_type}</p>
            <p>{brewery.city}, {brewery.state}</p>
            <p>{brewery.phone}</p>
            <button onClick={() => window.open(brewery.website_url)}>Visit Website</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
