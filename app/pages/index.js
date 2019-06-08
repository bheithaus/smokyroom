import Link from 'next/link';
import { Button } from 'react-bootstrap';
import SmokyRoom from '../components/SmokyRoom';
import Navbar from '../components/Navbar';
import AppStyle from '../styles/app.scss';

// Straight away require/import scss/css just like in react.
import indexStyle from '../styles/app.scss';

const Index = (props) => (
    <div>
      <style dangerouslySetInnerHTML={{ __html: AppStyle }} />

      <SmokyRoom trial={props.trial}/>

      <Navbar />
    </div>
);

Index.getInitialProps = ({query}) => {
  return {
    trial: query.trial
  }
}
export default Index;
