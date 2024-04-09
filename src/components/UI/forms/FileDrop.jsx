import { useState } from "react";
import { useDropzone } from "react-dropzone";

export const FileDrop = ({deferredFlowFile,setDeferredFlowFile,deferredFlowInfo,setDeferredFlowInfo,htmlFor,accept,placeholder, className, style, children, required}) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFile) => {
      setDeferredFlowFile(acceptedFile);
    },
  });

  return (
    <label
      htmlFor={htmlFor}
      style={style}>
        <span>{children}</span>
      <div
        {...getRootProps()} 
        className='bi-c-uploadfield-icon'
        onClick={(e)=>e.stopPropagation()}>
      <input
          {...getInputProps()}
          className={`bi-c-uploadfield-icon__input ${className}`} 
          type="file" 
          name={htmlFor}
          id={htmlFor}
          accept={accept}
          required={required}
        />
        <span
            id={`${htmlFor}Placeholder`}
            className='placeholder'>
              {placeholder}
          </span>
      </div>
        
    </label>
  );
}