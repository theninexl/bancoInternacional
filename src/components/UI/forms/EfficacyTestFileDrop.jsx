import { useState } from "react";
import { useDropzone } from "react-dropzone";

export const EfficacyTestFileDrop = ({setEfficacyTestFile,htmlFor,accept,placeholder, className, style, children}) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFile) => {
      setEfficacyTestFile(acceptedFile);
    },
  });

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
              {placeholder}
          </span>
      </div>
        
    </label>
  );
}