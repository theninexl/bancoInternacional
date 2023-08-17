import { useRef, useContext } from "react";
import { redirect } from "react-router-dom";
import { GlobalContext } from '../../context';
import Api from '../../services/api'

function Login(){
  const context = useContext(GlobalContext)
  const form = useRef(null);   

  const HandleLogin = (e) => {    
    e.preventDefault();
    const formData = new FormData(form.current);
    const data = {
      email: formData.get('loginEmail'),
      password: formData.get('loginPwd')
    }    
    Api.call.post('users/login',{
      email:data.email,
      password:data.password
    })
    .then(res => {
      //añadir los datos de la cuenta a localStorage y context
      const stringifiedAccount = JSON.stringify(res.data);
      localStorage.setItem('account', stringifiedAccount);
      context.setAccount(res.data);
      handleSignIn()
    }).catch(err => console.warn('err',err))
  }

  //setear la key de sign-out a false en localStorage y en context, y redireccionar a la home
  const handleSignIn = () => {
    const stringifiedSignOut = JSON.stringify(false)
    localStorage.setItem('sign-out', stringifiedSignOut)
    context.setSignOut(false)
    //redireccionar a hedge accounting
    return redirect('/');
  }

  return(
    <>      
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
                  name="loginEmail" 
                  placeholder="Email"/>
              </label>
            </div>
            <div className="bi-l-form-simple__row">
              <label htmlFor="loginPwd">
                <span>Password</span>
                <input 
                  type="password" 
                  name="loginPwd" 
                  placeholder="Password" />
              </label>
            </div>
            <div className="bi-l-form-simple__row">
              <button 
                type="submit"
                className="bi-o-button-large--primary" 
                value="Login"
                onClick={HandleLogin} >
                Login
              </button>
            </div>
          </form>
        </section>
      </main>
    </>
  )
}

export default Login;