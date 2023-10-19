import { NavLink, useLocation } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

const SecNavbar = () => {
  const path = useLocation().pathname;
  const secNavInfo = [
    { currentPath: '/bancoInternacional/',
      pageTitle: 'Inicio',
      secNavLinks: {}
    },
    { currentPath: '/bancoInternacional/hedges',
      pageTitle: 'Coberturas',
      secNavLinks: {
        1: { url:'/bancoInternacional/hedges', title:'Listado coberturas'},
        2: { url:'/bancoInternacional/hedges-new', title:'Nueva Alta'},
      }
    },
    { currentPath: '/bancoInternacional/hedges-new',
      pageTitle: 'Coberturas',
      secNavLinks: {
        1: { url:'/bancoInternacional/hedges', title:'Listado coberturas'},
        2: { url:'/bancoInternacional/hedges-new', title:'Nueva Alta'},
      }
    },
    { currentPath: '/bancoInternacional/hedges-status',
      pageTitle: 'Status coberturas',
      secNavLinks: {
        1: { url:'/bancoInternacional/hedges', title:'Listado coberturas'},
        2: { url:'/bancoInternacional/hedges-new', title:'Nueva Alta'},
      }
    },
    { currentPath: '/bancoInternacional/hedges-disarm',
      pageTitle: 'Desarme coberturas',
      secNavLinks: {
        1: { url:'/bancoInternacional/hedges', title:'Listado coberturas'},
        2: { url:'/bancoInternacional/hedges-new', title:'Nueva Alta'},
      }
    },
    { currentPath: '/bancoInternacional/users',
      pageTitle: 'Usuarios',
      secNavLinks: {
        1: { url:'/bancoInternacional/users',title:'Usuarios registrados'},
        2: { url:'/bancoInternacional/users-new',title:'Alta nuevo usuario'},
      }
    },
    { currentPath: '/bancoInternacional/users-new',
      pageTitle: 'Alta nuevo usuario',
      secNavLinks: {
        1: { url:'/bancoInternacional/users',title:'Usuarios registrados'},
        2: { url:'/bancoInternacional/users-new',title:'Alta nuevo usuario'},
      }
    },
    { currentPath: '/bancoInternacional/users-edit',
      pageTitle: 'Editar',
      secNavLinks: {
        1: { url:'/bancoInternacional/users',title:'Usuarios registrados'},
        2: { url:'/bancoInternacional/users-new',title:'Alta nuevo usuario'},
      }
    },
  ]

  const currentInfo = secNavInfo.find(item => item.currentPath === path);
  let secNavLinks = Object.values(currentInfo.secNavLinks);
  

  return(
    <>
    <div className='bi-l-header__sec-bar'>
        <div className="bi-l-container">
          <nav className="bi-c-navbar bi-c-navbar--secondary">
            <div className="bi-c-navbar__left bi-u-gray-text">              
              {currentInfo.pageTitle}
            </div>
            <div className="bi-c-navbar__center"> 
              {
                secNavLinks.map(item => {
                  return (
                    <NavLink
                      key={uuidv4()}
                      to={item.url}
                      className={({isActive}) =>
                        isActive ? 'bi-u-text-link bi-u-text-link__active' : 'bi-u-text-link'}>
                      {item.title}
                    </NavLink>
                  );
                })              
             }
            </div>
          </nav>
        </div>
      </div>        
    </>
  );
}

export default SecNavbar;