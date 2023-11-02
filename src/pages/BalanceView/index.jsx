import { useEffect,useState } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Api from '../../services/api';
import { TableHeader } from '../../components/UI/tables/TableHeaders';
import { TableData, TableDataHeader, TableDataRow, TableDataRowWrapper, TableCellMedium, TableCellShort } from '../../components/UI/tables/TableDataElements';
import TablePagination from '../../components/TablePagination';
import { SortButton } from '../../components/UI/buttons/Buttons';
import { IconButSm } from '../../components/UI/buttons/IconButtons';
import { DocumentArrowDownIcon, InformationCircleIcon, BoltIcon } from '@heroicons/react/24/solid';
import { MainHeading } from '../../components/UI/headings';
import { LabelElement } from '../../components/UI/forms/SimpleForms';

import BalanceAccordion from '../../components/BalanceAccordion';

function BalanceView(){

  const assets = [{
      "id":"1",
      "heading":"Loans and advances - Central Banks",
      "amount":"75M",
      "totalCoverage":"100%",
      "derivatives":"",
      "subheadings": [{
        "id":"1",
        "heading":"590595 - Depósito ECB 1",
        "amount":"10M",
        "coverage":"90%",
        "derivatives":"REF 404040 | REF 404041"
      },{
        "id":"1",
        "heading":"609898 - Depósito ECB 2",
        "amount":"50M",
        "coverage":"80%",
        "derivatives":""
      },{
        "id":"3",
        "heading":"7654 - Depósito ECB 3",
        "amount":"15M",
        "coverage":"100%",
        "derivatives":"REF 404040 | REF 404041"
      }]
    },{
      "id":"2",
      "heading":"Loans and advances - Central Banks",
      "amount":"75M",
      "totalCoverage":"100%",
      "derivatives":"",
      "subheadings": [{
        "id":"1",
        "heading":"590595 - Depósito ECB 1",
        "amount":"10M",
        "coverage":"90%",
        "derivatives":"REF 404040 | REF 404041"
      },{
        "id":"1",
        "heading":"609898 - Depósito ECB 2",
        "amount":"50M",
        "coverage":"80%",
        "derivatives":""
      },{
        "id":"3",
        "heading":"7654 - Depósito ECB 3",
        "amount":"15M",
        "coverage":"100%",
        "derivatives":"REF 404040 | REF 404041"
      }]
    },{
      "id":"3",
      "heading":"Loans and advances - Central Banks",
      "amount":"75M",
      "totalCoverage":"100%",
      "derivatives":"",
      "subheadings": [{
        "id":"1",
        "heading":"590595 - Depósito ECB 1",
        "amount":"10M",
        "coverage":"90%",
        "derivatives":"REF 404040 | REF 404041"
      },{
        "id":"1",
        "heading":"609898 - Depósito ECB 2",
        "amount":"50M",
        "coverage":"80%",
        "derivatives":""
      },{
        "id":"3",
        "heading":"7654 - Depósito ECB 3",
        "amount":"15M",
        "coverage":"100%",
        "derivatives":"REF 404040 | REF 404041"
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
            <TableCellMedium>Epigrafe</TableCellMedium>
            <TableCellMedium>Monto</TableCellMedium>
            <TableCellMedium>% Cubierto</TableCellMedium>
            <TableCellMedium>Derivados</TableCellMedium>
          </TableDataHeader>
          {            
            assets.map((assetItem) => {
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
        
    </main>
  );
}

export default BalanceView;