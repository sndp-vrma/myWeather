import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import styled from 'styled-components';

import Search from './components/Search/Search';
import Forecast from './containers/Forecast/Forecast';
import Error from './components/Error/Error';

const Application = styled.div`
  text-align: center;
  width: 1000px;
  margin: 0 auto;

  @media (max-width: 1000px) {
    width: 100%;
  }
`;

const Card = styled.div`
  margin-top: 200px;
  height: 600px;
  background-color: white;
  box-shadow: 0 0 10px 2px rgba(0, 0, 0, .25);

  @media (max-width: 1000px) {
    height: 100vh;
    margin-top: 0;
  }
`;

const apiKey = 'dbb624c32c7f0d652500552c5ebbde56';

class App extends Component {
  state = {
    city: '',
    forecast: null,
    error: {
      state: false,
      message: ''
    }
  }

  getForecastByCity = (e) => {
    e.preventDefault();

    fetch(`https://api.openweathermap.org/data/2.5/forecast/daily?q=${this.state.city}&units=metric&cnt=8&appid=${apiKey}`)
      .then(response => response.json())
      .then(json => {
        if (json.cod !== '200') {
          this.setState({ error: { state: true, message: json.message }});
        } else {
          this.setState({ forecast: json.list });
        }
      })
      .catch(error => this.setState({ error: { state: true }}));
  }

  handleCityInput = (city) => {
    this.setState({ city });
  }

  clear = () => {
    this.setState({ city: '', forecast: null, error: { state: false }});
  }

  changeUnit = (currentTempUnit) => {
    const updatedForecast = [...this.state.forecast];
    updatedForecast.forEach(day => {
      Object.keys(day.temp).forEach(key => {
        day.temp[key] = currentTempUnit === 'F' ? 9 / 5 * day.temp[key] + 32 : 5 / 9 * (day.temp[key] - 32);
      });
    });

    this.setState({ forecast: updatedForecast });
  }

  render() {
    const cardContent = this.state.forecast
      ? <Forecast
          back={this.clear}
          forecast={this.state.forecast}
          city={this.state.city}
          changeUnit={this.changeUnit}
        />
      : <Search
          getForecastByCity={this.getForecastByCity}
          textChanged={this.handleCityInput}
          city={this.state.city}
        />;

    return (
      <MuiThemeProvider>
        <Application>
          <Card>
            {!this.state.error.state ? cardContent : <Error back={this.clear} message={this.state.error.message} />}
          </Card>
        </Application>
      </MuiThemeProvider>
    );
  }
}

export default App;
