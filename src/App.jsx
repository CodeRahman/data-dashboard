// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import BreweryDetail from './BreweryDetail.jsx';

const App = () => {
  const [breweries, setBreweries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [page, setPage] = useState(1);
  const [showTypeChart, setShowTypeChart] = useState(true);

  useEffect(() => {
    const fetchBreweries = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://api.openbrewerydb.org/v1/breweries?by_country=United States&per_page=200&page=${page}`);
        const data = await response.json();
        setBreweries(prevBreweries => [...prevBreweries, ...data]);
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

  const filteredBreweries = breweries.filter(brewery =>
    brewery.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterType === '' || brewery.brewery_type === filterType) &&
    (stateFilter === '' || brewery.state === stateFilter)
  );

  const typeData = filteredBreweries.reduce((acc, brewery) => {
    const type = brewery.brewery_type;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const stateData = filteredBreweries.reduce((acc, brewery) => {
    const state = brewery.state;
    acc[state] = (acc[state] || 0) + 1;
    return acc;
  }, {});

  const typeChartData = Object.keys(typeData).map(key => ({ type: key, count: typeData[key] }));
  const stateChartData = Object.keys(stateData).map(key => ({ state: key, count: stateData[key] }));

  return (
    <Router>
      <div>
        <h1>Brewery Dashboard</h1>

        <input type="text" placeholder="Search breweries..." onChange={(e) => setSearchTerm(e.target.value)} />

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

        <label>Filter by state:</label>
        <select onChange={(e) => setStateFilter(e.target.value)} value={stateFilter}>
          <option value="">All</option>
          {/* Generate state options dynamically */}
        </select>

        {/* Data Visualization Toggle */}
        <button onClick={() => setShowTypeChart(!showTypeChart)}>
          {showTypeChart ? 'Show State Distribution' : 'Show Type Distribution'}
        </button>

        {/* Data Visualization */}
        {showTypeChart ? (
          <BarChart width={500} height={300} data={typeChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        ) : (
          <BarChart width={500} height={300} data={stateChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="state" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        )}

        {/* List of Breweries with Links */}
        <div className="brews">
          {filteredBreweries.map(brewery => (
            <div key={brewery.id} className="brewsco" id={brewery.brewery_type}>
              <h2><Link to={`/brewery/${brewery.id}`}>{brewery.name}</Link></h2>
              <p>{brewery.brewery_type}</p>
              <p>{brewery.city}, {brewery.state}</p>
              <p>{brewery.phone}</p>
              <button onClick={() => window.open(brewery.website_url)}>Visit Website</button>
            </div>
          ))}
        </div>

        <button onClick={() => setPage(prevPage => prevPage + 1)}>Load More Breweries</button>

        {/* Define Routes */}
        <Routes>
          <Route path="/brewery/:id" element={<BreweryDetail />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
