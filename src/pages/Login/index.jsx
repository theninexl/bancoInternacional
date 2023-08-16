import { useRef } from "react";
import Api from '../../services/api'

function Login(){
  const form = useRef(null); 
  

  const HandleLogin = (e) => {    
    e.preventDefault();
    const formData = new FormData(form.current);
    const data = {
      email: formData.get('loginEmail'),
      password: formData.get('loginPwd')
    }    
    console.log(data);

    Api.post('login',{
      email:data.email,
      password:data.password
    })
    .then(res => console.log('res',res))
    .catch(err => console.log('err',err))
  }

  return(
    <>
      <header className="bi-l-header">
        <div className="bi-l-container">
          <nav className="bi-c-navbar">
            <div className="bi-c-navbar__left">
              <a className="bi-o-logo">
                <span className="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21.721 12.752a9.711 9.711 0 00-.945-5.003 12.754 12.754 0 01-4.339 2.708 18.991 18.991 0 01-.214 4.772 17.165 17.165 0 005.498-2.477zM14.634 15.55a17.324 17.324 0 00.332-4.647c-.952.227-1.945.347-2.966.347-1.021 0-2.014-.12-2.966-.347a17.515 17.515 0 00.332 4.647 17.385 17.385 0 005.268 0zM9.772 17.119a18.963 18.963 0 004.456 0A17.182 17.182 0 0112 21.724a17.18 17.18 0 01-2.228-4.605zM7.777 15.23a18.87 18.87 0 01-.214-4.774 12.753 12.753 0 01-4.34-2.708 9.711 9.711 0 00-.944 5.004 17.165 17.165 0 005.498 2.477zM21.356 14.752a9.765 9.765 0 01-7.478 6.817 18.64 18.64 0 001.988-4.718 18.627 18.627 0 005.49-2.098zM2.644 14.752c1.682.971 3.53 1.688 5.49 2.099a18.64 18.64 0 001.988 4.718 9.765 9.765 0 01-7.478-6.816zM13.878 2.43a9.755 9.755 0 016.116 3.986 11.267 11.267 0 01-3.746 2.504 18.63 18.63 0 00-2.37-6.49zM12 2.276a17.152 17.152 0 012.805 7.121c-.897.23-1.837.353-2.805.353-.968 0-1.908-.122-2.805-.353A17.151 17.151 0 0112 2.276zM10.122 2.43a18.629 18.629 0 00-2.37 6.49 11.266 11.266 0 01-3.746-2.504 9.754 9.754 0 016.116-3.985z" />
                </svg>
                </span>
              Banco Internacional
              </a>
            </div>
            <div className="bi-c-navbar__center">
              <a className="bi-u-text-link bi-u-text-link__active">Lorem ipsum</a>
              <a className="bi-u-text-link">Dolor sit</a>
              <a className="bi-u-text-link bi-u-text-link__inactive">Amet consecteur</a>
            </div>
            <div className="bi-c-navbar__right">
              <a className="bi-c-navbar-links__textbutt" id="activeUserBtn">Login<svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z" clipRule="evenodd" />
              </svg>
              </a>
              <a className="bi-c-navbar-links__textbutt" id="activeUserBtn"><svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" /></svg><span className="username">Username</span></a>
            </div>
          </nav>
        </div>
      </header>
       <main className="bi-u-centerAbs bi-u-h-screen">
        <section className="bi-l-4col">
          <form
            id="loginPageForm"
            className="bi-c-form-simple bi-l-form-simple" 
            ref={form} >
            <div className="bi-l-form-simple__row">
              <label htmlFor="loginEmail">
                <span>Email</span>
                <input 
                  type="email" 
                  id="loginEmail" 
                  name="loginEmail" 
                  placeholder="Email"/>
            </label>
            </div>
            <div className="bi-l-form-simple__row">
              <label htmlFor="loginPwd">
                <span>Password</span>
                <input 
                  type="password" 
                  id="loginPwd" 
                  name="loginPwd" 
                  placeholder="Password" />
            </label>
            </div>
            <div className="bi-l-form-simple__row">
              <button 
                type="submit"
                id="loginPageSubmitBtn" 
                className="bi-o-button-large--primary" 
                value="Login"
                onClick={HandleLogin}>Login</button>
            </div>
          </form>
        </section>
      </main>
    </>
  )
}

export default Login;