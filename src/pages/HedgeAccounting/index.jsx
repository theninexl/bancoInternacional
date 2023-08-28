import { useEffect, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { GlobalContext } from '../../context';
import Api from '../../services/api';
import { TableHeader } from '../../components/UI/tables/TableHeaders';
import { TableData, TableDataHeader, TableDataRow, TableCellMedium, TableCellShort } from '../../components/UI/tables/TableDataElements';
import TablePagination from '../../components/TablePagination';
import { IconButSm } from '../../components/UI/buttons/IconButtons';
import { DocumentArrowDownIcon, InformationCircleIcon, BoltIcon } from '@heroicons/react/24/solid';

function HedgeAccounting(){
  const context = useContext(GlobalContext);
  const rowspage = 10;

  const accountInLocalStorage = localStorage.getItem('account');
  const parsedAccount = JSON.parse(accountInLocalStorage);
  const token = parsedAccount.token;

  //calcular paginacion
  const calcTotalPages = (totalResults,totalRows) => context.setTotalPages(Math.ceil(totalResults/totalRows));

  //listar usuarios
  const getHedges = (token, page) => {
    const headers = {
      'Content-Type': 'application/json',
      'x-access-token': token,
    }
    const data = {
      'search':'',
      'pagenumber':page,
      'rowspage':rowspage
    }
    Api.call.post('hedges/getAll',data,{ headers:headers })
    .then(response => {
      calcTotalPages(response.data.rowscount[0].count, rowspage);
      context.setHedges(response?.data?.data)
    }).catch(err => console.warn(err))
  }
  //resetear pagina a 1
  useEffect(()=>{
    context.setPage(1);
  },[context.setPage])

  useEffect(()=>{  
    
    const execGetHedges = async () => await getHedges(token, context.page);
    execGetHedges();
  },[context.page]);


  return (
    <main className="bi-u-h-screen--wSubNav">
       <TableHeader>
          Listado coberturas
        </TableHeader>
        <TableData>
          <TableDataHeader>
            <TableCellMedium>Ref.</TableCellMedium>
            <TableCellMedium>Ref. Part. Cubierta</TableCellMedium>
            <TableCellMedium>Ref. Instrumento</TableCellMedium>
            <TableCellMedium>Tipo Cobertura</TableCellMedium>
            <TableCellMedium>Ratio Eficacia</TableCellMedium>
            <TableCellMedium>MtM Derivado</TableCellMedium>
            <TableCellMedium>Impacto OCI</TableCellMedium>
            <TableCellMedium>Impacto P&L</TableCellMedium>
            <TableCellMedium>Monto Subyacente</TableCellMedium>
            <TableCellMedium>Fecha Final</TableCellMedium>
            <TableCellMedium>Usuario</TableCellMedium>
            <TableCellShort>Ficha</TableCellShort>
            <TableCellShort>Status</TableCellShort>
            <TableCellShort>Desarmar</TableCellShort>
          </TableDataHeader>
          {
            context.hedges.map(hedge => {
              return (
                <TableDataRow key={uuidv4()}>
                  <TableCellMedium
                    className='bi-u-text-base-black'>{hedge.hedge_ref}</TableCellMedium>
                  <TableCellMedium>{hedge.hedge_item_ref}</TableCellMedium>
                  <TableCellMedium>{hedge.hedge_instrument_ref}</TableCellMedium>
                  <TableCellMedium>{hedge.hedge_type}</TableCellMedium>
                  <TableCellMedium>{hedge.rate}</TableCellMedium>
                  <TableCellMedium>{hedge.mtm}</TableCellMedium>
                  <TableCellMedium>{hedge.oci}</TableCellMedium>
                  <TableCellMedium>{hedge.pyl}</TableCellMedium>
                  <TableCellMedium>{hedge.amount}</TableCellMedium>
                  <TableCellMedium>{hedge.date_expire}</TableCellMedium>
                  <TableCellMedium>{hedge.user_create}</TableCellMedium>
                  <TableCellShort>
                  <IconButSm
                      className="bi-o-icon-button-small--disabled">
                      <DocumentArrowDownIcon/>
                    </IconButSm>
                  </TableCellShort>
                  <TableCellShort>
                    <IconButSm
                      className="bi-o-icon-button-small--secondary">
                      <InformationCircleIcon/>
                    </IconButSm>
                  </TableCellShort>
                  <TableCellShort>
                    <IconButSm
                      className="bi-o-icon-button-small--primary">
                      <BoltIcon/>
                    </IconButSm>
                  </TableCellShort>
                </TableDataRow>
              );
            })
          }
        </TableData>
        <TablePagination/>    
    </main>
  );
}

export default HedgeAccounting;