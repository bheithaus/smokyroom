import React, { Component } from 'react'

import Link from 'next/link'
import Router from 'next/router';

import { Button } from 'react-bootstrap'
import Theme from '../components/Theme'

class Upload extends Component {
  constructor(props) {
    super(props)
    this.processing = true
  }

  componentDidMount() {
    this.timer = setInterval(()=> {
      this.pollForDoneProcessing()
      .then(() => {
        // send to index page / render page
        window.location = window.location.origin + `/?trial=${ this.trialName }`
      })
    }, 3000)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
    this.timer = null
  }

  pollForDoneProcessing() {
    if (!this.trialName) {
      const urlParams = new URLSearchParams(window.location.search);
      this.trialName = urlParams.get('trial');
    }

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open('GET', `/api/is-processing-complete/${ this.trialName }`);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {

          if (xhr.status === 200) {
            // success
            resolve({
              response: JSON.parse(xhr.responseText)
            });
          } else {
            // fail
            reject(xhr.status)
          }
        }
      };
      xhr.send();
    });
  }

  render() {
    return (
      <Theme>
        <span className="heading">Upload Succeeded - ZIP file is now processing...</span>
        <div id="preloader" style={{ display: this.processing ? 'block' : 'none' }}>
          <div className="spinner-sm spinner-sm-1" id="status"></div>
        </div>
      </Theme>
    );
  }
}

export default Upload;
