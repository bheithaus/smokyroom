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
