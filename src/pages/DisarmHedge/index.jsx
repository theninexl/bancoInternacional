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

function DisarmHedge({ hedgeStatusData,setHedgeStatusData,hedgeDisarmData }){
  const navigate = useNavigate();
  // const context = useContext(GlobalContext);
  const [partialDisarm, setPartialDisarm] = useState(true);
  const [freeTextDisarmReason, setFreeTextDisarmReason] = useState(false);
  const [formError, setFormError] = useState(null);
  const [searchParams] = useSearchParams();
  //modal disarm
  const [modalOpen, setModalOpen] = useState(false);
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
    const data = {'id_hedge_relationship':id.toString()}
    Api.call.post('hedges/disarmGet',data,{ headers:headers })
    .then(res => {
      // console.log(res);
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

  
  const openDisarmModal = (e) => {
    e.preventDefault();
    setModalOpen(true);
  }

  const renderView = () => {
    let MsgDisarmType = partialDisarm ? 'parcial' : 'total'; 
    if (modalOpen) {
      return (
        <ModalSmall
          message={`¿Desea realizar el desarme de la relación ${hedgeStatusData.id_hedge_relationship}?`} 
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
    // const newNotionals = document.querySelectorAll('.newNotionalValue');

    const data = {
      'id_hedge_relationship':hedgeStatusData.id_hedge_relationship.toString(),
      'cat_disassembly': parseInt(formData.get('disarm_type')).toString(),
      'cat_disassembly_reason': formData.get('disarm_reason').toString() || '',
      'desc_disassembly_reason': formData.get('disarm_reason_freeText') || '',
      'pct_disassembly_item': formData.get('object_new_notional') || 0,
      'pct_disassembly_instrument': formData.get('instrument_new_notional') || 0,
    }

    // newNotionals.forEach(newNotional => {
    //   data[newNotional.id] = newNotional.value;
    // })

    Api.call.post("hedges/disarmExecute",data,{ headers:headers })
      .then(res => {
        //console.log(res);
        navigate('/hedges');
      })
      .catch(err => {
        setModalOpen(false);
        if (err.response.status == 409) {
          setFormError('No se puede solicitar un desarme nuevo porque esta cobertura tiene pendiente la validación de un desarme anterior')
        } else {
          setFormError('Error  al realizar la solicitud')
        }
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
                        {hedgeStatusData.id_hedge_item}
                      </TableCellMedium>
                      <TableCellMedium>
                        {hedgeStatusData.num_item_notional}
                      </TableCellMedium>
                      <TableCellMedium>                        
                          <LabelElement
                          htmlFor='object_new_notional'
                          type='number'
                          placeholder=''>
                        </LabelElement>                          
                      </TableCellMedium>
                    </TableDataRowWrapper>
                  </TableDataRow>
                  <TableDataRow>
                    <TableDataRowWrapper>
                      <TableCellMedium className='bi-u-text-base-black'>
                        {hedgeStatusData.id_hedge_instrument}
                      </TableCellMedium>
                      <TableCellMedium>
                        {hedgeStatusData.num_instrument_notional}
                      </TableCellMedium>
                      <TableCellMedium>                        
                          <LabelElement
                          htmlFor='instrument_new_notional'
                          type='number'
                          placeholder=''>
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