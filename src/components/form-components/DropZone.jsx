import React from 'react';
import { useDropzone } from 'react-dropzone';

const DropZone = ({ children, handleChange, multiple = true, accept, ...props }) => {
    const onDrop = acceptedFiles => {
        if (handleChange) {
            handleChange(acceptedFiles);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple,
        accept,
        ...props
    });

    return (
        <div
            {...getRootProps({
                className: 'dropzone dropzone-default dropzone-primary dz-clickable col-md-10'
            })}
        >
            <input {...getInputProps()} />
            {children}
        </div>
    );
};

export default DropZone;
