import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from '../../services/api';
import { SectionHalf } from "../../components/UI/layout/LayoutSections";
import { TableHeader } from "../../components/UI/tables/TableHeaders";
import { ButtonLGhost, ButtonLPrimary } from "../../components/UI/buttons/Buttons.jsx";
import { LabelElement, SimpleFormHrz, SimpleFormRow } from "../../components/UI/forms/SimpleForms";
import { MainHeading } from "../../components/UI/headings";


function NewUser(){
  const navigate = useNavigate();
  const accountInLocalStorage = localStorage.getItem('account');
  const parsedAccount = JSON.parse(accountInLocalStorage);
  const token = parsedAccount.token;

  const headers = {
    'Content-Type': 'application/json',
    'x-access-token': token
  }

  const [formError, setFormError] = useState('');
  const form = useRef(null); 

  const HandleSignIn = (e) => {    
    e.preventDefault();
    const formData = new FormData(form.current);
        
    const data = {
      name: formData.get('newUserName'),
      surname: formData.get('newUserSurname'),
      email: formData.get('newUserEmail'),
      password: formData.get('newUserPwd'),
      password2: formData.get('newUserPwd2'),
    }
    
    const dataSent = {
      "name":`${data.name}`,
      "surname":data.surname,
      "email":data.email,
      "password":data.password,
      "cat_display":"",
      "cat_role":""
    }

    if (data.password === data.password2) {
      Api.call.post("users/create",dataSent,{ headers:headers })
      .then(res => {
        navigate('/bancoInternacional/users');
      })
      .catch(err => {
        //console.log('err',err);
        //console.log(err.response)
        setFormError('Error ',err,' al realizar la solicitud. Inténtalo de nuevo.')})
    } else {
      setFormError('La contraseña no coincide')
    }    
  }

  const HandleCancel = () => {
    navigate('/bancoInternacional/users');
  }

  return(
    <>      
       <main className="bi-u-h-screen--wSubNav">
       <TableHeader>
          <MainHeading>
            Alta nuevo usuario
          </MainHeading>
        </TableHeader>
        <SectionHalf>
          <SimpleFormHrz innerRef={form}>
            <SimpleFormRow>
              <LabelElement
                htmlFor='newUserName'
                type='text'
                placeholder='Nombre'>
                  Nombre
              </LabelElement>
            </SimpleFormRow>
            <SimpleFormRow>
              <LabelElement
                htmlFor='newUserSurname'
                type='text'
                placeholder='Apellidos'>
                  Apellidos
              </LabelElement>
            </SimpleFormRow>
            <SimpleFormRow>
              <LabelElement
                htmlFor='newUserEmail'
                type='email'
                placeholder='Email'>
                  Email
              </LabelElement>
            </SimpleFormRow>
            <SimpleFormRow>
              <LabelElement
                htmlFor='newUserPwd'
                type='password'
                placeholder='Password'>
                  Constraseña
              </LabelElement>
            </SimpleFormRow>
            <SimpleFormRow>
              <LabelElement
                htmlFor='newUserPwd2'
                type='password'
                placeholder='Repite Password'>
                  Repite Constraseña
              </LabelElement>
            </SimpleFormRow>
            {formError && 
              <SimpleFormRow>
                <span className='error'>{formError}</span>
              </SimpleFormRow>}
            <SimpleFormRow
              className='bi-u-centerText' >
              <ButtonLGhost
                className='bi-o-button--short'
                handleClick={HandleCancel}
                >
                  Cancel
              </ButtonLGhost>
              <ButtonLPrimary
                className='bi-o-button--short'
                type='submit'
                handleClick={HandleSignIn}
                >
                  Enviar
              </ButtonLPrimary>
            </SimpleFormRow>            
          </SimpleFormHrz>
        </SectionHalf>
      </main>
    </>
  )
}

export default NewUser;