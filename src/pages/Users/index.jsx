import { useEffect, useContext } from 'react';
import { GlobalContext } from '../../context';
import Api from '../../services/api';
import TableHeader from '../../components/UI/tables/TableHeader';
import { TableData, TableDataHeader, TableDataRow, TableCellMedium, TableCellShort } from '../../components/UI/tables/TableDataElements';
import { IconButSmPrimary, IconButSmSecondary } from '../../components/UI/buttons/IconButtons';
import { PencilSquareIcon } from '@heroicons/react/24/solid';
import { TrashIcon } from '@heroicons/react/24/solid';

const Users = () => {     
  const context = useContext(GlobalContext);

  useEffect(()=>{  
    const accountInLocalStorage = localStorage.getItem('account');
    const parsedAccount = JSON.parse(accountInLocalStorage);
    const token = parsedAccount.token;

    const headers = {
      'Content-Type': 'application/json',
      'x-access-token': token,
    }

    const data = {
      'search':'',
      'pagenumber':1,
      'rowspage':10
    }

    Api.call.post('users/getAll',data,{ headers:headers })
    .then(response => context.setUsers(response.data.data))
    .catch(err => console.warn(err))
  },[])

  return (
    <>
      <main className="bi-u-h-screen--wSubNav">
        <TableHeader>
          Listado usuarios registrados en el sistema
        </TableHeader>
        <TableData className='bi-u-spacer-mb-huge'>
            <TableDataHeader>
              <TableCellMedium>Usuario</TableCellMedium>
              <TableCellMedium>Apellidos</TableCellMedium>
              <TableCellMedium>Email</TableCellMedium>
              <TableCellShort/>
              <TableCellShort/>
            </TableDataHeader>
            {
              context.users.map(user => {
                return (
                  <TableDataRow key={user.id_user}>
                    <TableCellMedium>{user.desc_name}</TableCellMedium>
                    <TableCellMedium>{user.desc_surname}</TableCellMedium>
                    <TableCellMedium>{user.desc_mail}</TableCellMedium>
                    <TableCellShort>
                      <IconButSmPrimary>
                        <PencilSquareIcon/>
                      </IconButSmPrimary>
                    </TableCellShort>
                    <TableCellShort>
                      <IconButSmSecondary>
                        <TrashIcon/>
                      </IconButSmSecondary>
                    </TableCellShort>
                  </TableDataRow>
                );
              })
            }
          </TableData>
      </main>
    </>
    
  );
}

export default Users;