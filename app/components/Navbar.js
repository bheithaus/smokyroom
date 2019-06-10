import Link from 'next/link';
import { Button } from 'react-bootstrap';
import Theme from '../components/Theme';

const removeCanvas = () => {
  const canvas = document.getElementsByTagName('canvas')

  console.log('remove canvas!', canvas)
  document.body.removeChild(canvas[0])
  document.body.removeChild(window.statsElement)
}

const Navbar = (props) => (
  <div className="navbar">
    <Link href="/upload">
      <div className="btn-wrapper">
        <div className="btn-wrapper__container" onClick={removeCanvas}>
          <div className="btn-inner">
            <a className="btn-inner__text">Upload Trial Data</a>
          </div>
        </div>
      </div>
    </Link>
  </div>
);

export default Navbar;
