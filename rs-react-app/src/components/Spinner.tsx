import './Spinner.scss';
import { Component } from 'react';
import Pokebal from '../assets/pokeball.svg';

export default class Spinner extends Component {
  render() {
    return (
      <div className="container">
        <div className="spinner__wrapper">
          <div>
            <img
              className="spinner"
              src={Pokebal}
              alt="Loading..."
              width="80"
              height="80"
            />
          </div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }
}
