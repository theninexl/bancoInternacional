import { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [uploadedFileName, setUploadedFileName] = useState();

  const accountInLocalStorage = localStorage.getItem('account');
  const parsedAccount = JSON.parse(accountInLocalStorage);
  const token = parsedAccount.token;
  const headers = {
    'Content-Type': 'application/json',
    'x-access-token': token,
  }
  

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
              const propertyName = 'col'+number.toString();
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
    console.log(efficacyTestInfo);
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

  return (
    <main className="bi-u-h-screen--wSubNav">
      <TableHeader>
        <MainHeading>
          Test de Eficacia
        </MainHeading>
      </TableHeader>
      <SectionHalf>
        <SimpleFormHrz>
          <SimpleFormRow>
            <EfficacyTestFileDrop
              style={{padding:'0 12px'}}
              htmlFor='efficacyTestFileField'
              placeholder={uploadedFileName ? uploadedFileName : 'Seleccionar/arrastrar CSV'}
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