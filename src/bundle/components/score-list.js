import React from 'react';
import {Item} from "./item";

export default class ScoreList extends React.Component {
  render() {
    if (this.props.spots == null) {
      return alert('AAAA')
    }

    return (
        <table>
          <tbody>
          {this.props.spots.map((spot, index) => (
              <Item key={index} file={spot.file} score={spot.score}/>
          ))}
          </tbody>
        </table>
    )
  }
}