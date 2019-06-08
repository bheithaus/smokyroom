import Link from 'next/link';
import { Button } from 'react-bootstrap';
import Theme from '../components/Theme';
import SmokyRoom from '../components/SmokyRoom';

// Straight away require/import scss/css just like in react.
import indexStyle from '../styles/app.scss';

const Index = (props) => (
    <div>
      <SmokyRoom trial={props.trial}/>
    </div>
);

Index.getInitialProps = ({query}) => {
  return {
    trial: query.trial
  }
}
export default Index;
