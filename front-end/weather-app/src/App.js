//App.js

import { Oval } from 'react-loader-spinner';
import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDisplay, faFrown, faSearch } from '@fortawesome/free-solid-svg-icons';
import './App.css';

function WeatherApp() {
	const [input, setInput] = useState('');
	const [weather, setWeather] = useState({
		loading: false,
		data: {},
		error: false,
	});

	const search = async (event) => {
     
			event.preventDefault();
			//setInput('');
			setWeather({ ...weather, loading: true });
			const url = 'http://localhost:8000/weather/'+input;
			await axios
				.get(url)
				.then((res) => {
					console.log('res', res);
					setWeather({ data: res.data, loading: false, error: false });
				})
				.catch((error) => {
					setWeather({ ...weather, data: {}, error: true });
					setInput('');
					console.log('error', error);
				});

	};

	return (
		<div>
		<div className="App">
			<h1 className="app-name">
				Weather App
			</h1>
			<div className="search-bar">
				<input
					type="text"
					className="city-search"
					placeholder="Enter Full City Name.."
					name="query"
					value={input}
					onChange={(event) => setInput(event.target.value)}
				/>
        	<button className='button1' variant="success" onClick={search}>search <FontAwesomeIcon icon={faSearch} /></button>
			</div>
			{weather.loading && (
				<>
					<br />
					<br />
					<Oval type="Oval" color="black" height={100} width={100} />
				</>
			)}
			{(weather.error || weather.data.cod == "404") && (
				<>
					<br />
					<br />
					<span className="error-message">
						<FontAwesomeIcon icon={faFrown} />
						<span style={{ fontSize: '20px' }}>City not found</span>
					</span>
				</>
			)}
			</div>
			{weather && weather.data && weather.data.city && (
				<div>
					
					<div className="city-name">
						<h2>
							 {weather.data.city.name}, <span>{weather.data.city.country}</span>
						</h2>
						<i>5 days forecast</i>
					</div>
				{weather.data.list && weather.data.list.map((li) => (
					<React.Fragment>
						<div className='hello'>
							<div className="results">
								<div className="date">
									<span>{li.dt_txt}</span>
								</div>
								<div className="icon-temp">
									<img className=""
										src={`https://openweathermap.org/img/wn/${li.weather[0].icon}@2x.png`}
										alt={li.weather[0].description}
									/>
									{Math.round(li.main.temp)}
									<sup className="deg">°C</sup>
								</div>
								<div className="des-wind">
									<p>{li.weather[0].description.toUpperCase()}</p>
									<p>Wind Speed: {li.wind.speed}m/s</p>
								</div>
							</div>
						</div>
					</React.Fragment>
				))}
				</div>
			)}
			
		</div>
	);
}

export default WeatherApp;
