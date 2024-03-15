import { useEffect,useState } from 'react';
import { useDropzone } from "react-dropzone";

export const EfficacyTestFileDrop = ({setEfficacyTestFile,htmlFor,accept,placeholder, className, style, children}) => {
  
  const [upfilename, setUpfilename] = useState(null);
  
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFile) => {
      setEfficacyTestFile(acceptedFile);
      setUpfilename(acceptedFile[0].name);
    },
  });

  useEffect(()=>{
    setUpfilename(null)
  },[])


  return (
    <label
      htmlFor={htmlFor}
      style={style}>
        <span>{children}</span>
      <div
        {...getRootProps()} 
        className='bi-c-uploadfield-icon'>
      <input
          {...getInputProps()}
          className={`bi-c-uploadfield-icon__input ${className}`} 
          type="file" 
          name={htmlFor}
          id={htmlFor}
          accept={accept}
        />
        <span
            id={`${htmlFor}Placeholder`}
            className='placeholder'>
              {upfilename ? upfilename : placeholder}
          </span>
      </div>
        
    </label>
  );
}