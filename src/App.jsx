import { useRoutes, BrowserRouter } from 'react-router-dom'
import Login from './pages/Login'
import Users from './pages/Users'
import NewUser from './pages/NewUser'
import './scss/styles.scss'

const AppRoutes = () => {
  let routes = useRoutes([
    { path: '/login', element: <Login/> },
    { path: '/users', element: <Users/> },
    { path: '/new-user', element: <NewUser/> }
  ])
      
      

  return routes;
}

const App = () => {
  return (
    <>
      <BrowserRouter>
        <AppRoutes/>
      </BrowserRouter>
    </>
  )
}

export default App
