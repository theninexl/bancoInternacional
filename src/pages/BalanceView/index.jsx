import { useEffect,useState } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useGetData } from "../../hooks/useGetData";
import { TableHeader } from '../../components/UI/tables/TableHeaders';
import { TableData, TableDataHeader, TableDataRow, TableDataRowWrapper, TableCellMedium, TableCellShort } from '../../components/UI/tables/TableDataElements';
import TablePagination from '../../components/TablePagination';
import { SortButton } from '../../components/UI/buttons/Buttons';
import { IconButSm } from '../../components/UI/buttons/IconButtons';
import { DocumentArrowDownIcon, InformationCircleIcon, BoltIcon } from '@heroicons/react/24/solid';
import { MainHeading } from '../../components/UI/headings';
import { LabelElement } from '../../components/UI/forms/SimpleForms';

import BalanceAccordion from '../../components/BalanceAccordion';
import { CSVLink } from 'react-csv';

function BalanceView({ page,setPage,totalrowscount,setTotalrowscount, totalPages, setTotalPages }){
  const rowspage = 10;
  const [balanceView, setBalanceView] = useState([]);

  //ordenar la info para la descarga del CSV
  const headers = [
    {label:'Epigrafe', key:'id_item'},
    {label:'Monto', key:'num_amount'},
    {label:'% Cubierto', key:'pct_amount_covered'},
    {label:'SubEpigrafe', key: 'items.id_hedge_accounting'},
    {label:'Monto', key: 'items.num_amount'},
    {label:'% Cubierto', key: 'items.pct_amount_covered'},
  ]

  //calcular paginacion
  const calcTotalPages = (totalResults,totalRows) => setTotalPages(Math.ceil(totalResults/totalRows));

  //getBalanceView
  const getBalanceView = useGetData('balances/getBalanceView');
  useEffect (() => {    
    if (getBalanceView.responseGetData) {
      console.log(getBalanceView.responseGetData?.data?.header);
      setBalanceView(getBalanceView.responseGetData?.data?.header);
    }
  },[getBalanceView.responseGetData])

  //resetear pagina a 1
  useEffect(()=>{
    setPage(1);
  },[setPage])

  useEffect(()=>{
    if (balanceView) {
      console.log('balanceView', balanceView)

      //setTotalrowscount(getBalanceView.responseGetData.data.length());
      //calcTotalPages(getBalanceView.responseGetData.data.length(), rowspage);
    }
  },[balanceView])

  return (
    <main className="bi-u-h-screen--wSubNav">      
       <TableHeader>
          <MainHeading>
            Gestión de balance
          </MainHeading>
          <div className='bi-c-form-simple'>
          <CSVLink
              className='bi-c-navbar-links__textbutt'
              filename={"gestionBalance.csv"}
              data={balanceView} headers={headers}>Descargar CSV</CSVLink>
          </div>
        </TableHeader>
        <TableData>
          <TableDataHeader>
            <TableCellMedium>Epígrafe</TableCellMedium>
            <TableCellMedium>Monto</TableCellMedium>
            {/*<TableCellMedium>Divisa</TableCellMedium>*/}
            <TableCellMedium>% Cubierto</TableCellMedium>
            <TableCellMedium>Derivados</TableCellMedium>
          </TableDataHeader>
          {            
            balanceView?.map((assetItem) => {
              return (
                <>
                  <BalanceAccordion 
                    key={uuidv4()} 
                    content={assetItem} />
                </>
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
  );
}

export default BalanceView;