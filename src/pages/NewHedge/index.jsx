import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Papa from 'papaparse';
import { ColsContainer, SectionHalf, SimpleCol } from '../../components/UI/layout/LayoutSections';
import { TableHeader, TableHeaderSub } from '../../components/UI/tables/TableHeaders';
import { LabelElement, SelectElement, SimpleFormHrz, SimpleFormRow,  ToggleElement,  UploadFileTo64 } from "../../components/UI/forms/SimpleForms";
import { ButtonLGhost, ButtonLPrimary } from "../../components/UI/buttons/Buttons";
import Api from '../../services/api';
import { MainHeading } from "../../components/UI/headings";


const NewHedge = ({ fileInstrument, setFileInstrument }) => {
  const navigate = useNavigate();
  const [fixedElement, setFixedElement] = useState(true);

  const accountInLocalStorage = localStorage.getItem('account');
  const parsedAccount = JSON.parse(accountInLocalStorage);
  const token = parsedAccount.token;
  

  //setear el campo de tipo de interés de cubierta 
  //elementos 
  const FixedElement = () => {
    return (
      <SelectElement
        id='item_interest_fixed'
        htmlFor='item_interest_type'
        title='Tipo interés' >
          <option value=''>Selecciona</option>
          <option value='Euribor'>Euribor</option>
          <option value='Libor'>Libor</option>
          <option value='Inflaccion'>Inflacción</option>
      </SelectElement>
    );
  } 
  const VariableElement = () => {
    return (
      <LabelElement
        id='item_interest_flexible'
        htmlFor='item_interest_type'
        type='text'
        placeholder='Tipo interés'>
        Tipo interés
      </LabelElement>
    );
  }

   //resetear datos csv 
   useEffect(()=>{
    setFileInstrument([]);
   },[])

  //render view primera vez 
  const itemFinancingType = document.getElementById('item_financing');

  //setear el campo de tipo de interés
  useEffect(()=>{    
    // console.log('use effect fixed Element')
    if (itemFinancingType) {          
      if (itemFinancingType.value === 'Fijo') {
        //console.log('es fijo');
        setFixedElement(true);
      } else if (itemFinancingType.value === 'Variable') {
        //console.log('es variable');
        setFixedElement(false);
      }
      // console.log(fixedElement);
    }  

  },[fixedElement]);

  //manejar cambio en el campo tipo de financiación
  const handleFinancingType = () => {
    if (itemFinancingType) {          
      if (itemFinancingType.value === 'Fijo') {
        setFixedElement(true);
      } else if (itemFinancingType.value === 'Variable') {
        setFixedElement(false);
      }
    }  
  }

  const renderView = () => {
    return fixedElement ? <FixedElement/> : <VariableElement/> ;
  }  

  //procesar archivo cuando lo añades para pintar el nombre en el campo y llamar a parsearlo
  const handlePlaceHolder = (e) => {
    let tagName = document.getElementById('InstrFilePlaceholder');
    tagName.innerText = e.target.files[0].name;
    const inputFile = e.target.files[0];
    Papa.parse(inputFile, {
      complete: function(results) {
        setFileInstrument(results.data);     
      }
    });
  }

  //si cambia el csv buscar el nuevo campo de financiación para actualizar el tipo de interés
  useEffect(()=>{
    // console.log('use effect csv');
    if (fileInstrument.length > 0) {
      const financingToState = fileInstrument.find(t => {
        return t.find(item => item === 'item_financing')
      })
      // console.log('if tipo de interés');
      if (financingToState[1] == 'Fijo') {
        // console.log('actualizo fixedElement a true (fijo)');
        itemFinancingType.value = 'Fijo';
        setFixedElement(true);
      } else if (financingToState[1] == 'Variable') {
        // console.log('actualizo fixedElement a false (variable)');
        itemFinancingType.value = 'Variable';
        setFixedElement(false);
      }
    }
  },[fileInstrument])

  //colocar los valores en los campos de alta cubierta al hacer click
  const handleInstrFile = (e) => {
    e.preventDefault();
    
    fileInstrument.map(item => {
      const hedgeItemField = document.getElementById(item[0]);
      hedgeItemField.value = item[1];
    })
  }

  //mostrar/ocultar las diferentes secciones CAP y FLOOR
  const handleSub = (e) => {
    const pata1cap = document.getElementById('pata1cap');
    const pata1floor = document.getElementById('pata1floor');
    const pata2cap = document.getElementById('pata2cap');
    const pata2floor = document.getElementById('pata2floor');
    const toggle = e.target.name;
    const isToggleActive = e.target.checked;

    switch (toggle) {
      case 'cap1toggle':
      (isToggleActive) ? pata1cap.classList.remove('bi-u-inactive') : pata1cap.classList.add('bi-u-inactive');
      break;
      case 'floor1toggle':
      (isToggleActive) ? pata1floor.classList.remove('bi-u-inactive') : pata1floor.classList.add('bi-u-inactive');
      break;
      case 'cap2toggle':
      (isToggleActive) ? pata2cap.classList.remove('bi-u-inactive') : pata2cap.classList.add('bi-u-inactive');
      break;
      case 'floor2toggle':
      (isToggleActive) ? pata2floor.classList.remove('bi-u-inactive') : pata2floor.classList.add('bi-u-inactive');
      break;
    }    
  }

  //captura datos formulario
  const [hedgeError, setHedgeError] = useState('');
  const InstrForm = useRef(null); 
  const headers = {
    'Content-Type': 'application/json',
    'x-access-token': token
  }

  const handleNewHedge = (e) => {
    e.preventDefault();

    const formData = new FormData(InstrForm.current);
        
    const data = {
      instrument: formData.get('instrument'),
      notional_1: formData.get('notional_1'),
      currency_1: formData.get('currency_1'),
      date_effective_1: formData.get('date_effective_1'),
      date_expire_1: formData.get('date_expire_1'),
      interest_type_1: formData.get('interest_type_1'),
      payment_freq_1: formData.get('payment_freq_1'),
      base_1: formData.get('base_1'),
      cap_1: formData.get('cap_1'),
      floor_1: formData.get('floor_1'),
      cap_notional_1: formData.get('cap_notional_1'),
      cap_currency_1: formData.get('cap_currency_1'),
      cap_date_effective_1: formData.get('cap_date_effective_1'),
      cap_date_expire_1: formData.get('cap_date_expire_1'),
      cap_index_1: formData.get('cap_index_1'),
      cap_strike_1: formData.get('cap_strike_1'),
      cap_index_freq_1: formData.get('cap_index_freq_1'),
      cap_payment_freq_1: formData.get('cap_payment_freq_1'),
      cap_base_1: formData.get('cap_base_1'),
      floor_notional_1: formData.get('floor_notional_1'),
      floor_currency_1: formData.get('floor_currency_1'),
      floor_date_effective_1: formData.get('floor_date_effective_1'),
      floor_date_expire_1: formData.get('floor_date_expire_1'),
      floor_index_1: formData.get('floor_index_1'),
      floor_strike_1: formData.get('floor_strike_1'),
      floor_index_freq_1: formData.get('floor_index_freq_1'),
      floor_payment_freq_1: formData.get('floor_payment_freq_1'),
      floor_base_1: formData.get('floor_base_1'),
      notional_2: formData.get('notional_2'),
      currency_2: formData.get('currency_2'),
      date_effective_2: formData.get('date_effective_2'),
      index_2: formData.get('index_2'),
      spread_2: formData.get('spread_2'),
      index_freq_2: formData.get('index_freq_2'),
      payment_freq_2: formData.get('payment_freq_2'),
      base_2: formData.get('base_2'),
      cap_2: formData.get('cap_2'),
      floor_2: formData.get('floor_2'),
      cap_notional_2: formData.get('cap_notional_2'),
      cap_currency_2: formData.get('cap_currency_2'),
      cap_date_effective_2: formData.get('cap_date_effective_2'),
      cap_date_expire_2: formData.get('cap_date_expire_2'),
      cap_index_2: formData.get('cap_index_2'),
      cap_strike_2: formData.get('cap_strike_2'),
      cap_index_freq_2: formData.get('cap_index_freq_2'),
      cap_payment_freq_2: formData.get('cap_payment_freq_2'),
      cap_base_2: formData.get('cap_base_2'),
      floor_notional_2: formData.get('floor_notional_2'),
      floor_currency_2: formData.get('floor_currency_2'),
      floor_date_effective_2: formData.get('floor_date_effective_2'),
      floor_date_expire_2: formData.get('floor_date_expire_2'),
      floor_index_2: formData.get('floor_index_2'),
      floor_strike_2: formData.get('floor_strike_2'),
      floor_index_freq_2: formData.get('floor_index_freq_2'),
      floor_payment_freq_2: formData.get('floor_payment_freq_2'),
      floor_base_2: formData.get('floor_base_2'),
      item_instrument: formData.get('item_instrument'),
      item_notional: formData.get('item_notional'),
      item_currency: formData.get('item_currency'),
      item_date_effective: formData.get('item_date_effective'),
      item_date_expire: formData.get('item_date_expire'),
      item_interest_type: formData.get('item_interest_type'),
      item_spread: formData.get('item_spread'),
      item_index_freq: formData.get('item_index_freq'),
      item_payment_freq: formData.get('item_payment_freq'),
      item_base: formData.get('item_base'),    
    }
    console.log(data);

    Api.call.post("hedges/create",data,{ headers:headers })
      .then(res => {
        console.log(res);
        navigate('/hedges');
      })
      .catch(err => {
        console.log('err',err);
        console.log(err.response)
        setHedgeError('Error ',err,' al realizar la solicitud')})
  }

  const HandleCancel = () => {
    navigate('/hedges');
  }

  return (
    <main className="bi-u-h-screen--wSubNav">
      <TableHeader className='bi-u-border-bb-gm'>
        <MainHeading>
          Alta instrumento cobertura
        </MainHeading>
      </TableHeader>
      <ColsContainer className='bi-u-border-bb-gm'>
        <SectionHalf className='bi-u-stuckLeft'>
          <SimpleFormHrz innerRef={InstrForm}>
            <SimpleFormRow>
              <UploadFileTo64
                accept='.csv'
                htmlFor='InstrFile'
                placeholder='Click para añadir CSV'
                onChange={handlePlaceHolder}>
                Cuadro Amortización
              </UploadFileTo64>
              <ButtonLPrimary
                className='bi-o-button--short'
                type='submit'
                handleClick={handleInstrFile}
                >Añadir
              </ButtonLPrimary>
            </SimpleFormRow>
          </SimpleFormHrz>
        </SectionHalf>
      </ColsContainer>
      <SimpleFormHrz innerRef={InstrForm}>
        <ColsContainer className='bi-u-border-bb-gm'>
          <SectionHalf className='bi-u-stuckLeft'>            
              <SimpleFormRow>
                <SelectElement
                  htmlFor='instrument'
                  title='Selecciona instrumento'>
                  <option value=''>Selecciona</option>
                  <option value='IRS'>IRS</option>
                  <option value='CCS'>CCS</option>
                  <option value='SI'>Swap Inflacción</option>
                  <option value='B'>Bono</option>
                </SelectElement>
              </SimpleFormRow>            
          </SectionHalf>
        </ColsContainer>
        <ColsContainer>
          {/* PATA 1 */}
          <SimpleCol>
            <h2 
              className='bi-u-text-headS bi-u-gray-text bi-u-spacer-mt-bigger bi-u-spacer-mb-bigger'>
                Pata 1 - Cuadro de Amortización
            </h2>
            <SimpleFormRow
              className='items-2'>
              <ToggleElement
                htmlFor='cap1toggle'
                handleOnChange={handleSub}>
                CAP
              </ToggleElement>
              <ToggleElement
                htmlFor='floor1toggle'
                handleOnChange={handleSub}>
                FLOOR
              </ToggleElement>
            </SimpleFormRow>
            <SimpleFormRow>
              <SelectElement
                htmlFor='Recibir'
                title='Recibir'>
                <option value='Pata1RecibirFixed'>Fijo</option>
                <option value='Pata1RecibirFloat'>Flotante</option>
              </SelectElement>
            </SimpleFormRow>
            <SimpleFormRow>
              <LabelElement
                htmlFor='notional_1'
                type='text'
                placeholder='Introduce nocional'>
                Nocional
              </LabelElement>
            </SimpleFormRow>
            <SimpleFormRow>
              <SelectElement
                htmlFor='Currency_1'
                title='Divisa'>
                <option value='EUR'>Euros</option>
                <option value='USD'>Dolares</option>
              </SelectElement>
            </SimpleFormRow>
            <SimpleFormRow>
              <LabelElement
                htmlFor='date_effective_1'
                type='date'>
                Fecha efectivo
              </LabelElement>
            </SimpleFormRow>
            <SimpleFormRow>
              <LabelElement
                htmlFor='date_expire_1'
                type='date'>
                Fecha vencimiento
              </LabelElement>
            </SimpleFormRow>
            <SimpleFormRow>
              <LabelElement
                htmlFor='interest_type_1'
                type='text'
                placeholder='Introduce sin %'>
                Tipo de interés
              </LabelElement>
            </SimpleFormRow>
            <SimpleFormRow>
              <SelectElement
                htmlFor='Payment_freq_1'
                title='Frecuencia de pago'>
                  <option value=''>Selecciona</option>
                  <option value='weekly'>Semanal</option>
                  <option value='biWeekly'>Cada 15 días</option>
                  <option value='monthly'>Mensual</option>
                  <option value='biMonth'>Bimensual</option>
                  <option value='quart'>Trimestral</option>
                  <option value='halfY'>Semestral</option>
                  <option value='yearly'>Anual</option>
              </SelectElement>
            </SimpleFormRow>
            <SimpleFormRow>
              <LabelElement
                htmlFor='base_1'
                type='text'
                placeholder='Introduce base'>
                Base
              </LabelElement>
            </SimpleFormRow>
            
            <div id='pata1cap' className='bi-u-inactive'>
              <TableHeaderSub>CAP</TableHeaderSub>
              <SimpleFormRow>
                <SelectElement
                  htmlFor='cap_1'
                  title='Tipo'>
                    <option value=''>Selecciona</option>
                    <option value='weekly'>Comprado</option>
                    <option value='biWeekly'>Vendido</option>
                </SelectElement>
              </SimpleFormRow>
              <SimpleFormRow>
                <LabelElement
                  htmlFor='cap_notional_1'
                  type='text'
                  placeholder='Introduce nocional'>
                  Nocional
                </LabelElement>
              </SimpleFormRow>
              <SimpleFormRow>
                <SelectElement
                  htmlFor='cap_currency_1'
                  title='Divisa'>
                  <option value='EUR'>Euros</option>
                  <option value='USD'>Dolares</option>
                </SelectElement>
              </SimpleFormRow>
              <SimpleFormRow>
                <LabelElement
                  htmlFor='cap_date_effective_1'
                  type='date'>
                  Fecha efectivo
                </LabelElement>
              </SimpleFormRow>
              <SimpleFormRow>
                <LabelElement
                  htmlFor='cap_date_expire_1'
                  type='date'>
                  Fecha vencimiento
                </LabelElement>
              </SimpleFormRow>
              <SimpleFormRow>
                <LabelElement
                  htmlFor='cap_index_1'
                  type='text'
                  placeholder='Introduce índice'>
                  Índice
                </LabelElement>
              </SimpleFormRow>
              <SimpleFormRow>
                <LabelElement
                  htmlFor='cap_strike_1'
                  type='text'
                  placeholder='Introduce strike'>
                  Strike
                </LabelElement>
              </SimpleFormRow>
              <SimpleFormRow>
                <LabelElement
                  htmlFor='cap_index_freq_1'
                  type='text'
                  placeholder='Introduce frecuencia índice'>
                  Frecuencia de índice
                </LabelElement>
              </SimpleFormRow>
              <SimpleFormRow>
                <SelectElement
                  htmlFor='cap_payment_freq_1'
                  title='Frecuencia de pago'>
                    <option value=''>Selecciona</option>
                    <option value='weekly'>Semanal</option>
                    <option value='biWeekly'>Cada 15 días</option>
                    <option value='monthly'>Mensual</option>
                    <option value='biMonth'>Bimensual</option>
                    <option value='quart'>Trimestral</option>
                    <option value='halfY'>Semestral</option>
                    <option value='yearly'>Anual</option>
                </SelectElement>
              </SimpleFormRow>
              <SimpleFormRow>
                <LabelElement
                  htmlFor='cap_base_1'
                  type='text'
                  placeholder='Introduce base'>
                  Base
                </LabelElement>
              </SimpleFormRow>
            </div>

            <div id='pata1floor' className='bi-u-inactive'>
              <TableHeaderSub>FLOOR</TableHeaderSub>
              <SimpleFormRow>
                <SelectElement
                  htmlFor='floor_1'
                  title='Tipo'>
                    <option value=''>Selecciona</option>
                    <option value='weekly'>Comprado</option>
                    <option value='biWeekly'>Vendido</option>
                </SelectElement>
              </SimpleFormRow>
              <SimpleFormRow>
                <LabelElement
                  htmlFor='floor_notional_1'
                  type='text'
                  placeholder='Introduce nocional'>
                  Nocional
                </LabelElement>
              </SimpleFormRow>
              <SimpleFormRow>
                <SelectElement
                  htmlFor='floor_currency_1'
                  title='Divisa'>
                  <option value='EUR'>Euros</option>
                  <option value='USD'>Dolares</option>
                </SelectElement>
              </SimpleFormRow>
              <SimpleFormRow>
                <LabelElement
                  htmlFor='floor_date_effective_1'
                  type='date'>
                  Fecha efectivo
                </LabelElement>
              </SimpleFormRow>
              <SimpleFormRow>
                <LabelElement
                  htmlFor='floor_date_expire_1'
                  type='date'>
                  Fecha vencimiento
                </LabelElement>
              </SimpleFormRow>
              <SimpleFormRow>
                <LabelElement
                  htmlFor='floor_index_1'
                  type='text'
                  placeholder='Introduce índice'>
                  Índice
                </LabelElement>
              </SimpleFormRow>
              <SimpleFormRow>
                <LabelElement
                  htmlFor='floor_strike_1'
                  type='text'
                  placeholder='Introduce strike'>
                  Strike
                </LabelElement>
              </SimpleFormRow>
              <SimpleFormRow>
                <LabelElement
                  htmlFor='floor_index_freq_1'
                  type='text'
                  placeholder='Introduce frecuencia índice'>
                  Frecuencia de índice
                </LabelElement>
              </SimpleFormRow>
              <SimpleFormRow>
                <SelectElement
                  htmlFor='floor_payment_freq_1'
                  title='Frecuencia de pago'>
                    <option value=''>Selecciona</option>
                    <option value='weekly'>Semanal</option>
                    <option value='biWeekly'>Cada 15 días</option>
                    <option value='monthly'>Mensual</option>
                    <option value='biMonth'>Bimensual</option>
                    <option value='quart'>Trimestral</option>
                    <option value='halfY'>Semestral</option>
                    <option value='yearly'>Anual</option>
                </SelectElement>
              </SimpleFormRow>
              <SimpleFormRow>
                <LabelElement
                  htmlFor='floor_base_1'
                  type='text'
                  placeholder='Introduce base'>
                  Base
                </LabelElement>
              </SimpleFormRow>
            </div>

          </SimpleCol>
          
          {/* PATA 2 */}
          <SimpleCol>

              <h2 
              className='bi-u-text-headS bi-u-gray-text bi-u-spacer-mt-bigger bi-u-spacer-mb-bigger'>
                Pata 2 - Cuadro de Amortización
            </h2>
            <SimpleFormRow
              className='items-2'>
              <ToggleElement
                htmlFor='cap2toggle'
                handleOnChange={handleSub}>
                CAP
              </ToggleElement>
              <ToggleElement
                htmlFor='floor2toggle'
                handleOnChange={handleSub}>
                FLOOR
              </ToggleElement>
            </SimpleFormRow>
            <SimpleFormRow>
              <SelectElement
                htmlFor='Pagar'
                title='Recibir'>
                <option value='Pata1RecibirFixed'>Fijo</option>
                <option value='Pata1RecibirFloat'>Flotante</option>
              </SelectElement>
            </SimpleFormRow>
            <SimpleFormRow>
              <LabelElement
                htmlFor='notional_2'
                type='text'
                placeholder='Introduce nocional'>
                Nocional
              </LabelElement>
            </SimpleFormRow>
            <SimpleFormRow>
              <SelectElement
                htmlFor='Currency_2'
                title='Divisa'>
                <option value='EUR'>Euros</option>
                <option value='USD'>Dolares</option>
              </SelectElement>
            </SimpleFormRow>
            <SimpleFormRow>
              <LabelElement
                htmlFor='date_effective_2'
                type='date'>
                Fecha efectivo
              </LabelElement>
            </SimpleFormRow>
            <SimpleFormRow>
              <LabelElement
                htmlFor='date_expire_2'
                type='date'>
                Fecha vencimiento
              </LabelElement>
            </SimpleFormRow>
            <SimpleFormRow>
              <LabelElement
                htmlFor='interest_type_2'
                type='text'
                placeholder='Introduce sin %'>
                Tipo de interés
              </LabelElement>
            </SimpleFormRow>
            <SimpleFormRow>
              <SelectElement
                htmlFor='Payment_freq_2'
                title='Frecuencia de pago'>
                  <option value=''>Selecciona</option>
                  <option value='weekly'>Semanal</option>
                  <option value='biWeekly'>Cada 15 días</option>
                  <option value='monthly'>Mensual</option>
                  <option value='biMonth'>Bimensual</option>
                  <option value='quart'>Trimestral</option>
                  <option value='halfY'>Semestral</option>
                  <option value='yearly'>Anual</option>
              </SelectElement>
            </SimpleFormRow>
            <SimpleFormRow>
              <LabelElement
                htmlFor='base_2'
                type='text'
                placeholder='Introduce base'>
                Base
              </LabelElement>
            </SimpleFormRow>
            
            <div id='pata2cap' className='bi-u-inactive'>
              <TableHeaderSub>CAP</TableHeaderSub>
              <SimpleFormRow>
                <SelectElement
                  htmlFor='cap_2'
                  title='Tipo'>
                    <option value=''>Selecciona</option>
                    <option value='weekly'>Comprado</option>
                    <option value='biWeekly'>Vendido</option>
                </SelectElement>
              </SimpleFormRow>
              <SimpleFormRow>
                <LabelElement
                  htmlFor='cap_notional_2'
                  type='text'
                  placeholder='Introduce nocional'>
                  Nocional
                </LabelElement>
              </SimpleFormRow>
              <SimpleFormRow>
                <SelectElement
                  htmlFor='cap_currency_2'
                  title='Divisa'>
                  <option value='EUR'>Euros</option>
                  <option value='USD'>Dolares</option>
                </SelectElement>
              </SimpleFormRow>
              <SimpleFormRow>
                <LabelElement
                  htmlFor='cap_date_effective_2'
                  type='date'>
                  Fecha efectivo
                </LabelElement>
              </SimpleFormRow>
              <SimpleFormRow>
                <LabelElement
                  htmlFor='cap_date_expire_2'
                  type='date'>
                  Fecha vencimiento
                </LabelElement>
              </SimpleFormRow>
              <SimpleFormRow>
                <LabelElement
                  htmlFor='cap_index_2'
                  type='text'
                  placeholder='Introduce índice'>
                  Índice
                </LabelElement>
              </SimpleFormRow>
              <SimpleFormRow>
                <LabelElement
                  htmlFor='cap_strike_2'
                  type='text'
                  placeholder='Introduce strike'>
                  Strike
                </LabelElement>
              </SimpleFormRow>
              <SimpleFormRow>
                <LabelElement
                  htmlFor='cap_index_freq_2'
                  type='text'
                  placeholder='Introduce frecuencia índice'>
                  Frecuencia de índice
                </LabelElement>
              </SimpleFormRow>
              <SimpleFormRow>
                <SelectElement
                  htmlFor='cap_payment_freq_2'
                  title='Frecuencia de pago'>
                    <option value=''>Selecciona</option>
                    <option value='weekly'>Semanal</option>
                    <option value='biWeekly'>Cada 15 días</option>
                    <option value='monthly'>Mensual</option>
                    <option value='biMonth'>Bimensual</option>
                    <option value='quart'>Trimestral</option>
                    <option value='halfY'>Semestral</option>
                    <option value='yearly'>Anual</option>
                </SelectElement>
              </SimpleFormRow>
              <SimpleFormRow>
                <LabelElement
                  htmlFor='cap_base_2'
                  type='text'
                  placeholder='Introduce base'>
                  Base
                </LabelElement>
              </SimpleFormRow>
            </div>

            <div id='pata2floor' className='bi-u-inactive'>
              <TableHeaderSub>FLOOR</TableHeaderSub>
              <SimpleFormRow>
                <SelectElement
                  htmlFor='floor_2'
                  title='Tipo'>
                    <option value=''>Selecciona</option>
                    <option value='weekly'>Comprado</option>
                    <option value='biWeekly'>Vendido</option>
                </SelectElement>
              </SimpleFormRow>
              <SimpleFormRow>
                <LabelElement
                  htmlFor='floor_notional_2'
                  type='text'
                  placeholder='Introduce nocional'>
                  Nocional
                </LabelElement>
              </SimpleFormRow>
              <SimpleFormRow>
                <SelectElement
                  htmlFor='floor_currency_2'
                  title='Divisa'>
                  <option value='EUR'>Euros</option>
                  <option value='USD'>Dolares</option>
                </SelectElement>
              </SimpleFormRow>
              <SimpleFormRow>
                <LabelElement
                  htmlFor='floor_date_effective_2'
                  type='date'>
                  Fecha efectivo
                </LabelElement>
              </SimpleFormRow>
              <SimpleFormRow>
                <LabelElement
                  htmlFor='floor_date_expire_2'
                  type='date'>
                  Fecha vencimiento
                </LabelElement>
              </SimpleFormRow>
              <SimpleFormRow>
                <LabelElement
                  htmlFor='floor_index_2'
                  type='text'
                  placeholder='Introduce índice'>
                  Índice
                </LabelElement>
              </SimpleFormRow>
              <SimpleFormRow>
                <LabelElement
                  htmlFor='floor_strike_2'
                  type='text'
                  placeholder='Introduce strike'>
                  Strike
                </LabelElement>
              </SimpleFormRow>
              <SimpleFormRow>
                <LabelElement
                  htmlFor='floor_index_freq_2'
                  type='text'
                  placeholder='Introduce frecuencia índice'>
                  Frecuencia de índice
                </LabelElement>
              </SimpleFormRow>
              <SimpleFormRow>
                <SelectElement
                  htmlFor='floor_payment_freq_2'
                  title='Frecuencia de pago'>
                    <option value=''>Selecciona</option>
                    <option value='weekly'>Semanal</option>
                    <option value='biWeekly'>Cada 15 días</option>
                    <option value='monthly'>Mensual</option>
                    <option value='biMonth'>Bimensual</option>
                    <option value='quart'>Trimestral</option>
                    <option value='halfY'>Semestral</option>
                    <option value='yearly'>Anual</option>
                </SelectElement>
              </SimpleFormRow>
              <SimpleFormRow>
                <LabelElement
                  htmlFor='floor_base_2'
                  type='text'
                  placeholder='Introduce base'>
                  Base
                </LabelElement>
              </SimpleFormRow>
            </div>

          </SimpleCol>       
        </ColsContainer>
        <ColsContainer>
        <TableHeader 
          style={{'flexGrow':1}}
          className='bi-u-border-bb-gm bi-u-border-bt-gm bi-u-spacer-pt-enormous'>
        <MainHeading>
          Alta instrumento cobertura
          </MainHeading>
        </TableHeader>
        </ColsContainer>
        <SectionHalf>
          <SimpleFormRow>
          <SelectElement
              htmlFor='item_instrument'
              title='Selecciona instrumento'>
                <option value=''>Selecciona</option>
                <option value='AA'>AA</option>
                <option value='BB'>BB</option>
                <option value='CC'>CC</option>
            </SelectElement>
          </SimpleFormRow>
          <SimpleFormRow>
            <SelectElement
              htmlFor='item_hedge'
              title='Instrumento cobertura'>
                <option value=''>Selecciona</option>
                <option value='AA'>AA</option>
                <option value='BB'>BB</option>
                <option value='CC'>CC</option>
            </SelectElement>
          </SimpleFormRow>
          <SimpleFormRow>
            <SelectElement
              htmlFor='item_financing'
              title='Tipo financiación'
              value='Fijo'
              handleOnChange={handleFinancingType}
              >
                <option value=''>Selecciona</option>
                <option value='Fijo'>Fijo</option>
                <option value='Variable'>Variable</option>
            </SelectElement>
          </SimpleFormRow>
          <SimpleFormRow>
            <LabelElement
              htmlFor='item_notional'
              type='text'
              placeholder='Introduce nocional' >
              Nocional
            </LabelElement>
          </SimpleFormRow>
          <SimpleFormRow>
            <SelectElement
              htmlFor='item_currency'
              title='Divisa'>
              <option value='EUR'>Euros</option>
              <option value='USD'>Dolares</option>
            </SelectElement>
          </SimpleFormRow>
          <SimpleFormRow>
            <LabelElement
              htmlFor='item_date_effective'
              type='date'>
              Fecha efectivo
            </LabelElement>
          </SimpleFormRow>
          <SimpleFormRow>
            <LabelElement
              htmlFor='item_date_expire'
              type='date'>
              Fecha vencimiento
            </LabelElement>
          </SimpleFormRow>
          <SimpleFormRow>
            {renderView()}
          </SimpleFormRow>
          <SimpleFormRow>
            <LabelElement
              htmlFor='item_spread'
              type='text'
              placeholder='Introduce spread'>
              Spread
            </LabelElement>
          </SimpleFormRow>
          <SimpleFormRow>
                <LabelElement
                  htmlFor='item_index_freq'
                  type='text'
                  placeholder='Introduce frecuencia índice'>
                  Frecuencia de índice
                </LabelElement>
              </SimpleFormRow>
              <SimpleFormRow>
                <SelectElement
                  htmlFor='item_payment_freq'
                  title='Frecuencia de pago'>
                    <option value=''>Selecciona</option>
                    <option value='Weekly'>Semanal</option>
                    <option value='BiWeekly'>Cada 15 días</option>
                    <option value='Monthly'>Mensual</option>
                    <option value='BiMonth'>Bimensual</option>
                    <option value='Quarterly'>Trimestral</option>
                    <option value='HalfY'>Semestral</option>
                    <option value='Yearly'>Anual</option>
                </SelectElement>
              </SimpleFormRow>
              <SimpleFormRow>
                <LabelElement
                  htmlFor='item_base'
                  type='text'
                  placeholder='Introduce base'>
                  Base
                </LabelElement>
              </SimpleFormRow>
        </SectionHalf>
        <ColsContainer>
          {hedgeError && 
            <SimpleFormRow className='bi-u-centerText' >
              <span className='error'>{hedgeError}</span>
            </SimpleFormRow>}
            <SimpleFormRow
              style={{'flexGrow':1}}   
              className='bi-u-centerText bi-u-border-bb-gm bi-u-border-bt-gm'>
                <ButtonLGhost
                  className='bi-o-button--short'
                  handleClick={HandleCancel}
                  >
                    Cancelar
                </ButtonLGhost>
                <ButtonLPrimary
                  className='bi-o-button--short'
                  type='submit'
                  handleClick={handleNewHedge}
                  >
                    Guardar
                </ButtonLPrimary>
            </SimpleFormRow>     
        </ColsContainer>
      </SimpleFormHrz>
    </main>
  );
}

export default NewHedge;