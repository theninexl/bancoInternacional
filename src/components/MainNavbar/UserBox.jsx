import { Link } from 'react-router-dom';
import { UserCircleIcon } from '@heroicons/react/24/solid';

const UserBox = ({ handleClick, username }) => {
  return (
    <Link
      className='bi-c-navbar-links__textbutt'
      onClick={handleClick}>
        <UserCircleIcon className='icon'/><span className="username">{username}</span>
    </Link> 
  );
}
export default UserBox;