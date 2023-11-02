import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
// import { GlobalContext } from '../../context';
import Api from '../../services/api';
import { TableHeader } from '../../components/UI/tables/TableHeaders';
import { TableData, TableDataHeader, TableDataRow, TableCellMedium, TableCellShort, TableCellLong, TableDataRowWrapper } from '../../components/UI/tables/TableDataElements';
import { MainHeading, SubHeading } from '../../components/UI/headings';
import { useSearchParams } from 'react-router-dom';

function DisarmStatus({ hedgeStatusData,setHedgeStatusData,hedgeStatus,setHedgeStatus }){
  // const context = useContext(GlobalContext);
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
      setHedgeStatusData(res.data);
      setHedgeStatus(res.data.data);
      //console.log(res.data);
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
          Estado del desarme
        </MainHeading>
      </TableHeader>
      <TableData>
        <TableDataHeader>
          <TableCellMedium>Ref.</TableCellMedium>
          <TableCellMedium>Partida cubierta</TableCellMedium>
          <TableCellMedium>Instrumento</TableCellMedium>
          <TableCellMedium>Tipo</TableCellMedium>
          <TableCellMedium>Monto subyacente</TableCellMedium>
          <TableCellMedium>Fecha inicio</TableCellMedium>
          <TableCellMedium>Fecha vencimiento</TableCellMedium>
          <TableCellMedium>Motivo desarme</TableCellMedium>
          <TableCellMedium>Fecha desarme</TableCellMedium>
        </TableDataHeader>
        {
          hedgeStatusData &&
            <>
              <TableDataRow key={uuidv4()}>
                <TableDataRowWrapper>
                  <TableCellMedium
                    className='bi-u-text-base-black'>{hedgeStatusData.id_hedge_relationship}</TableCellMedium>
                  <TableCellMedium>{hedgeStatusData.id_hedge_item}</TableCellMedium>
                  <TableCellMedium>{hedgeStatusData.id_hedge_instrument}</TableCellMedium>
                  <TableCellMedium>{hedgeStatusData.cat_hedge_type}</TableCellMedium>
                  <TableCellMedium>{hedgeStatusData.num_underlying_amount}</TableCellMedium>
                  <TableCellMedium>{hedgeStatusData.dt_start_date}</TableCellMedium>
                  <TableCellMedium>{hedgeStatusData.dt_maturity_date}</TableCellMedium>
                  <TableCellMedium>{hedgeStatusData.disarm_reason}</TableCellMedium>
                  <TableCellMedium>{hedgeStatusData.date_request}</TableCellMedium>
                </TableDataRowWrapper>
              </TableDataRow>
            </>
        }
      </TableData>
      <TableHeader>
        <SubHeading  className='bi-u-border-bb-gm bi-u-spacer-mt-huge'>
          Histórico de acciones
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
            hedgeStatus.map(hedge => {
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
                  <TableDataRowWrapper>
                    <TableCellMedium>{hedge.area}</TableCellMedium>
                    <TableCellMedium>{hedge.responsible}</TableCellMedium>
                    <TableCellMedium>{hedge.email}</TableCellMedium>
                    <TableCellMedium>{hedge.date_accept}</TableCellMedium>
                    <TableCellMedium
                      className='bi-u-text-base-black'
                      >{renderStatus()}
                    </TableCellMedium>
                    <TableCellLong>{hedge.responsible}</TableCellLong>
                  </TableDataRowWrapper>
                </TableDataRow>
              );
            })
          }
      </TableData>
    </main>
  );
}

export default DisarmStatus;