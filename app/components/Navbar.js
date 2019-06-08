import Link from 'next/link';
import { Button } from 'react-bootstrap';
import Theme from '../components/Theme';

const removeCanvas = () => {
  const canvas = document.getElementsByTagName('canvas')

  document.body.removeChild(canvas[0])
  document.body.removeChild(window.statsElement)
}

const Navbar = (props) => (
  <div className="navbar">
    <Link href="/upload">
      <div>
        <a onClick={removeCanvas}>Upload Trial Data</a>
      </div>
    </Link>
  </div>
);

export default Navbar;
