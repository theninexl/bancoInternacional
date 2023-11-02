import { useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
// import { GlobalContext } from '../../context';
import Api from '../../services/api';
import { TableHeader } from '../../components/UI/tables/TableHeaders';
import { TableData, TableDataHeader, TableDataRow, TableCellMedium, TableDataRowWrapper } from '../../components/UI/tables/TableDataElements';
import { MainHeading, SubHeading } from '../../components/UI/headings';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ColsContainer, SimpleCol } from '../../components/UI/layout/LayoutSections';
import { LabelElement, SelectElement, SimpleFormHrz, SimpleFormRow } from '../../components/UI/forms/SimpleForms';
import { ButtonLGhost, ButtonLPrimary, ButtonLSecondary } from '../../components/UI/buttons/Buttons';
import ModalSmall from '../../components/ModalSmall';

function DisarmHedge({ hedgeStatusData,setHedgeStatusData,hedgeDisarmData,setHedgeDisarmData }){
  const navigate = useNavigate();
  // const context = useContext(GlobalContext);
  const [partialDisarm, setPartialDisarm] = useState(false);
  const [formError, setFormError] = useState(null);
  const [searchParams] = useSearchParams();
  const hedgeID = searchParams.get('id');
  const disarmForm = useRef(null); 

  const accountInLocalStorage = localStorage.getItem('account');
  const parsedAccount = JSON.parse(accountInLocalStorage);
  const token = parsedAccount.token;

  //render view primera vez 
  const disarmType = document.getElementById('disarm_type');

  useEffect(() => {
    if (disarmType) {          
      disarmType.value === '1' ? setPartialDisarm(true) : setPartialDisarm (false);
    }
  },[partialDisarm])

  const handleDisarmType = () => {
    if (disarmType) {          
      disarmType.value === '1' ? setPartialDisarm(true) : setPartialDisarm (false);
    }
  }

  //datos para solicitudes a la API
  const headers = {
    'Content-Type': 'application/json',
    'x-access-token': token
  }  

  //get Cobertura  
  const getHedge = (id) => {
    const data = {'hedge':id}
    Api.call.post('hedges/disarmStatus',data,{ headers:headers })
    .then(res => {
      setHedgeStatusData(res.data);
    }).catch(err => {
      console.warn(err)})
  }

  //get disarm Data
  const getDisarm = (id) => {
    const data = {'hedge':id}
    Api.call.post('hedges/disarmGetOne',data,{ headers:headers })
    .then(res => {
      // console.log(res.data);
      setHedgeDisarmData(res.data);
    }).catch(err => {
      //setFormError(err);
      console.warn(err)})
  }

  useEffect(()=>{      
    const execGetHedge = async () => await getHedge(hedgeID);
    execGetHedge();
    const execGetDisarm = async () => await getDisarm(hedgeID);
    execGetDisarm();
  },[]);

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
          message={`¿Desea solicitar un desarme ${MsgDisarmType} sobre la relación de cobertura ${hedgeStatusData.hedge_ref}?`} 
          buttons={
            <>
              <ButtonLSecondary
                className='bi-o-button--short'
                handleClick={() => setModalOpen(false)}>
                  No, cancelar
              </ButtonLSecondary>
              <ButtonLPrimary
                className='bi-o-button--short'
                handleClick={handleDisarmeRequest}>
                  Si, seguro
              </ButtonLPrimary>
            </>
          }
        />
      );
    }
  }

  const handleDisarmeRequest = () => {
    const formData = new FormData(disarmForm.current);

    const data = {
      hedge:hedgeStatusData.hedge_ref,
      disarm_type: parseInt(formData.get('disarm_type')),
      disarm_reason: formData.get('disarm_reason'),
      object_new_notional: formData.get('object_new_notional'),
      instrument_new_notional_1: formData.get('instrument_new_notional_1'),
      instrument_new_notional_2: formData.get('instrument_new_notional_2'),
      instrument_new_notional_3: formData.get('instrument_new_notional_3')
    }

    Api.call.post("hedges/disarm",data,{ headers:headers })
      .then(res => {
        //console.log(res);
        navigate('/hedges');
      })
      .catch(err => {
        // console.log(data);
        // console.log('err',err);
        // console.log(err.response)
        setModalOpen(false);
        setFormError('Error ',err,' al realizar la solicitud')})
  
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
                    className='bi-u-text-base-black'>{hedgeStatusData.hedge_ref}</TableCellMedium>
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
          Modificación o desarme
        </SubHeading>
      </TableHeader>
      <SimpleFormHrz innerRef={disarmForm}>
        <ColsContainer className='bi-u-border-bb-gm'>
          <SimpleCol>
            <SimpleFormRow>
              <SelectElement
                htmlFor='disarm_type'
                title='Tipo de desarme'
                handleOnChange={handleDisarmType}>
                  <option value=''>Seleccionar tipo</option>
                  <option value='0'>Total</option>
                 <option value='1'>Parcial</option>
              </SelectElement>
            </SimpleFormRow>
            <SimpleFormRow>
            <SelectElement
                htmlFor='disarm_reason'
                title='Motivo de desarme'>
                  <option value=''>Seleccionar motivo</option>
                  <option value='1'>Motivo1</option>
                  <option value='2'>Motivo2</option>
                  <option value='3'>Motivo3</option>
              </SelectElement>
            </SimpleFormRow>
          </SimpleCol>
          <SimpleCol>
            <TableData>
              <TableDataHeader>
                <TableCellMedium></TableCellMedium>
                <TableCellMedium>Nocional actual</TableCellMedium>
                <TableCellMedium>Nuevo nocional</TableCellMedium>
              </TableDataHeader>
              <TableDataRow>
                <TableDataRowWrapper>
                  <TableCellMedium className='bi-u-text-base-black'>Objeto cubierto</TableCellMedium>
                  <TableCellMedium>{hedgeDisarmData.object_notional}</TableCellMedium>
                  <TableCellMedium>
                    {partialDisarm ? 
                      <LabelElement
                      htmlFor='object_new_notional'
                      type='number'>
                    </LabelElement>
                    : 
                    '---'
                      }
                  </TableCellMedium>
                </TableDataRowWrapper>
              </TableDataRow>
              <TableDataRow>
                <TableDataRowWrapper>
                  <TableCellMedium>Instrumento cobertura 1</TableCellMedium>
                  <TableCellMedium>{hedgeDisarmData.instrument_notional_1}</TableCellMedium>
                  <TableCellMedium>
                    {partialDisarm ? 
                      <LabelElement
                      htmlFor='instrument_new_notional_1'
                      type='number'>
                    </LabelElement>
                    : 
                    '---'
                      }
                  </TableCellMedium>
                </TableDataRowWrapper>
              </TableDataRow>
              <TableDataRow>
                <TableDataRowWrapper>
                  <TableCellMedium>Instrumento cobertura 2</TableCellMedium>
                  <TableCellMedium>{hedgeDisarmData.instrument_notional_2}</TableCellMedium>
                  <TableCellMedium>
                    {partialDisarm ? 
                      <LabelElement
                      htmlFor='instrument_new_notional_2'
                      type='number'>
                    </LabelElement>
                    : 
                    '---'
                      }
                  </TableCellMedium>
                </TableDataRowWrapper>
              </TableDataRow>
              <TableDataRow>
                <TableDataRowWrapper>
                  <TableCellMedium>Instrumento cobertura 3</TableCellMedium>
                  <TableCellMedium>{hedgeDisarmData.instrument_notional_3}</TableCellMedium>
                  <TableCellMedium>
                    {partialDisarm ? 
                      <LabelElement
                      htmlFor='instrument_new_notional_3'
                      type='number'>
                    </LabelElement>
                    : 
                    '---'
                      }
                  </TableCellMedium>
                </TableDataRowWrapper>
              </TableDataRow>
            </TableData>
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