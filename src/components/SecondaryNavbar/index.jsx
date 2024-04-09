import { NavLink, useLocation } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

const SecNavbar = ({ currentPath,account }) => {
  const path = useLocation().pathname;
  const parsedAccount = JSON.parse(account);
  //console.log('parsedAccount', parsedAccount);

  const secNavInfo = [
    { currentPath: `/`,
      pageTitle: 'Inicio',
      secNavLinks: {}
    },
    { currentPath: `/login`,
      pageTitle: 'Login',
      secNavLinks: {}
    },
    { currentPath: `/hedges`,
      pageTitle: 'Coberturas',
      secNavLinks: {
        1: { url:'/hedges', title:'Listar coberturas', forbidden:''},
        2: { url:'/hedges-new', title:'Crear cobertura', forbidden:2},
        3: { url:'/hedges-pending-validations', title:'Validaciones pendientes', forbidden:''},
        4: { url:'/hedges-efficacy-test', title:'Test de eficacia', forbidden:1},
      }
    },
    { currentPath: `/hedges-new`,
      pageTitle: 'Coberturas',
      secNavLinks: {
        1: { url:'/hedges', title:'Listar coberturas', forbidden:''},
        2: { url:'/hedges-new', title:'Crear cobertura', forbidden:2},
        3: { url:'/hedges-pending-validations', title:'Validaciones pendientes', forbidden:''},
        4: { url:'/hedges-efficacy-test', title:'Test de eficacia', forbidden:1},
      }
    },
    { currentPath: `/hedges-pending-validations`,
      pageTitle: 'Coberturas',
      secNavLinks: {
        1: { url:'/hedges', title:'Listar coberturas', forbidden:''},
        2: { url:'/hedges-new', title:'Crear cobertura', forbidden:2},
        3: { url:'/hedges-pending-validations', title:'Validaciones pendientes', forbidden:''},
        4: { url:'/hedges-efficacy-test', title:'Test de eficacia', forbidden:1},
      }
    },
    { currentPath: `/hedges-status-det`,
      pageTitle: 'Coberturas',
      secNavLinks: {
        1: { url:'/hedges', title:'Listar coberturas', forbidden:''},
        2: { url:'/hedges-new', title:'Crear cobertura', forbidden:2},
        3: { url:'/hedges-pending-validations', title:'Validaciones pendientes', forbidden:''},
        4: { url:'/hedges-efficacy-test', title:'Test de eficacia', forbidden:1},
      }
    },
    { currentPath: `/hedges-disarm`,
      pageTitle: 'Coberturas',
      secNavLinks: {
        1: { url:'/hedges', title:'Listar coberturas', forbidden:''},
        2: { url:'/hedges-new', title:'Crear cobertura', forbidden:2},
        3: { url:'/hedges-pending-validations', title:'Validaciones pendientes', forbidden:''},
        4: { url:'/hedges-efficacy-test', title:'Test de eficacia', forbidden:1},
      }
    },
    { currentPath: `/hedges-efficacy-test`,
      pageTitle: 'Coberturas',
      secNavLinks: {
        1: { url:'/hedges', title:'Listar coberturas', forbidden:''},
        2: { url:'/hedges-new', title:'Crear cobertura', forbidden:2},
        3: { url:'/hedges-pending-validations', title:'Validaciones pendientes', forbidden:''},
        4: { url:'/hedges-efficacy-test', title:'Test de eficacia', forbidden:1},
      }
    },
    { currentPath: `/mgmt-balance-view`,
      pageTitle: 'Gestión de balance',
      secNavLinks: {
        1: { url:'/mgmt-balance-view', title:'Vista balance'}
      }
    },
    { currentPath: `/users`,
      pageTitle: 'Usuarios',
      secNavLinks: {
        1: { url:'/users',title:'Listar usuarios'},
        2: { url:'/users-new',title:'Crear usuario'},
      }
    },
    { currentPath: `/users-new`,
      pageTitle: 'Usuarios',
      secNavLinks: {
        1: { url:'/users',title:'Listar usuarios'},
        2: { url:'/users-new',title:'Crear usuario'},
      }
    },
    { currentPath: `/users-edit`,
      pageTitle: 'Usuarios',
      secNavLinks: {
        1: { url:'/users',title:'Listar usuarios'},
        2: { url:'/users-new',title:'Crear usuario'},
      }
    },
  ]

  

  const currentInfo = secNavInfo.find(item => item.currentPath === path);
  const secondaryLinks = Object.values(currentInfo.secNavLinks);
  const allowedLinks = secondaryLinks.filter(item => item.forbidden != parsedAccount.permission)

  return(
    <>
    <div className='bi-l-header__sec-bar'>
        <div className="bi-l-container">
          <nav className="bi-c-navbar bi-c-navbar--secondary">
            <div className="bi-c-navbar__left bi-u-gray-text">              
              {currentInfo.pageTitle ? currentInfo.pageTitle : ''}
            </div>
            <div className="bi-c-navbar__center"> 
              {
                allowedLinks.map(item => {
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