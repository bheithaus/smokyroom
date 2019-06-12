import Link from 'next/link';
import { Button } from 'react-bootstrap';
import Theme from '../components/Theme';
import { Component } from 'react'

class SmokyRoom extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Theme>
        <script src="js/three.min.js"></script>

        <script src="js/Detector.js"></script>
        <script src="js/Stats.js"></script>
        <script src="js/OrbitControls.js"></script>
        <script src="js/HousePlaneRenderOptions.js"></script>

        <script src="js/jquery-1.9.1.js"></script>
        <script src="js/jquery-ui.js"></script>

        <link rel="stylesheet" href="css/base.css"/>

        <link rel="stylesheet" href="css/jquery-ui.css" />
        <link rel="stylesheet" href="css/info.css"/>
        <link rel="stylesheet" href="css/index.css"/>

        <script src="js/SmokyRoom.js"></script>

        <div id="canvas-holder"></div>

        <div id="pm-readings">
          <div className="title">Particulate Matter Readings</div>
          <div>
            <div className="">Paused:
              <input type="checkbox" value="paused"/>
            </div>

            <div className="">Speed: <span id="speed"></span></div>
            <div id="speed-slider"></div>
            <div className="">Elapsed Time (seconds): <span id="elapsed-time"></span></div>
            <div id="time-slider"></div>
            <div>Sensor Ref: <span id="sensor-reference"></span></div>
            <div>Particulate Matter: <span id="pm"></span></div>
            <div>Min: <span id="min"></span></div>
            <div>Max: <span id="max"></span></div>
          </div>
        </div>
      </Theme>
    );
  }
}

export default SmokyRoom;
