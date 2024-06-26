import { useEffect,useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import Api from '../../services/api';
import Papa from 'papaparse';
import { TableHeader } from '../../components/UI/tables/TableHeaders';
import { MainHeading } from '../../components/UI/headings';
import { SectionHalf } from '../../components/UI/layout/LayoutSections';
import { ButtonLGhost, ButtonLPrimary } from '../../components/UI/buttons/Buttons';
import { SimpleFormHrz, SimpleFormRow } from '../../components/UI/forms/SimpleForms';
import { EfficacyTestFileDrop } from '../../components/UI/forms/EfficacyTestFileDrop';

function EfficacyTest({ efficacyTestFile,setEfficacyTestFile,efficacyTestInfo,setEfficacyTestInfo }){
  const navigate = useNavigate();
  const [uploadedFileName, setUploadedFileName] = useState(null);

  const accountInLocalStorage = localStorage.getItem('account');
  const parsedAccount = JSON.parse(accountInLocalStorage);
  const token = parsedAccount.token;
  const headers = {
    'Content-Type': 'application/json',
    'x-access-token': token,
  }

  //resetear nombre del archivo cuando cambiamos de pagina
  useState(()=>{
    setUploadedFileName(null);
    console.log('uploadedFileName',uploadedFileName)
  },[])
  

  //mirar cuando cambia deferrefFlowFile para parsearlo y guardarlo
  useEffect(()=>{
    if (efficacyTestFile) {
      setUploadedFileName(efficacyTestFile[0]?.name);
      Papa.parse(efficacyTestFile[0], {
        complete: function(results) {
          const deferredFile = [];
          for (let i=1; i<results.data.length; i++) {
            const deferredObj = {};
            for (let j=0; j<results.data[i].length; j++) {
              const number = j+1;
              //const propertyName = 'col'+number.toString();
              let propertyName = '';

              if (j==1){
                propertyName = 'hedge_file';
              }
              else if (j==2){
                propertyName = 'hedge_relationship';
              }
              else if (j==3){
                propertyName = 'date';
              }
              else if (j==4){
                propertyName = 'pct';
              }

              deferredObj[propertyName] = results.data[i];
            }
            deferredFile.push(deferredObj);
          }
          setEfficacyTestInfo(deferredFile);     
        }
      });
    }
  },[efficacyTestFile])


  //manejar subir archivo test
  const handleSendEfficacyTest = (e) => {
    e.preventDefault();  
    setUploadedFileName(null);
    const dataSent = {
      "data": efficacyTestInfo,
    }
    console.log(dataSent);  
    Api.call.post('hedges/efficacytest',dataSent,{ headers:headers })
    .then(res => {
      navigate('/hedges');
    }).catch(err => {
      console.warn(err)})
  }

  //manejar boton cancelar
  const handleCancel = (e) => {
    e.preventDefault();
    navigate('/hedges');
  }

  //renderizar allowed
  const renderAllowed = () => {
    if (parsedAccount.permission == 3) {
      return <Navigate to="/hedges" replace={true}/>
    }
  }

  return (
    <main className="bi-u-h-screen--wSubNav">
      {renderAllowed()}
      <TableHeader>
        <MainHeading>
          Test de Eficacia
        </MainHeading>
        <div className='bi-c-form-simple'>            
          <Link className='bi-c-navbar-links__textbutt' to='/csv_templates/test_eficacia.csv' target="_blank" download >Descargar plantilla</Link>
        </div>
      </TableHeader>
      <SectionHalf>
        <SimpleFormHrz>
          <SimpleFormRow>
            <EfficacyTestFileDrop
              style={{padding:'0 12px'}}
              htmlFor='efficacyTestFileField'
              placeholder='Seleccionar/arrastrar CSV'
              accept='.csv'
              efficacyTestFile={efficacyTestFile}
              setEfficacyTestFile={setEfficacyTestFile} >
              Test de eficacia
            </EfficacyTestFileDrop>            
          </SimpleFormRow>
          <SimpleFormRow className='bi-u-centerText' >
            <ButtonLGhost 
              className='bi-o-button--short'
              handleClick={handleCancel}>Cancelar</ButtonLGhost>
            <ButtonLPrimary 
              className='bi-o-button--short'
              handleClick={handleSendEfficacyTest}>Enviar</ButtonLPrimary>
          </SimpleFormRow>
        </SimpleFormHrz>
      </SectionHalf>
      
            
        
    </main>
  );
}

export default EfficacyTest;