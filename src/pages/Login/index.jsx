import { useRef, useContext, useState } from "react";
import { GlobalContext } from '../../context';
import Api from '../../services/api';
import { SectionHalf } from "../../components/UI/layout/LayoutSections";
import { ButtonLPrimary } from "../../components/UI/buttons/Buttons.jsx";
import { LabelElement, SimpleFormHrz, SimpleFormRow } from "../../components/UI/forms/SimpleForms";


function Login(){
  const context = useContext(GlobalContext)
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
      //añadir los datos de la cuenta a localStorage y context
      const stringifiedAccount = JSON.stringify(res.data);
      localStorage.setItem('account', stringifiedAccount);
      context.setAccount(res.data);
      handleSignIn()
    }).catch(err => {
      if (err.response.status === 409) setLoginError('Email o contraseña incorrectos')
      else setLoginError('Error al realizar la solicitud')
    })
  }

  //setear la key de sign-out a false en localStorage y en context
  const handleSignIn = () => {
    const stringifiedSignOut = JSON.stringify(false)
    localStorage.setItem('sign-out', stringifiedSignOut)
    context.setSignOut(false)
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
                placeholder='Email'>
                  Email
              </LabelElement>
            </SimpleFormRow>
            <SimpleFormRow>
              <LabelElement
                htmlFor='loginPwd'
                type='password'
                placeholder='Password'>
                  Password
              </LabelElement>
            </SimpleFormRow>
            {loginError && 
              <SimpleFormRow>
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