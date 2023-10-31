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

function BonusView(){

  const bonus = [{
      "id":"1",
      "product":"172880",
      "description":"BondFHLB2 7/8 09/13/24/526W",
      "currency":"USD",
      "isin":"US3130A2UW45",
      "amount":"21.691.350€",
      "coverage":"0%",
      "derivatives":"REF 404042",      
    },{
      "id":"2",
      "product":"172886",
      "description":"BondACGB2 7/8 09/13/24/526W",
      "currency":"AUD",
      "isin":"US3130A2UW45",
      "amount":"21.691.350€",
      "coverage":"100%",
      "derivatives":"",      
    },{
      "id":"3",
      "product":"178299",
      "description":"BondACGB2 7/8 09/13/24/526W",
      "currency":"EUR",
      "isin":"US3130A2UW45",
      "amount":"21.691.350€",
      "coverage":"80%",
      "derivatives":"",      
    }
    ];

  return (
    <main className="bi-u-h-screen--wSubNav">      
       <TableHeader>
          <MainHeading>
            Vista Balance
          </MainHeading>
        </TableHeader>
        <TableData>
          <TableDataHeader>
            <TableCellMedium>Producto</TableCellMedium>
            <TableCellMedium>Descripción</TableCellMedium>
            <TableCellMedium>Divisa</TableCellMedium>
            <TableCellMedium>ISIN</TableCellMedium>
            <TableCellMedium>Importe</TableCellMedium>
            <TableCellMedium>% Cubierto</TableCellMedium>
            <TableCellMedium>Derivado</TableCellMedium>
          </TableDataHeader>
          {            
            bonus.map((bonusItem) => {
              return (
                <>
                <TableDataRow key={uuidv4()}>
                  <TableDataRowWrapper  >
                    <TableCellMedium
                      className='bi-u-text-base-black' >
                        {bonusItem.product}
                    </TableCellMedium>
                    <TableCellMedium>{bonusItem.description}</TableCellMedium>
                    <TableCellMedium>{bonusItem.currency}</TableCellMedium>
                    <TableCellMedium>{bonusItem.isin}</TableCellMedium>
                    <TableCellMedium>{bonusItem.amount}</TableCellMedium>
                    <TableCellMedium>{bonusItem.converage}</TableCellMedium>
                    <TableCellMedium>{bonusItem.derivatives}</TableCellMedium>
                  </TableDataRowWrapper>
                </TableDataRow>
                </>
              );
            })
          }
        </TableData>
        
    </main>
  );
}

export default BonusView;