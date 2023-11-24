import { useEffect, useState } from 'react';
import { useNavigate, createSearchParams } from 'react-router-dom';
// import { GlobalContext } from '../../context';
import Api from '../../services/api';
import { TableHeader } from "../../components/UI/tables/TableHeaders";
import { TableData, TableDataHeader, TableDataRow, TableCellMedium, TableCellShort, TableDataRowWrapper } from '../../components/UI/tables/TableDataElements';
import { IconButSmPrimary, IconButSmSecondary } from '../../components/UI/buttons/IconButtons';
import TablePagination from '../../components/TablePagination';
import { ButtonLPrimary, ButtonLSecondary } from '../../components/UI/buttons/Buttons';
import ModalSmall from '../../components/ModalSmall';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';
import { MainHeading } from '../../components/UI/headings';


const Users = ({ totalPages,setTotalPages,users,setUsers,page,setPage }) => {   
  const navigate = useNavigate();  
  // const context = useContext(GlobalContext);
  const rowspage = 10;

  const accountInLocalStorage = localStorage.getItem('account');
  const parsedAccount = JSON.parse(accountInLocalStorage);
  const token = parsedAccount.token;

  //calcular paginacion
  const calcTotalPages = (totalResults,totalRows) => setTotalPages(Math.ceil(totalResults/totalRows));

  //listar usuarios
  const getUsers = (token, page) => {
    const headers = {
      'Content-Type': 'application/json',
      'x-access-token': token,
    }
    const data = {
      'search':'',
      'pagenumber':page,
      'rowspage':rowspage
    }
    Api.call.post('users/getAll',data,{ headers:headers })
    .then(response => {
      console.log(response);
      calcTotalPages(response?.data?.rowscount[0]?.count, rowspage)
      setUsers(response?.data?.data)
    }).catch(err => console.warn(err))
  }
  //resetear pagina a 1
  useEffect(()=>{
    setPage(1);
  },[setPage])

  useEffect(()=>{  
    const execGetUsers = async () => await getUsers(token, page);
    execGetUsers();
  },[page]);

  //mostrar modal delete
  const [modalOpen, setModalOpen] = useState(false);
  const openDeleteModal = (id) => {
    setUserToDelete(id);
    setModalOpen(true);
  }

  //borrar usuario
  const [userToDelete, setUserToDelete] = useState(null);

  const removeUser = (id) => {
    const headers = {
      'Content-Type': 'application/json',
      'x-access-token': token,
    }
    const data = {
      'id_user':id
    }
    Api.call.post('users/remove',data,{ headers:headers })
    .then(response => { 
      setModalOpen(false);
      setPage(1);
      const execGetUsers = async () => await getUsers(token, page);
      execGetUsers();
    }).catch(err => console.warn(err))
  }

  //editar usuario
  const sendToEdit = (id) => {
    navigate({
      pathname: '/users-edit',
      search: createSearchParams({
        id:id
      }).toString()
    });
  }


  const renderView = (id) => {
    if (modalOpen) {
      return (
        <ModalSmall
          message='Vas a borrar un usuario. ¿Estás seguro?' 
          buttons={
            <>
              <ButtonLSecondary
                className='bi-o-button--short'
                handleClick={() => setModalOpen(false)}>
                  No, cancelar
              </ButtonLSecondary>
              <ButtonLPrimary
                className='bi-o-button--short'
                handleClick={() => removeUser(userToDelete)}>
                  Si, borrar
              </ButtonLPrimary>
            </>
          }
        />
      );
    }
  }

  return (
    <>
      <main className="bi-u-h-screen--wSubNav">
        {renderView()}
        <TableHeader>
          <MainHeading>
            Listado de usuarios
          </MainHeading>
        </TableHeader>
        <TableData>
          <TableDataHeader>
            <TableCellMedium>Nombre</TableCellMedium>
            <TableCellMedium>Apellidos</TableCellMedium>
            <TableCellMedium>Departamento</TableCellMedium>
            <TableCellMedium>Email</TableCellMedium>
            <TableCellShort></TableCellShort>
            <TableCellShort></TableCellShort>
          </TableDataHeader>
          {
            users.map(user => {
              return (
                <TableDataRow key={user.id_user}>
                  <TableDataRowWrapper>
                    <TableCellMedium
                      className='bi-u-text-base-black'>{user.name}</TableCellMedium>
                    <TableCellMedium>{user.surname}</TableCellMedium>
                    <TableCellMedium>{user.department}</TableCellMedium>
                    <TableCellMedium>{user.email}</TableCellMedium>
                    <TableCellShort>
                      <IconButSmPrimary
                        handleClick={() => sendToEdit(user.id_user)}>
                        <PencilSquareIcon/>
                      </IconButSmPrimary>
                    </TableCellShort>
                    <TableCellShort>
                      <IconButSmSecondary
                        handleClick={() => openDeleteModal(user.id_user)}>
                        <TrashIcon/>
                      </IconButSmSecondary>
                    </TableCellShort>
                  </TableDataRowWrapper>
                </TableDataRow>
              );
            })
          }
        </TableData>
        <TablePagination
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          />        
      </main>
    </>
    
  );
}

export default Users;