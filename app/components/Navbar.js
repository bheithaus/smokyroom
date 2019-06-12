import Link from 'next/link';
import { Button } from 'react-bootstrap';
import Theme from '../components/Theme';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';

// Hack to work with non-react implementation of Three.js scene
const removeCanvas = () => {
  const canvas = document.getElementsByTagName('canvas')

  document.body.removeChild(canvas[0])
  document.body.removeChild(window.statsElement)
}

// TODO - put drop down select with test trials loaded
const Navbar = (props) => {
  const [selectOptions, setSelectOptions] = useState([]);
  const [selected, setSelected] = useState();

  const selectHandleChange = selectedOption => {
    setSelected(selectedOption);

    window.location = window.location.origin + `/?trial=${ selectedOption.value }`
  };

  useEffect(() => {
    const AVAILABLE_TRIALS_URL = '/api/trials';

    const fetchAvailableTrials = async () => {
      try {
        const response = await axios.get(AVAILABLE_TRIALS_URL);
        const options = response.data.map(trial => {
          return { value: trial, label: trial };
        });

        setSelectOptions(options);
      } catch (e) {
        console.log(e);
      }
    };
    fetchAvailableTrials();
  }, []);

  const selectWithData = () => {
    if (!selectOptions.length) {
      return null;
    }

    return (
      <Select
          value={selected}
          onChange={selectHandleChange}
          options={selectOptions}
        />
    )
  }

  return (
    <div className="navbar">
      <Link href="/upload">
        <div className="btn btn-primary">
          <div onClick={removeCanvas}>
            Upload Trial Data
          </div>
        </div>
      </Link>

      <div id="select-trial">Select Trial</div>

      {selectWithData()}

    </div>
  );
}

export default Navbar;
