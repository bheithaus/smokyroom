import React, { Component, useState } from 'react'

import Link from 'next/link'
import Router from 'next/router';

import { Button } from 'react-bootstrap'
import Theme from '../components/Theme'

class Upload extends Component {
  constructor(props) {
    super(props)

    this.state = {
      uploading: false
    }
  }

  // upload to S3
  handleFileChange(event) {
    const files = event.target.files
    const file = files[0]
    if(file == null){
      return alert('No file selected.')
    }

    this.setState({
      uploading: true
    })

    this.getSignedRequest(file)
      .then((options) => this.uploadFile(options))
  };

  getSignedRequest(file) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', `/sign-s3?file-name=${file.name}&file-type=${file.type}`);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve({
              file,
              signedRequest: JSON.parse(xhr.responseText).signedRequest
            });
          } else {
            reject(xhr.status)
          }
        }
      };
      xhr.send();
    });

  }

  uploadFile(options) {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', options.signedRequest);
    xhr.onreadystatechange = () => {
      if(xhr.readyState === 4){
        if(xhr.status === 200){
          Router.push('/upload-processing')
          // TODO - send to waiting page ?
          // then when files processed, send to home page
        }
        else{
          alert('Could not upload file.');
        }
      }
    };
    xhr.send(options.file);
  }

  render() {
    return (
      <Theme>
        <span className="heading">Please Choose a .zip file containing all CSVs for a Trial</span>
        <span className="text">The trial name will be the name of the .zip file</span>
        <div id="preloader" style={{ display: this.state.uploading ? 'block' : 'none' }}>
          <div className="spinner-sm spinner-sm-1" id="status"></div>
        </div>

        <div className="input-group file-upload">
          <label className="input-group-btn">
            <span className="btn btn-primary">
                Browse&hellip; <input type="file" style={{ display: 'none' }} onChange={(e) => this.handleFileChange(e)}/>
            </span>
          </label>
          <input type="text" className="form-control" readOnly/>
        </div>
      </Theme>
    );
  }
}

export default Upload;
