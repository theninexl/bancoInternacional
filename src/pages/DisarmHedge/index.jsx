import { useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
// import { GlobalContext } from '../../context';
import Api from '../../services/api';
import Papa from 'papaparse';
import { TableHeader } from '../../components/UI/tables/TableHeaders';
import { TableData, TableDataHeader, TableDataRow, TableCellMedium, TableDataRowWrapper } from '../../components/UI/tables/TableDataElements';
import { MainHeading, SubHeading } from '../../components/UI/headings';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ColsContainer, SimpleCol } from '../../components/UI/layout/LayoutSections';
import { LabelElement, SelectElement, SimpleFormHrz, SimpleFormRow } from '../../components/UI/forms/SimpleForms';
import { ButtonLGhost, ButtonLPrimary, ButtonLSecondary } from '../../components/UI/buttons/Buttons';
import ModalSmall from '../../components/ModalSmall';
import { FileDrop } from '../../components/UI/forms/FileDrop';

function DisarmHedge({ hedgeStatusData,setHedgeStatusData,hedgeDisarmData,setHedgeDisarmData,deferredFlowFile,setDeferredFlowFile,deferredFlowInfo,setDeferredFlowInfo }){
  const navigate = useNavigate();
  // const context = useContext(GlobalContext);
  const [partialDisarm, setPartialDisarm] = useState(true);
  const [freeTextDisarmReason, setFreeTextDisarmReason] = useState(false);
  const [formError, setFormError] = useState(null);
  const [searchParams] = useSearchParams();
  const [uploadedFileName, setUploadedFileName] = useState();
  const hedgeID = searchParams.get('id');
  const disarmForm = useRef(null); 
  let notional_instrument = 0;

  const accountInLocalStorage = localStorage.getItem('account');
  const parsedAccount = JSON.parse(accountInLocalStorage);
  const token = parsedAccount.token;

  //render view primera vez 
  const disarmType = document.getElementById('disarm_type');

  //datos para solicitudes a la API
  const headers = {
    'Content-Type': 'application/json',
    'x-access-token': token
  }  

  //get Cobertura  
  const getHedge = (id) => {
    const data = {'id':id}
    Api.call.post('hedges/disarmGet',data,{ headers:headers })
    .then(res => {
      console.log(res.data);
      setHedgeStatusData(res.data);
    }).catch(err => {
      console.warn(err)})
  }

  useEffect(()=>{      
    const execGetHedge = async () => await getHedge(hedgeID);
    execGetHedge();
  },[]);

  useEffect(() => {
    if (disarmType) {          
      disarmType.value === '0' ? setPartialDisarm(true) : setPartialDisarm (false);
    }
  },[partialDisarm])

  //mirar cuando cambia deferrefFlowFile para parsearlo y guardarlo
  useEffect(()=>{
    if (deferredFlowFile) {
      console.log(deferredFlowFile);
      setUploadedFileName(deferredFlowFile[0]?.name);
      Papa.parse(deferredFlowFile[0], {
        complete: function(results) {
          console.log(results.data);
          setDeferredFlowInfo(results.data);     
        }
      });
      console.log(deferredFlowInfo);
    }
  },[deferredFlowFile])

  const handleDisarmType = () => {
    if (disarmType) {          
      disarmType.value === '0' ? setPartialDisarm(true) : setPartialDisarm (false);
    }
  }

  const handleDisarmReason = () => {
    if (disarm_reason) {
      disarm_reason.value === '4' ? setFreeTextDisarmReason(true): setFreeTextDisarmReason(false);
    }
  }


  //mostrar modal disarm
  const [modalOpen, setModalOpen] = useState(false);
  const openDisarmModal = (e) => {
    e.preventDefault();
    setModalOpen(true);
  }

  const renderView = () => {
    let MsgDisarmType = partialDisarm ? 'parcial' : 'total'; 
    if (modalOpen) {
      return (
        <ModalSmall
          message={`¿Desea realizar el desarme de la relación ${hedgeStatusData.data[0].id_hedge_relationship}?`} 
          buttons={
            <>
            <ButtonLPrimary
                className='bi-o-button--short'
                handleClick={handleDisarmeRequest}>
                  Aceptar
              </ButtonLPrimary>
              <ButtonLSecondary
                className='bi-o-button--short'
                handleClick={() => setModalOpen(false)}>
                  Cancelar
              </ButtonLSecondary>
            </>
          }
        />
      );
    }
  }

  const handleDisarmeRequest = () => {
    const formData = new FormData(disarmForm.current);
    const newNotionals = document.querySelectorAll('.newNotionalValue');

    const data = {
      hedge:hedgeStatusData.id_hedge_relationship,
      disarm_type: parseInt(formData.get('disarm_type')),
      disarm_reason: formData.get('disarm_reason'),
      object_new_notional: formData.get('object_new_notional'),
    }

    newNotionals.forEach(newNotional => {
      data[newNotional.id] = newNotional.value;
    })

    Api.call.post("hedges/disarmExecute",data,{ headers:headers })
      .then(res => {
        console.log(res);
        navigate('/hedges');
      })
      .catch(err => {
        // console.log(data);
        // console.log('err',err);
        // console.log(err.response)
        setModalOpen(false);
        setFormError('Error ',err,' al realizar la solicitud')
      })  
  }

  

  const HandleCancel = () => {
    navigate('/hedges');
  }

  return (
    <main className="bi-u-h-screen--wSubNav">
      {renderView()}
      <TableHeader>
        <MainHeading className='bi-u-border-bb-gm'>
          Desarmar cobertura
        </MainHeading>
      </TableHeader>
      <TableData>
        <TableDataHeader>
          <TableCellMedium>Ref.</TableCellMedium>
          <TableCellMedium>Partida cubierta</TableCellMedium>
          <TableCellMedium>Derivado</TableCellMedium>
          <TableCellMedium>Tipo</TableCellMedium>
          <TableCellMedium>Monto subyacente</TableCellMedium>
          <TableCellMedium>Fecha inicio</TableCellMedium>
          <TableCellMedium>Fecha vencimiento</TableCellMedium>
        </TableDataHeader>

        {
          hedgeStatusData.data?.map(hedgeRow => {
            return (
              <TableDataRow key={uuidv4()}>
                <TableDataRowWrapper>
                  <TableCellMedium
                    className='bi-u-text-base-black'>{hedgeRow.id_hedge_relationship}</TableCellMedium>
                  <TableCellMedium>{hedgeRow.id_hedge_item}</TableCellMedium>
                  <TableCellMedium>{hedgeRow.id_hedge_instrument}</TableCellMedium>
                  <TableCellMedium>{hedgeRow.cat_hedge_item_type}</TableCellMedium>
                  <TableCellMedium>{hedgeRow.num_instrument_notional}</TableCellMedium>
                  <TableCellMedium>{hedgeRow.dt_start_date}</TableCellMedium>
                  <TableCellMedium>{hedgeRow.dt_maturity_date}</TableCellMedium>
                </TableDataRowWrapper>
              </TableDataRow>
            );})
        }
      </TableData>
      <TableHeader>
        <SubHeading  className='bi-u-border-bb-gm bi-u-spacer-mt-huge'>
          Desarme de la cobertura
        </SubHeading>
      </TableHeader>
      <SimpleFormHrz innerRef={disarmForm}>
        <ColsContainer className='bi-u-border-bb-gm'>
          <SimpleCol>
            <SimpleFormRow>
              <FileDrop
                htmlFor='deferredFlowsField'
                placeholder={uploadedFileName ? uploadedFileName : 'selecciona o suelta CSV'}
                accept='.csv'
                deferredFlowFile={deferredFlowFile}
                setDeferredFlowFile={setDeferredFlowFile}
              >Flujos diferidos</FileDrop>
            </SimpleFormRow>
            <SimpleFormRow>
              <SelectElement
                htmlFor='disarm_type'
                title='Tipo de desarme'
                handleOnChange={handleDisarmType}>
                  <option value='0'>Parcial</option>
                 <option value='1'>Total</option>
              </SelectElement>
            </SimpleFormRow>
            <SimpleFormRow>
            <SelectElement
                htmlFor='disarm_reason'
                title='Motivo de desarme'
                handleOnChange={handleDisarmReason}>
                  <option value=''>Seleccionar</option>
                  <option value='1'>El objeto cubierto no existe</option>
                  <option value='2'>El nivel de tasas actual no justifica la cobertura</option>
                  <option value='3'>Estrategia de negocio</option>
                  <option value='4'>Otro</option>
              </SelectElement>
            </SimpleFormRow>
            <SimpleFormRow>
              {freeTextDisarmReason ? 
                <>
                  <LabelElement
                    htmlFor='disarm_reason_freeText'
                    type='text'
                    placeholder='Escribir razón'>
                      Especificar
                  </LabelElement>    
                </>
                :
                '' }
            </SimpleFormRow>
          </SimpleCol>
          <SimpleCol>
            {partialDisarm ? 
              <>
                <TableData>
                  <TableDataHeader>
                    <TableCellMedium></TableCellMedium>
                    <TableCellMedium>Nocional actual</TableCellMedium>
                    <TableCellMedium>Nuevo</TableCellMedium>
                  </TableDataHeader>
                  <TableDataRow>
                    <TableDataRowWrapper>
                      <TableCellMedium className='bi-u-text-base-black'>
                        {hedgeStatusData.disarm_data === 'undefined' ? 
                          hedgeStatusData?.disarm_data[0].id_hedge_item
                          :
                          ''
                        }
                      </TableCellMedium>
                      <TableCellMedium>
                        {hedgeStatusData.disarm_data === 'undefined' ? 
                          hedgeStatusData?.disarm_data[0].num_item_notional
                          :
                          ''
                        }
                      </TableCellMedium>
                      <TableCellMedium>                        
                          <LabelElement
                          htmlFor='object_new_notional'
                          type='number'
                          placeholder='introduce nocional'>
                        </LabelElement>                          
                      </TableCellMedium>
                    </TableDataRowWrapper>
                  </TableDataRow>
                  <TableDataRow>
                    <TableDataRowWrapper>
                      <TableCellMedium className='bi-u-text-base-black'>
                        {hedgeStatusData.disarm_data === 'undefined' ? 
                          hedgeStatusData?.disarm_data[0].id_hedge_instrument
                          :
                          ''
                        }
                      </TableCellMedium>
                      <TableCellMedium>
                        {hedgeStatusData.disarm_data === 'undefined' ? 
                          hedgeStatusData?.disarm_data[0]?.num_instrument_notional
                          :
                          ''
                        }
                      </TableCellMedium>
                      <TableCellMedium>                        
                          <LabelElement
                          htmlFor='object_new_notional'
                          type='number'
                          placeholder='introduce nocional'>
                        </LabelElement>                          
                      </TableCellMedium>
                    </TableDataRowWrapper>
                  </TableDataRow>
                </TableData>
              </>
              :
              ''
            }
          </SimpleCol>
        </ColsContainer>
        {formError &&
            <ColsContainer>
            <SimpleFormRow 
              style={{'flexGrow':1}}  
              className='bi-u-centerText' >
              <span className='error'>{formError}</span>
            </SimpleFormRow>
            </ColsContainer>
            }
        <ColsContainer>
            <SimpleFormRow
              style={{'flexGrow':1}}   
              className='bi-u-centerText'>
                <ButtonLGhost
                  className='bi-o-button--short'
                  handleClick={HandleCancel}
                  >
                    Cancelar
                </ButtonLGhost>
                <ButtonLPrimary
                  className='bi-o-button--short'
                  type='submit'
                  handleClick={openDisarmModal}
                  >
                    Confirmar
                </ButtonLPrimary>
            </SimpleFormRow>     
        </ColsContainer>
      </SimpleFormHrz>      
    </main>
  );
}

export default DisarmHedge;