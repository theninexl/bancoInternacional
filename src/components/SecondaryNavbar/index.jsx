import { NavLink, useLocation } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

const SecNavbar = ({ currentPath }) => {
  const path = useLocation().pathname;
  console.log('path en secNavbar',currentPath);

  const secNavInfo = [
    { currentPath: `${currentPath}`,
      pageTitle: 'Inicio',
      secNavLinks: {}
    },
    { currentPath: `${currentPath}login`,
      pageTitle: 'Login',
      secNavLinks: {}
    },
    { currentPath: `${currentPath}hedges`,
      pageTitle: 'Coberturas',
      secNavLinks: {
        1: { url:'/hedges', title:'Listar coberturas'},
        2: { url:'/hedges-new', title:'Crear cobertura'},
        3: { url:'/hedges-pending-validations', title:'Validaciones pendientes'},
        4: { url:'/hedges-efficacy-test', title:'Test de eficacia'},
      }
    },
    { currentPath: `${currentPath}hedges-new`,
      pageTitle: 'Coberturas',
      secNavLinks: {
        1: { url:'/hedges', title:'Listar coberturas'},
        2: { url:'/hedges-new', title:'Crear cobertura'},
        3: { url:'/hedges-pending-validations', title:'Validaciones pendientes'},
        4: { url:'/hedges-efficacy-test', title:'Test de eficacia'},
      }
    },
    { currentPath: `${currentPath}hedges-pending-validations`,
      pageTitle: 'Coberturas',
      secNavLinks: {
        1: { url:'/hedges', title:'Listar coberturas'},
        2: { url:'/hedges-new', title:'Crear cobertura'},
        3: { url:'/hedges-pending-validations', title:'Validaciones pendientes'},
        4: { url:'/hedges-efficacy-test', title:'Test de eficacia'},
      }
    },
    { currentPath: `${currentPath}hedges-status-det`,
      pageTitle: 'Coberturas',
      secNavLinks: {
        1: { url:'/hedges', title:'Listar coberturas'},
        2: { url:'/hedges-new', title:'Crear cobertura'},
        3: { url:'/hedges-pending-validations', title:'Validaciones pendientes'},
        4: { url:'/hedges-efficacy-test', title:'Test de eficacia'},
      }
    },
    { currentPath: `${currentPath}hedges-disarm`,
      pageTitle: 'Coberturas',
      secNavLinks: {
        1: { url:'/hedges', title:'Listar coberturas'},
        2: { url:'/hedges-new', title:'Crear cobertura'},
        3: { url:'/hedges-pending-validations', title:'Validaciones pendientes'},
        4: { url:'/hedges-efficacy-test', title:'Test de eficacia'},
      }
    },
    { currentPath: `${currentPath}hedges-efficacy-test`,
      pageTitle: 'Coberturas',
      secNavLinks: {
        1: { url:'/hedges', title:'Listar coberturas'},
        2: { url:'/hedges-new', title:'Crear cobertura'},
        3: { url:'/hedges-pending-validations', title:'Validaciones pendientes'},
        4: { url:'/hedges-efficacy-test', title:'Test de eficacia'},
      }
    },
    { currentPath: `${currentPath}mgmt-balance-view`,
      pageTitle: 'Gestión de balance',
      secNavLinks: {
        1: { url:'/mgmt-balance-view', title:'Vista balance'}
      }
    },
    { currentPath: `${currentPath}users`,
      pageTitle: 'Usuarios',
      secNavLinks: {
        1: { url:'/users',title:'Listar usuarios'},
        2: { url:'/users-new',title:'Crear usuario'},
      }
    },
    { currentPath: `${currentPath}users-new`,
      pageTitle: 'Usuarios',
      secNavLinks: {
        1: { url:'/users',title:'Listar usuarios'},
        2: { url:'/users-new',title:'Crear usuario'},
      }
    },
    { currentPath: `${currentPath}users-edit`,
      pageTitle: 'Usuarios',
      secNavLinks: {
        1: { url:'/users',title:'Listar usuarios'},
        2: { url:'/users-new',title:'Crear usuario'},
      }
    },
  ]

  // const secNavInfo = [
  //   { currentPath: `${path}`,
  //     pageTitle: 'Inicio',
  //     secNavLinks: {}
  //   },
  //   { currentPath: `${path}hedges`,
  //     pageTitle: 'Coberturas',
  //     secNavLinks: {
  //       1: { url:'/hedges', title:'Listar coberturas'},
  //       2: { url:'/hedges-new', title:'Crear cobertura'},
  //       3: { url:'/hedges-pending-validations', title:'Validaciones pendientes'},
  //       4: { url:'/hedges-efficacy-test', title:'Test de eficacia'},
  //     }
  //   },
  //   { currentPath: `${path}hedges-new`,
  //     pageTitle: 'Coberturas',
  //     secNavLinks: {
  //       1: { url:'/hedges', title:'Listar coberturas'},
  //       2: { url:'/hedges-new', title:'Crear cobertura'},
  //       3: { url:'/hedges-pending-validations', title:'Validaciones pendientes'},
  //       4: { url:'/hedges-efficacy-test', title:'Test de eficacia'},
  //     }
  //   },
  //   { currentPath: `${path}hedges-pending-validations`,
  //     pageTitle: 'Coberturas',
  //     secNavLinks: {
  //       1: { url:'/hedges', title:'Listar coberturas'},
  //       2: { url:'/hedges-new', title:'Crear cobertura'},
  //       3: { url:'/hedges-pending-validations', title:'Validaciones pendientes'},
  //       4: { url:'/hedges-efficacy-test', title:'Test de eficacia'},
  //     }
  //   },
  //   { currentPath: `${path}hedges-status-det`,
  //     pageTitle: 'Coberturas',
  //     secNavLinks: {
  //       1: { url:'/hedges', title:'Listar coberturas'},
  //       2: { url:'/hedges-new', title:'Crear cobertura'},
  //       3: { url:'/hedges-pending-validations', title:'Validaciones pendientes'},
  //       4: { url:'/hedges-efficacy-test', title:'Test de eficacia'},
  //     }
  //   },
  //   { currentPath: `${path}hedges-disarm`,
  //     pageTitle: 'Coberturas',
  //     secNavLinks: {
  //       1: { url:'/hedges', title:'Listar coberturas'},
  //       2: { url:'/hedges-new', title:'Crear cobertura'},
  //       3: { url:'/hedges-pending-validations', title:'Validaciones pendientes'},
  //       4: { url:'/hedges-efficacy-test', title:'Test de eficacia'},
  //     }
  //   },
  //   { currentPath: `${path}hedges-efficacy-test`,
  //     pageTitle: 'Coberturas',
  //     secNavLinks: {
  //       1: { url:'/hedges', title:'Listar coberturas'},
  //       2: { url:'/hedges-new', title:'Crear cobertura'},
  //       3: { url:'/hedges-pending-validations', title:'Validaciones pendientes'},
  //       4: { url:'/hedges-efficacy-test', title:'Test de eficacia'},
  //     }
  //   },
  //   { currentPath: `${path}mgmt-balance-view`,
  //     pageTitle: 'Gestión de balance',
  //     secNavLinks: {
  //       1: { url:'/mgmt-balance-view', title:'Vista balance'}
  //     }
  //   },
  //   { currentPath: `${path}users`,
  //     pageTitle: 'Usuarios',
  //     secNavLinks: {
  //       1: { url:'/users',title:'Listar usuarios'},
  //       2: { url:'/users-new',title:'Crear usuario'},
  //     }
  //   },
  //   { currentPath: `${path}users-new`,
  //     pageTitle: 'Usuarios',
  //     secNavLinks: {
  //       1: { url:'/users',title:'Listar usuarios'},
  //       2: { url:'/users-new',title:'Crear usuario'},
  //     }
  //   },
  //   { currentPath: `${path}users-edit`,
  //     pageTitle: 'Usuarios',
  //     secNavLinks: {
  //       1: { url:'/users',title:'Listar usuarios'},
  //       2: { url:'/users-new',title:'Crear usuario'},
  //     }
  //   },
  // ]

  const currentInfo = secNavInfo.find(item => item.currentPath === path);
  const secondaryLinks = Object.values(currentInfo.secNavLinks);  

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
                secondaryLinks.map(item => {
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