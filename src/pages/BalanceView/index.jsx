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
  const [balanceFlat, setBalanceFlat] = useState([]);



  //getBalanceView
  const getBalanceView = useGetData('balances/getBalanceView');
  useEffect (() => {    
    if (getBalanceView.responseGetData) {
      setBalanceView(getBalanceView.responseGetData?.data?.header);
    }
  },[getBalanceView.responseGetData])

  const flattenObject = (obj) => {
    const result = {}
  
    for (const i in obj) {
      if (typeof obj[i] === "object" && !Array.isArray(obj[i])) {
        const temp = flattenObject(obj[i]);
        for (const j in temp) {
          if (typeof obj[i][j] === "object" && !Array.isArray(obj[i])) {
            const temp2 = flattenObject(obj[i][j]);
            for (const h in temp2) {
              result [i+"."+j+"."+h] = temp2[h];
            }
          } else {
            result [i+"."+j] = temp[j];
          }
        }
      } else {
        result[i] = obj[i]
      }
    }
  
    return result
  }

  useEffect(()=>{
    if (balanceView.length > 0) {
      console.log('balanceViewType', typeof(balanceView));
      console.log('balanceView',balanceView);
      const newFlat = flattenObject(balanceView);
      setBalanceFlat(Object.entries(newFlat))
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
              data={balanceFlat}>Descargar CSV</CSVLink>
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