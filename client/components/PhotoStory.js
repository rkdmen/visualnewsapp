import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router';
import axios from 'axios';
import { Grid, Row, Col } from 'react-bootstrap';

class PhotoStory extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object
  }
  constructor(props) {
    super(props)

    this.state = {
      photos: [],
      currentPhotos: [],
      currentPhotoIndex: 1
    }
  }

  getPhotos(source, section, time) {
    axios
    .get('api/Large', {
      params: {
        source: source || 'all',
        section: section || 'all',
        time: time || '24',
        limit: 20,
        offset: 0
      }
    })
    .then((response) => {
      var multimediaPhotos = response.data.results
      .filter((photo) => photo.multimedia.length === 4)
      this.setState({
        photos: multimediaPhotos,
        currentPhotos: multimediaPhotos.slice(0, this.state.currentPhotoIndex)
      })
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  getNextPhoto(e) {
    var index = this.state.currentPhotoIndex + 1
    var last = this.state.photos.length - 1
    if(index > last) {
      e.preventDefault()
      return null
    }
    var photos = this.state.photos.slice(index - 1, index)
    this.setState({
      currentPhotoIndex: index,
      currentPhotos: photos
    })
    e.preventDefault()
  }

  getPreviousPhoto(e) {
    var index = this.state.currentPhotoIndex - 1
    if(index < 1) {e.preventDefault(); return null}
    var photos = this.state.photos.slice(index - 1, index)
    this.setState({
      currentPhotoIndex: index,
      currentPhotos: photos
    })
    e.preventDefault()
  }

  componentDidMount() {
    this.getPhotos('all', 'all', '24');
  }


  render() {
    return (
      <div>
        {this.state.currentPhotos.map((photo, i) =>
              <div style={divStyles} key={i} >
                <a style={center} href={photo.url}>
                  <img className="grow" src={photo.multimedia[3].url} />
                </a>
                <div>
                  {/* <div style={divStyles}> */}
                    <button style={buttonRight} onClick={this.getNextPhoto.bind(this)}>Next</button>
                    <button style={buttonLeft} onClick={this.getPreviousPhoto.bind(this)}>Previous</button>
                  {/* </div> */}
                </div>
                <div style={centerAbstract}>{photo.abstract}</div>
              </div>
        )}
      </div>
    )

  }
}

//styles to attach to style attribute of elements
var center = {
  'text-align': 'center'
}
var centerAbstract = {
     'width': '50%',
     'height': '50%',
      'margin': '0 auto'
}
var buttonRight = {
  'background-color': 'white',
   'border-radius': '8px',
   'margin': '3px',
   'width': '20%',
   'float': 'right'
}
var buttonLeft = {
  'background-color': 'white',
   'border-radius': '8px',
   'margin': '3px',
   'width': '20%',
   'float': 'left'
}
var divStyles = {
  'color': 'black',
  'fontFamily': 'sans-serif',
  'display': 'flex',
  'justify-content': 'center',
  'flex-direction':'column',
  'align-text': 'center',
  'padding': '5px',
  'margin': '5px'
  // 'width': '80%',
  // 'height': '90%'
}

export default PhotoStory;
