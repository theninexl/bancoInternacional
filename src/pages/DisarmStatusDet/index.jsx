import { useEffect,useState,useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
// import { GlobalContext } from '../../context';
import Api from '../../services/api';
import Papa from 'papaparse';
import { TableHeader } from '../../components/UI/tables/TableHeaders';
import { TableData, TableDataHeader, TableDataRow, TableCellMedium, TableCellShort, TableCellLong, TableDataRowWrapper } from '../../components/UI/tables/TableDataElements';
import { MainHeading, SubHeading } from '../../components/UI/headings';
import { ColsContainer, SectionThird, SimpleCol } from '../../components/UI/layout/LayoutSections';
import { ButtonMPrimary, ButtonMSecondary } from '../../components/UI/buttons/Buttons';
import { LabelElement, SimpleFormHrz, SimpleFormRow } from '../../components/UI/forms/SimpleForms';
import { FileDrop } from '../../components/UI/forms/FileDrop';

function DisarmStatusDet({ hedgeStatusData,setHedgeStatusData,hedgeStatus,setHedgeStatus,setHedgeDisarmData,deferredFlowFile,setDeferredFlowFile,deferredFlowInfo,setDeferredFlowInfo }){
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [freeTextRejectReason, setFreeTextRejectReason] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState();
  const rejectForm = useRef(null); 

  const accountInLocalStorage = localStorage.getItem('account');
  const parsedAccount = JSON.parse(accountInLocalStorage);
  const token = parsedAccount.token;
  const headers = {
    'Content-Type': 'application/json',
    'x-access-token': token,
  }
  
  //get id de la cobertura a validar
  const hedgeID = searchParams.get('id');

  //get Cobertura  
  const getHedge = (id) => {
    const data = {'id_hedge_relationship':id.toString()}
    Api.call.post('hedges/disarmGet',data,{ headers:headers })
    .then(res => {
      setHedgeStatusData(res.data);
    }).catch(err => {
      console.warn(err)})
  }

  const getHedgeHistorical = (id) => {    
    const data = { 'id_hedge_relationship':id.toString()}
    Api.call.post('hedges/validationDisarmGet',data,{ headers:headers })
    .then(res => {
      setHedgeStatus(res.data.data);
    }).catch(err => {
      console.warn(err)})
  }

  useEffect(()=>{
    const execGetHedge = async () => await getHedge(hedgeID);      
    const execGetHedgeHistorical = async () => await getHedgeHistorical(hedgeID);
    execGetHedge();
    execGetHedgeHistorical();
  },[]);

  //mirar cuando cambia deferrefFlowFile para parsearlo y guardarlo
  useEffect(()=>{
    if (deferredFlowFile) {
      setUploadedFileName(deferredFlowFile[0]?.name);
      Papa.parse(deferredFlowFile[0], {
        complete: function(results) {
          const deferredObj = {};
          for (let i=1; i<results.data.length; i++) {
            console.log(results.data[i]);
            const propertyName = i.toString();
            deferredObj[propertyName] = results.data[i];
          }
          setDeferredFlowInfo(deferredObj);     
        }
      });
    }
  },[deferredFlowFile])

  //manejar aprobado peticion validacion
  const handleApproval = (event, id) => {
    event.preventDefault();
    const dataSent = {
      'id_disassembly':id.toString(),
      'validate':'1'
    }
    Api.call.post('hedges/validationDisarmExecute',dataSent,{ headers:headers })
    .then(res => {
      navigate('/hedges');
    }).catch(err => {
      console.warn(err)})
  }

  //manejar rechazo peticion validacion
  const handleReject = (e) => {
    e.preventDefault();
    setFreeTextRejectReason(true);
  }

  //manejar finalizacion rechazo petición validacion
  const handleRejectCompletion = (e, id) => {
    e.preventDefault();
    const formData = new FormData(rejectForm.current);
    const formItems = {
      desc_comment: formData.get('desc_comment'),
    }
    const dataSent = {
      "id_disassembly": id.toString(),
      "desc_comment": formItems.desc_comment,
      "validate": '2',
      "deferred_flows":deferredFlowInfo,
    }
    Api.call.post('hedges/validationDisarmExecute',dataSent,{ headers:headers })
    .then(res => {
      navigate('/hedges');
    }).catch(err => {
      console.warn(err)})
  }

  return (
    <main className="bi-u-h-screen--wSubNav">
      <TableHeader>
        <MainHeading className='bi-u-border-bb-gm'>
          Estatus desarme
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
                  <TableCellMedium>{hedgeStatusData.cat_hedge_item_type}</TableCellMedium>
                  <TableCellMedium>{hedgeStatusData.num_instrument_notional}</TableCellMedium>
                  <TableCellMedium>{hedgeStatusData.dt_start_date}</TableCellMedium>
                  <TableCellMedium>{hedgeStatusData.dt_maturity_date}</TableCellMedium>
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
        {
          hedgeStatus.length > 0 ? 
            hedgeStatus.map(hedge => {
              const renderStatus = () => {
                if (hedge.cat_status == '0') {
                  return (<><span className='bi-o-textPill bi-u-bgColor-warning'>{"Pendiente"}</span></>);
                } else if (hedge.cat_status == '1') {
                  return (<><span className='bi-o-textPill bi-u-bgColor-success bi-u-gray-light-text'>{"Aprobado"}</span></>);
                } else if (hedge.cat_status == '2') {
                  return (<><span className='bi-o-textPill bi-u-bgColor-danger bi-u-gray-light-text'>{"Denegado"}</span></>);  
                }        
              }

              const renderDisassemblyReason = () => {
                if (hedge.cat_disassembly_reason == 1) {
                  return ('El objeto cubierto no existe.');
                } else if (hedge.cat_disassembly_reason == 2) {
                  return ('El nivel de tasas actual no justifica la cobertura.');
                } else if (hedge.cat_disassembly_reason == 3) {
                  return ('Estrageia de negocio.');
                } else if (hedge.cat_disassembly_reason == 4) {
                  return ('Otro:');
                } 
              }

              const renderButtons = () => {
                if (hedge.cat_status == '0') {
                  return (
                    <>
                      <SimpleFormHrz innerRef={rejectForm}>
                        {freeTextRejectReason ? '' :
                          <>
                          <SimpleFormRow className='bi-u-centerText bi-u-spacer-pt-zero'>
                            <ButtonMPrimary
                              handleClick={() => handleApproval(event, hedge.id_disassembly)}>
                              Aprobar
                            </ButtonMPrimary>
                            <ButtonMSecondary
                              handleClick={handleReject}>
                              Rechazar
                            </ButtonMSecondary>
                          </SimpleFormRow>
                          </>
                        }
                        
                        {freeTextRejectReason ? 
                          <>
                            <SimpleFormRow className='bi-u-spacer-pt-zero'>
                              <LabelElement
                                style={{padding:'0 12px'}}
                                htmlFor='desc_comment'
                                type='text'
                                placeholder=''
                                >  
                                Motivo rechazo                             
                              </LabelElement>
                            </SimpleFormRow>
                            <SimpleFormRow className='bi-u-spacer-pt-zero'>
                              <FileDrop
                                style={{padding:'0 12px'}}
                                htmlFor='deferredFlowsField'
                                placeholder={uploadedFileName ? uploadedFileName : 'Seleccionar/arrastrar CSV'}
                                accept='.csv'
                                deferredFlowFile={deferredFlowFile}
                                setDeferredFlowFile={setDeferredFlowFile}
                              >Flujos diferidos</FileDrop>
                            </SimpleFormRow>
                            <SimpleFormRow className='bi-u-centerText bi-u-spacer-pt-zero'>
                              <ButtonMPrimary
                                handleClick={() => handleRejectCompletion(event, hedge.id_disassembly)}>
                                Enviar rechazo
                              </ButtonMPrimary>
                            </SimpleFormRow>
                          </>
                          :
                          '' }
                        
                      </SimpleFormHrz>                   
                    </>
                  )
                }
              }

              return (  
                <>
                  <ColsContainer className='' key={hedge.id_disassembly}>
                    <SimpleCol className='bi-u-bgColor-gray-light bi-u-spacer-mb-big'>
                      <TableDataHeader>
                        <TableCellMedium>Petición</TableCellMedium>
                        <TableCellMedium>Fecha solicitud</TableCellMedium>
                        <TableCellMedium>Fecha desarme</TableCellMedium>
                        <TableCellMedium>Validado por</TableCellMedium>
                      </TableDataHeader>
                      <TableDataRow>
                        <TableDataRowWrapper>
                          <TableCellMedium>{hedge.user_request}</TableCellMedium>
                          <TableCellMedium>{hedge.dt_request_date_disassembly}</TableCellMedium>
                          <TableCellMedium>{hedge.dt_approval_date}</TableCellMedium>
                          <TableCellMedium>{hedge.user_approval}</TableCellMedium>
                        </TableDataRowWrapper>
                      </TableDataRow>
                      <TableDataHeader>
                        <TableCellMedium>Nocional objeto</TableCellMedium>
                        <TableCellMedium>% Objeto</TableCellMedium>
                        <TableCellMedium>Nocional derivado</TableCellMedium>
                        <TableCellMedium>% Derivado</TableCellMedium>
                        <TableCellMedium>Motivo desarme</TableCellMedium>
                      </TableDataHeader>
                      <TableDataRow>
                        <TableDataRowWrapper>
                          <TableCellMedium>{hedge.num_disassembly_item_notional}</TableCellMedium>
                          <TableCellMedium>{hedge.pct_disassembly_item}</TableCellMedium>
                          <TableCellMedium>{hedge.num_disassembly_instrument_notional}</TableCellMedium>
                          <TableCellMedium>{hedge.pct_disassembly_instrument}</TableCellMedium>
                          <TableCellMedium>{renderDisassemblyReason()} {hedge.desc_disassembly_reason}</TableCellMedium>
                        </TableDataRowWrapper>
                      </TableDataRow>
                    </SimpleCol>
                    <SectionThird className='bi-u-bgColor-gray-light bi-u-spacer-mb-big'>
                      <TableData>
                        <TableDataHeader>
                          <TableCellMedium>Estatus</TableCellMedium>
                          <TableCellLong>Comentarios</TableCellLong>
                        </TableDataHeader>
                        <TableDataRow>
                          <TableDataRowWrapper>
                            <TableCellMedium
                              className='bi-u-text-base-black'
                              >{renderStatus()}
                            </TableCellMedium>
                            <TableCellLong>{hedge.desc_comment}</TableCellLong>
                          </TableDataRowWrapper>
                        </TableDataRow>
                      </TableData>
                      {renderButtons()}                   
                    </SectionThird>
                  </ColsContainer>              
                </>
              );
            })
            :
            <>
              <TableDataRow>
                <TableDataRowWrapper>
                  <TableCellLong>
                    Esta cobertura no ha tenido ninguna solicitud de desarme
                  </TableCellLong>
                </TableDataRowWrapper>
              </TableDataRow>
            </>
          }
      </TableData>
    </main>
  );
}

export default DisarmStatusDet;