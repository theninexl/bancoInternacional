import { NavLink, useLocation } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

const SecNavbar = () => {
  const path = useLocation().pathname;

  const secNavInfo = [
    { currentPath: '/hedges',
      pageTitle: 'Coberturas',
      secNavLinks: {
        1: { url:'/hedges', title:'Listado coberturas'},
        2: { url:'/hedges-new', title:'Nueva Alta'},
      }
    },
    { currentPath: '/hedges-new',
      pageTitle: 'Coberturas',
      secNavLinks: {
        1: { url:'/hedges', title:'Listado coberturas'},
        2: { url:'/hedges-new', title:'Nueva Alta'},
      }
    },
    { currentPath: '/hedges-status',
      pageTitle: 'Status coberturas',
      secNavLinks: {
        1: { url:'/hedges', title:'Listado coberturas'},
        2: { url:'/hedges-new', title:'Nueva Alta'},
      }
    },
    { currentPath: '/hedges-disarm',
      pageTitle: 'Desarme coberturas',
      secNavLinks: {
        1: { url:'/hedges', title:'Listado coberturas'},
        2: { url:'/hedges-new', title:'Nueva Alta'},
      }
    },
    { currentPath: '/users',
      pageTitle: 'Usuarios',
      secNavLinks: {
        1: { url:'/users',title:'Usuarios registrados'},
        2: { url:'/users-new',title:'Alta nuevo usuario'},
      }
    },
    { currentPath: '/users-new',
      pageTitle: 'Alta nuevo usuario',
      secNavLinks: {
        1: { url:'/users',title:'Usuarios registrados'},
        2: { url:'/users-new',title:'Alta nuevo usuario'},
      }
    },
    { currentPath: '/users-edit',
      pageTitle: 'Editar',
      secNavLinks: {
        1: { url:'/users',title:'Usuarios registrados'},
        2: { url:'/users-new',title:'Alta nuevo usuario'},
      }
    },
  ]

  const currentInfo = secNavInfo?.find(item => item.currentPath === path);
  let secNavLinks = Object.values(currentInfo?.secNavLinks);
  

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
                secNavLinks?.map(item => {
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