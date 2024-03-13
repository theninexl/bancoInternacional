import { NavLink, useLocation } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

const SecNavbar = () => {
  const path = useLocation().pathname;
  const secNavInfo = [
    { currentPath: '/',
      pageTitle: 'Inicio',
      secNavLinks: {
        1: { url:'/', title:'Inicio'},
      }
    },
    { currentPath: '/hedges',
      pageTitle: 'Coberturas',
      secNavLinks: {
        1: { url:'/hedges', title:'Listar coberturas'},
        2: { url:'/hedges-new', title:'Crear cobertura'},
        3: { url:'/hedges-pending-validations', title:'Validaciones pendientes'},
        4: { url:'/hedges-efficacy-test', title:'Test de eficacia'},
      }
    },
    { currentPath: '/hedges-new',
      pageTitle: 'Coberturas',
      secNavLinks: {
        1: { url:'/hedges', title:'Listar coberturas'},
        2: { url:'/hedges-new', title:'Crear cobertura'},
        3: { url:'/hedges-pending-validations', title:'Validaciones pendientes'},
        4: { url:'/hedges-efficacy-test', title:'Test de eficacia'},
      }
    },
    { currentPath: '/hedges-pending-validations',
      pageTitle: 'Coberturas',
      secNavLinks: {
        1: { url:'/hedges', title:'Listar coberturas'},
        2: { url:'/hedges-new', title:'Crear cobertura'},
        3: { url:'/hedges-pending-validations', title:'Validaciones pendientes'},
        4: { url:'/hedges-efficacy-test', title:'Test de eficacia'},
      }
    },
    { currentPath: '/hedges-status-det',
      pageTitle: 'Coberturas',
      secNavLinks: {
        1: { url:'/hedges', title:'Listar coberturas'},
        2: { url:'/hedges-new', title:'Crear cobertura'},
        3: { url:'/hedges-pending-validations', title:'Validaciones pendientes'},
        4: { url:'/hedges-efficacy-test', title:'Test de eficacia'},
      }
    },
    { currentPath: '/hedges-disarm',
      pageTitle: 'Coberturas',
      secNavLinks: {
        1: { url:'/hedges', title:'Listar coberturas'},
        2: { url:'/hedges-new', title:'Crear cobertura'},
        3: { url:'/hedges-pending-validations', title:'Validaciones pendientes'},
        4: { url:'/hedges-efficacy-test', title:'Test de eficacia'},
      }
    },
    { currentPath: '/hedges-efficacy-test',
      pageTitle: 'Coberturas',
      secNavLinks: {
        1: { url:'/hedges', title:'Listar coberturas'},
        2: { url:'/hedges-new', title:'Crear cobertura'},
        3: { url:'/hedges-pending-validations', title:'Validaciones pendientes'},
        4: { url:'/hedges-efficacy-test', title:'Test de eficacia'},
      }
    },
    { currentPath: '/mgmt-balance-view',
      pageTitle: 'Gestión de balance',
      secNavLinks: {
        1: { url:'/mgmt-balance-view', title:'Vista balance'},
        2: { url:'/mgmt-bonus-view', title:'Vista bono'},
      }
    },
    { currentPath: '/mgmt-bonus-view',
      pageTitle: 'Gestión de balance',
      secNavLinks: {
        1: { url:'/mgmt-balance-view', title:'Vista balance'},
        2: { url:'/mgmt-bonus-view', title:'Vista bono'},
      }
    },
    { currentPath: '/users',
      pageTitle: 'Usuarios',
      secNavLinks: {
        1: { url:'/users',title:'Listar usuarios'},
        2: { url:'/users-new',title:'Crear usuario'},
      }
    },
    { currentPath: '/users-new',
      pageTitle: 'Usuarios',
      secNavLinks: {
        1: { url:'/users',title:'Listar usuarios'},
        2: { url:'/users-new',title:'Crear usuario'},
      }
    },
    { currentPath: '/users-edit',
      pageTitle: 'Usuarios',
      secNavLinks: {
        1: { url:'/users',title:'Listar usuarios'},
        2: { url:'/users-new',title:'Crear usuario'},
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