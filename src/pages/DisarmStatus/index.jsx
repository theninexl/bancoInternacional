import { useEffect, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { GlobalContext } from '../../context';
import Api from '../../services/api';
import { TableHeader } from '../../components/UI/tables/TableHeaders';
import { TableData, TableDataHeader, TableDataRow, TableCellMedium, TableCellShort, TableCellLong } from '../../components/UI/tables/TableDataElements';
import { MainHeading, SubHeading } from '../../components/UI/headings';
import { useSearchParams } from 'react-router-dom';

function DisarmStatus(){
  const context = useContext(GlobalContext);
  const [searchParams] = useSearchParams();

  const accountInLocalStorage = localStorage.getItem('account');
  const parsedAccount = JSON.parse(accountInLocalStorage);
  const token = parsedAccount.token;

  
  //get Cobertura
  const hedgeID = searchParams.get('id');
  const getHedge = (token, id) => {
    const headers = {
      'Content-Type': 'application/json',
      'x-access-token': token,
    }
    const data = { 'hedge':id}
    Api.call.post('hedges/disarmStatus',data,{ headers:headers })
    .then(res => {
      context.setHedgeStatusData(res.data);
      context.setHedgeStatus(res.data.data);
      console.log(res.data);
    }).catch(err => {
      //setFormError(err);
      console.warn(err)})
  }

  useEffect(()=>{      
    const execGetHedge = async () => await getHedge(token, hedgeID);
    execGetHedge();
  },[]);


  return (
    <main className="bi-u-h-screen--wSubNav">
      <TableHeader>
        <MainHeading className='bi-u-border-bb-gm'>
          Status solicitud de desarme
        </MainHeading>
        <SubHeading  className='bi-u-border-bb-gm'>
          Descripción cobertura seleccionada
        </SubHeading>
      </TableHeader>
      <TableData>
        <TableDataHeader>
          <TableCellMedium>Ref.</TableCellMedium>
          <TableCellMedium>Ref. Part. Cubierta</TableCellMedium>
          <TableCellMedium>Ref. Instrumento</TableCellMedium>
          <TableCellMedium>Tipo Cobertura</TableCellMedium>
          <TableCellMedium>Monto Subyacente</TableCellMedium>
          <TableCellMedium>Fecha Inicio</TableCellMedium>
          <TableCellMedium>Fecha Final</TableCellMedium>
          <TableCellMedium>Motivo desarme</TableCellMedium>
          <TableCellMedium>Fecha Desarme</TableCellMedium>
        </TableDataHeader>
        {
          context.hedgeStatusData &&
            <>
              <TableDataRow key={uuidv4()}>
                <TableCellMedium
                  className='bi-u-text-base-black'>{context.hedgeStatusData.hedge_ref}</TableCellMedium>
                <TableCellMedium>{context.hedgeStatusData.hedge_item_ref}</TableCellMedium>
                <TableCellMedium>{context.hedgeStatusData.hedge_instrument_ref}</TableCellMedium>
                <TableCellMedium>{context.hedgeStatusData.hedge_type}</TableCellMedium>
                <TableCellMedium>{context.hedgeStatusData.amount}</TableCellMedium>
                <TableCellMedium>{context.hedgeStatusData.date_start}</TableCellMedium>
                <TableCellMedium>{context.hedgeStatusData.date_expire}</TableCellMedium>
                <TableCellMedium>{context.hedgeStatusData.disarm_reason}</TableCellMedium>
                <TableCellMedium>{context.hedgeStatusData.date_request}</TableCellMedium>
              </TableDataRow>
            </>
        }
      </TableData>
      <TableHeader>
        <SubHeading  className='bi-u-border-bb-gm bi-u-spacer-mt-huge'>
          Status de la aprobación
        </SubHeading>
      </TableHeader>
      <TableData>
        <TableDataHeader>
          <TableCellMedium>Area</TableCellMedium>
          <TableCellMedium>Responsable</TableCellMedium>
          <TableCellMedium>Email</TableCellMedium>
          <TableCellMedium>Fecha solicitud</TableCellMedium>
          <TableCellMedium>Status</TableCellMedium>
          <TableCellLong>Comentarios</TableCellLong>
        </TableDataHeader>
        {
            context.hedgeStatus.map(hedge => {
              const renderStatus = () => {
                if (hedge.status == 'Ok') {
                  return (<><span className='bi-u-success-text'>{hedge.status}</span></>);  
                } else if (hedge.status == 'Pending') {
                  return (<><span className='bi-u-warning-text'>{hedge.status}</span></>);  
                } else if (hedge.status == 'Denegada') {
                  return (<><span className='bi-u-danger-text'>{hedge.status}</span></>);  
                }        
              } 
              return (
                <TableDataRow key={uuidv4()}>
                  <TableCellMedium>{hedge.area}</TableCellMedium>
                  <TableCellMedium>{hedge.responsible}</TableCellMedium>
                  <TableCellMedium>{hedge.email}</TableCellMedium>
                  <TableCellMedium>{hedge.date_accept}</TableCellMedium>
                  <TableCellMedium
                    className='bi-u-text-base-black'
                    >{renderStatus()}
                  </TableCellMedium>
                  <TableCellLong>{hedge.responsible}</TableCellLong>
                </TableDataRow>
              );
            })
          }
      </TableData>
    </main>
  );
}

export default DisarmStatus;