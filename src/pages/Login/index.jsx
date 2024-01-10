import { useRef, useState } from "react";
// import { GlobalContext } from '../../context';
import Api from '../../services/api';
import { SectionHalf } from "../../components/UI/layout/LayoutSections";
import { ButtonLPrimary } from "../../components/UI/buttons/Buttons.jsx";
import { LabelElement, SimpleFormHrz, SimpleFormRow } from "../../components/UI/forms/SimpleForms";


function Login({ setAccount,setSignOut }){
  // const context = useContext(GlobalContext)
  const [loginError, setLoginError] = useState('');
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
      console.log(res);
      const stringifiedAccount = JSON.stringify(res.data);
      localStorage.setItem('account', stringifiedAccount);
      setAccount(res.data);
      handleSignIn()
    }).catch(err => {
      console.log(err);
      if (err.response.status === 409) setLoginError('Email o contraseña incorrectos')
      else setLoginError('Error al realizar la solicitud')
    })
  }

  //setear la key de sign-out a false en localStorage y en context
  const handleSignIn = () => {
    const stringifiedSignOut = JSON.stringify(false)
    localStorage.setItem('sign-out', stringifiedSignOut)
    setSignOut(false)
  }

  return(
    <>      
       <main className="bi-u-centerAbs bi-u-h-screen">
        <SectionHalf>
          <SimpleFormHrz innerRef={form}>
            <SimpleFormRow>
              <LabelElement
                htmlFor='loginEmail'
                type='Email'
                placeholder='Email'
                required>
                  Email
              </LabelElement>
            </SimpleFormRow>
            <SimpleFormRow>
              <LabelElement
                htmlFor='loginPwd'
                type='password'
                placeholder='Password'
                required>
                  Password
              </LabelElement>
            </SimpleFormRow>
            {loginError && 
              <SimpleFormRow className='bi-u-centerText'>
                <span className='error'>{loginError}</span>
              </SimpleFormRow>}
            <SimpleFormRow
              className='bi-u-centerText' >
              <ButtonLPrimary
                className='bi-o-button--short'
                type='submit'
                handleClick={HandleLogin}>
                  Login
              </ButtonLPrimary>
            </SimpleFormRow>            
          </SimpleFormHrz>
        </SectionHalf>
      </main>
    </>
  )
}

export default Login;