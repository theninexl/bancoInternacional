import { useRef, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Api from '../../services/api';
import { SectionHalf } from "../../components/UI/layout/LayoutSections";
import { ButtonLGhost, ButtonLPrimary } from "../../components/UI/buttons/Buttons.jsx";
import { LabelElement, SelectElement, SimpleFormHrz, SimpleFormRow } from "../../components/UI/forms/SimpleForms";
import { TableHeader } from "../../components/UI/tables/TableHeaders";
import { MainHeading } from "../../components/UI/headings";


function EditUser(){
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  //token
  const accountInLocalStorage = localStorage.getItem('account');
  const parsedAccount = JSON.parse(accountInLocalStorage);
  const token = parsedAccount.token;
  //form
  const [formError, setFormError] = useState('');
  const form = useRef(null);
  //getUser
  const [userName, setUserName] = useState('');
  const [surName, setSurName] = useState('');
  const [department, setDepartment] = useState('');
  const [email, setEmail] = useState('');

  const userID = searchParams.get('id');
  const getUser = (token, id) => {
    const headers = {
      'Content-Type': 'application/json',
      'x-access-token': token,
    }
    const data = { 'id_user':id}
    Api.call.post('users/getOne',data,{ headers:headers })
    .then(response => {
      console.log(response);
      setUserName(response?.data?.name);
      setSurName(response?.data?.surname);
      setDepartment(response?.data?.cat_display);
      setEmail(response?.data?.email)
    }).catch(err => {
      setFormError(err);
      console.warn(err)})
  }

  useEffect(()=>{  
    const execGetUser = async () => await getUser(token, userID);
    execGetUser();
  },[userID]);

  //editar usuario
  const UpdateUser = (e) => {    
    e.preventDefault();
    const formData = new FormData(form.current);

    const headers = {
      'Content-Type': 'application/json',
      'x-access-token': token
    }
        
    const data = {
      name: userName,
      surname: surName,
      department: department,
      email: email,
      password: formData.get('UserPwd'),
      password2: formData.get('UserPwd2'),
    }

    if (data.password === data.password2) {
      const dataSent = {
        "id_user":userID,
        "name":data.name,
        "surname":data.surname,
        "email":data.email,
        "password":data.password,
        "cat_display":"",
        "cat_role":data.department
      }

      console.log('dataSent',dataSent);

      Api.call.post("users/edit",dataSent,{ headers:headers })
      .then(res => {
        navigate('/users');
      })
      .catch(err => {
        console.log('err',err);
        console.log(err.response)
        setFormError('Error al realizar la solicitud')})    
    } else {
      setFormError('La contraseña no coincide')
    }    
  }

  //cancelar
  const HandleCancel = () => {
    navigate('/users');
  }

  return(
    <>      
       <main className="bi-u-h-screen--wSubNav">
       <TableHeader>
          <MainHeading>
            Editar usuario
          </MainHeading>
        </TableHeader>
        <SectionHalf>
          <SimpleFormHrz innerRef={form}>
            <SimpleFormRow>
              <LabelElement
                htmlFor='UserName'
                type='text'
                placeholder={userName}
                value={userName}
                handleOnChange={e => setUserName(e.target.value)}>
                  Nombre
              </LabelElement>
            </SimpleFormRow>
            <SimpleFormRow>
              <LabelElement
                htmlFor='UserSurname'
                type='text'
                placeholder={surName}
                value={surName}
                handleOnChange={e => setSurName(e.target.value)}>
                  Apellidos
              </LabelElement>
            </SimpleFormRow>
            <SimpleFormRow>
              <SelectElement
                htmlFor='newUserDepartment'
                title='Departamento'
                value={department}
                handleOnChange={e => setDepartment(e.target.value)}>
                <option value='1'>Departamento 1</option>
                <option value='2'>Departamento 2</option>
                <option value='3'>Departamento 3</option>
              </SelectElement>
              {/* <LabelElement
                htmlFor='UserDepartment'
                type='text'
                placeholder={department}
                value={department}
                handleOnChange={e => setDepartment(e.target.value)}>
                  Departamento
              </LabelElement> */}
            </SimpleFormRow>
            <SimpleFormRow>
              <LabelElement
                htmlFor='UserEmail'
                type='email'
                placeholder={email}
                value={email}
                handleOnChange={e => setEmail(e.target.value)}>
                  Email
              </LabelElement>
            </SimpleFormRow>
            <SimpleFormRow>
              <LabelElement
                htmlFor='UserPwd'
                type='password'
                placeholder='Escribe una nueva contraseña'>
                  Editar contraseña
              </LabelElement>
            </SimpleFormRow>
            <SimpleFormRow>
              <LabelElement
                htmlFor='UserPwd2'
                type='password'
                placeholder='Repite la contraseña'>
                  Repite contraseña
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
                  Cancelar
              </ButtonLGhost>
              <ButtonLPrimary
                className='bi-o-button--short'
                type='submit'
                handleClick={UpdateUser}
                >
                  Guardar
              </ButtonLPrimary>
            </SimpleFormRow>            
          </SimpleFormHrz>
        </SectionHalf>
      </main>
    </>
  )
}

export default EditUser;