import { Link } from 'react-router-dom';
import { GlobeAltIcon } from '@heroicons/react/24/solid';

const Logo = () => {
  return (
    <>
    <Link
      to='/'
      className='bi-o-logo'>
        <GlobeAltIcon className='icon'/>Banco Internacional
    </Link>
    </>
  );
}

export default Logo;