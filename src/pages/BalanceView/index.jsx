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

function BalanceView({ page,setPage,totalrowscount,setTotalrowscount, totalPages, setTotalPages }){
  const rowspage = 10;
  const [balanceView, setBalanceView] = useState([]);

  //calcular paginacion
  const calcTotalPages = (totalResults,totalRows) => setTotalPages(Math.ceil(totalResults/totalRows));

  //getBalanceView
  const getBalanceView = useGetData('balances/getBalanceView');
  useEffect (() => {    
    if (getBalanceView.responseGetData) setBalanceView(getBalanceView.responseGetData.data.header);
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
  

  const assets = [{
      "id":"1",
      "heading":"Instrument0s financieros de deuda emitidos",
      "amount":"4.822MM",
      'currency':'USD',
      "totalCoverage":"0,0000000757%",
      "derivatives":"",
      "subheadings": [{
        'id':'1',
        'heading':'2201',
        'amount':'4822434412206200000',
        'currency':'USD',
        'coverage':'0,00000000007%',
        'derivatives':'3668'
      }]
    }];

  return (
    <main className="bi-u-h-screen--wSubNav">      
       <TableHeader>
          <MainHeading>
            Gestión de balance
          </MainHeading>
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
            balanceView.map((assetItem) => {
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