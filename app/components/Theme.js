import PropTypes from 'prop-types';
import BootstrapStyle from '../styles/vendor/bootstrap.min.css';
import AppStyle from '../styles/app.scss';

const Theme = ({ children }) => (
    <div className="app-container">
        <style dangerouslySetInnerHTML={{ __html: BootstrapStyle }} />
        <style dangerouslySetInnerHTML={{ __html: AppStyle }} />

        {children}
    </div>
);

Theme.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.element),
        PropTypes.element
    ]).isRequired,
};

export default Theme;
