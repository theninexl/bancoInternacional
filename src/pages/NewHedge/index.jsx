import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Api from '../../services/api';
import { DateTime } from "luxon";
import { TableHeader } from '../../components/UI/tables/TableHeaders';
import { LabelElement, SelectElement, SimpleFormHrz, SimpleFormRow,  ToggleElement,  UploadFileTo64 } from "../../components/UI/forms/SimpleForms";
import { ButtonLGhost, ButtonLPrimary } from "../../components/UI/buttons/Buttons";
import { MainHeading } from "../../components/UI/headings";
import { TableData, TableDataHeader, TableCellMedium, TableDataRow, TableDataRowWrapper } from "../../components/UI/tables/TableDataElements";


const NewHedge = ({ hedges, setHedges, allHedges, setAllHedges, page, totalrowscount, setTotalrowscount }) => {
  const navigate = useNavigate();
  const form = useRef(null);
  const [formError, setFormError] = useState('');
  const [idHedgeItem, setIdHedgeItem] = useState('');
  const [maturityDateItem, setMaturityDateItem] = useState('');
  const [numNotionalItem, setNumNotionalItem] = useState();
  const [idHedgeInstrument, setIdHedgeInstrument] = useState('');
  const [maturityDateInstrument, setMaturityDateInstrument] = useState('');
  const [numNotionalInstrument, setNumNotionalInstrument] = useState();
  const [createHedgeItems, setCreateHedgeItems] = useState();  

  const accountInLocalStorage = localStorage.getItem('account');
  const parsedAccount = JSON.parse(accountInLocalStorage);
  const token = parsedAccount.token; 
  const headers = {
    'Content-Type': 'application/json',
    'x-access-token': token,
  }

  //get CreateGet
  const getCreateHedge = () => {
    const data = {}
    Api.call.post('hedges/createGetCombos',data,{ headers:headers })
    .then(res => {
      setCreateHedgeItems(res.data);
    }).catch(err => {
      console.warn(err)})
  }

  //get Info extra Partida cubierta
  const createGetItem = (id) => {
    const data = {'id':id}
    Api.call.post('hedges/createGetItem',data,{ headers:headers })
    .then(res => {
      // console.log(res.data);
      const dateItem = DateTime.fromISO(res.data.dt_maturity_date).toFormat('yyyy-MM-dd'); 
      setMaturityDateItem(dateItem);
      setNumNotionalItem(res.data.num_notional);     
      //setCreateItemDate(dateItem);
    }).catch(err => {
      console.warn(err)})
  }

  //get Info extra Derivado
  const createGetInstrument = (id) => {
    const data = {'id':id}
    Api.call.post('hedges/createGetInstrument',data,{ headers:headers })
    .then(res => {
      // console.log(res.data);
      const dateInstrument = DateTime.fromISO(res.data.dt_maturity_date).toFormat('yyyy-MM-dd');
      setMaturityDateInstrument(dateInstrument);
      setNumNotionalInstrument(res.data.num_notional);       
      // setCreateInstrumentDate(dateInstrument);
    }).catch(err => {
      console.warn(err)})
  }

  useEffect(()=>{      
    const execGetCreateHedge = async () => await getCreateHedge();
    execGetCreateHedge();
  },[]);



  //colocar todas las partidas de cubierta disponibles en el primer select cuando tengamos todas las coberturas cargadas
  useEffect(()=>{
    if (createHedgeItems) {
      setHedgeItemsOnSelect();
      setHedgeInstrumentsOnSelect();
    }
  },[createHedgeItems])

  //llamar a cargar datos cuando cambia la partida cubierta
  useEffect(() => {
    if (idHedgeItem) {
      const execCreateGetItem = async () => await createGetItem(idHedgeItem);
      execCreateGetItem();
    }
  },[idHedgeItem])

  //llamar a cargar datos cuando cambia el derivado
  useEffect(() => {
    if (idHedgeInstrument) {

      const execCreateGetInstrument = async () => await createGetInstrument(idHedgeInstrument);
      execCreateGetInstrument();
    }
  },[idHedgeInstrument])

  //rellenar select con todas las partidasd de cubierta
  const setHedgeItemsOnSelect = () => {
    const itemSelect = document.getElementById('id_hedge_item');
    itemSelect.innerHTML = '';
    const firstOption = document.createElement('option');
    firstOption.setAttribute('value','');
    firstOption.textContent = 'Selecciona';
    itemSelect.appendChild(firstOption);

    createHedgeItems.items.map(hedge => {
      const option = document.createElement('option');
      option.setAttribute('value',hedge.id_hedge_item);
      option.textContent = hedge.id_hedge_item;
      itemSelect.appendChild(option);
    })
  }

  //rellenar select derivados con todos los instrumentos
  const setHedgeInstrumentsOnSelect = () => {
    const itemSelect = document.getElementById('id_hedge_instrument');
    itemSelect.innerHTML = '';
    const firstOption = document.createElement('option');
    firstOption.setAttribute('value','');
    firstOption.textContent = 'Selecciona';
    itemSelect.appendChild(firstOption);

    createHedgeItems.instruments.map(hedge => {
      const option = document.createElement('option');
      option.setAttribute('value',hedge.id_hedge_instrument);
      option.textContent = hedge.id_hedge_instrument;
      itemSelect.appendChild(option);
    })
  }
  
  const HandleSave = (e) => {    
    e.preventDefault();
    const formData = new FormData(form.current);
    const data = {
      id_hedge_item: formData.get('id_hedge_item'),
      dt_maturity_date_item: formData.get('dt_maturity_date_item'),
      num_notional_item: formData.get('num_notional_item'),
      liabi_item: formData.get('liabi_item'),
      id_hedge_instrument: formData.get('id_hedge_instrument'),
      dt_maturity_date_instrument: formData.get('dt_maturity_date_instrument'),
      num_notional_instrument: formData.get('num_notional_instrument'),
      coverage_instrument: formData.get('coverage_instrument'),
      card_type: formData.get('card_type'),
      card: formData.get('card'),
    }    
    const dataSent = {
      "id_hedge_item":data.id_hedge_item,
      "dt_maturity_date":data.dt_maturity_date_item,
      "num_notional_item":data.num_notional_item,
      "liabi_item":data.liabi_item,
      "id_hedge_instrument":data.id_hedge_instrument,
      "dt_maturity_date_instrument": data.dt_maturity_date_instrument,
      "num_notional_instrument":data.num_notional_instrument,
      "coverage_instrument":data.coverage_instrument,
      "card_type":data.card_type,
      "card":data.card,
    }

    Api.call.post("hedges/create",dataSent,{ headers:headers })
      .then(res => {
        navigate('/hedges');
      })
      .catch(err => {
        setFormError('Error al realizar la solicitud. Inténtalo de nuevo.')})
  }

  const HandleCancel = () => {
    navigate('/hedges');
  }

  return (
    <main className="bi-u-h-screen--wSubNav">
      <TableHeader className='bi-u-border-bb-gm'>
        <MainHeading>
          Crear cobertura
        </MainHeading>
      </TableHeader>      
      <SimpleFormHrz  innerRef={form}>
        <TableData>
          <TableDataHeader>
            <TableCellMedium>Partida cubierta</TableCellMedium>
            <TableCellMedium>Fecha vencimiento</TableCellMedium>
            <TableCellMedium>Nocional</TableCellMedium>
            <TableCellMedium>Activo/Pasivo</TableCellMedium>
          </TableDataHeader>          
          {
            createHedgeItems && 
            <>
              <TableDataRow>
                <TableDataRowWrapper>
                  <TableCellMedium>
                  <SelectElement
                        htmlFor='id_hedge_item'
                        value={idHedgeItem}
                        handleOnChange={(event) =>{
                          event.preventDefault();
                          setIdHedgeItem(event.target.value);
                        }}
                        >
                        <option value=''>Seleccionar</option>
                      </SelectElement>              
                  </TableCellMedium>
                  <TableCellMedium>
                    <LabelElement
                      htmlFor='dt_maturity_date_item'
                      type='date'
                      placeholder='Fecha'
                      value={maturityDateItem}
                      readOnly={true}
                      >
                    </LabelElement>
                    </TableCellMedium>
                  <TableCellMedium>
                    <LabelElement
                      htmlFor='num_notional_item'
                      type='text'
                      value={numNotionalItem}
                      placeholder='Nocional'
                      readOnly={true}
                     >
                    </LabelElement>
                  </TableCellMedium>
                  <TableCellMedium>
                    
                  <SelectElement
                    htmlFor='liabi_item'>
                      <option value='0'>Activo</option>
                    <option value='1'>Pasivo</option>
                  </SelectElement>
                  </TableCellMedium>
                </TableDataRowWrapper>            
              </TableDataRow>
            </>
          }
        </TableData>        
        
        {/* NUEVO INSTRUMENTO */}
        <TableData>
          <TableDataHeader>
            <TableCellMedium>Derivado</TableCellMedium>
            <TableCellMedium>Fecha vencimiento</TableCellMedium>
            <TableCellMedium>Nocional</TableCellMedium>
            <TableCellMedium>% Derivado</TableCellMedium>
          </TableDataHeader>
          {
            createHedgeItems && 
            <>
              <TableDataRow>
                <TableDataRowWrapper>
                  <TableCellMedium>
                  <SelectElement
                        htmlFor='id_hedge_instrument'
                        value={idHedgeInstrument}
                        handleOnChange={(event) =>{
                          event.preventDefault();
                          setIdHedgeInstrument(event.target.value);
                        }}
                        >
                        <option value=''>Seleccionar</option>
                      </SelectElement>              
                    
                  </TableCellMedium>
                  <TableCellMedium>
                  <LabelElement
                      htmlFor='dt_maturity_date_instrument'
                      type='date'
                      value={maturityDateInstrument}
                      placeholder='Fecha'
                      readOnly={true}
                      >
                    </LabelElement>
                    </TableCellMedium>
                  <TableCellMedium>
                    <LabelElement
                      htmlFor='num_notional_instrument'
                      type='text'
                      value={numNotionalInstrument}
                      placeholder='Nocional'
                      readOnly={true}
                      
                      >
                    </LabelElement>
                  </TableCellMedium>
                  <TableCellMedium>
                    <LabelElement
                      htmlFor='coverage_instrument'
                      type='number'
                      placeholder='%'
                      >
                    </LabelElement>
                  </TableCellMedium>
                </TableDataRowWrapper>            
              </TableDataRow>
            </>
          }
        </TableData>


        {/* NUEVO INSTRUMENTO */}
        <TableData>
          <TableDataHeader>
            <TableCellMedium>Tipo de ficha</TableCellMedium>
            <TableCellMedium>Ficha</TableCellMedium>
            <TableCellMedium></TableCellMedium>
            <TableCellMedium></TableCellMedium>
          </TableDataHeader>
          {
            createHedgeItems && 
            <>
              <TableDataRow>
                <TableDataRowWrapper>
                  <TableCellMedium>
                    <SelectElement
                      htmlFor='card_type'
                      >
                      <option value=''>Seleccionar</option>
                      <option value='VR'>VR</option>
                      <option value='FC'>FC</option>
                    </SelectElement>
                  </TableCellMedium>
                  <TableCellMedium>
                    <SelectElement
                      htmlFor='card'
                      >
                      <option value=''>Seleccionar</option>
                      <option value='VR'>F1</option>
                      <option value='FC'>F2</option>
                      <option value='FC'>F3</option>
                      <option value='FC'>F4</option>
                    </SelectElement>
                  </TableCellMedium>
                  <TableCellMedium></TableCellMedium>
                  <TableCellMedium></TableCellMedium>
                </TableDataRowWrapper>            
              </TableDataRow>
            </>
          }
        </TableData>        
        <SimpleFormRow
          style={{'flexGrow':1}}   
          className='bi-u-centerText bi-u-border-bb-gm bi-u-border-bt-gm' >
            
            <ButtonLGhost
              className='bi-o-button--short'
              handleClick={HandleCancel}
              >
                Cancelar
            </ButtonLGhost>
            <ButtonLPrimary
              className='bi-o-button--short'
              type='submit'
              handleClick={HandleSave}
              >
                Guardar
            </ButtonLPrimary>
        </SimpleFormRow>
        {formError && 
          <SimpleFormRow className='bi-u-centerText'>
            <span className='error'>{formError}</span>
          </SimpleFormRow>
        }     
      
      </SimpleFormHrz>
    </main>
  );
}

export default NewHedge;