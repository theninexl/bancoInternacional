import { Link } from 'react-router-dom';
import logo from '/images/logo.png'

const Logo = () => {
  return (
    <>
    <Link
      to='/'
      className='bi-o-logo'>
        <img src={logo} alt='logo' className='icon'/> Gestión de coberturas
    </Link>
    </>
  );
}

export default Logo;