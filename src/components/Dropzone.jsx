import "./Dropzone.css";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Swal from "sweetalert2";
import { close } from "../assets";

function Dropzone({ handleUpdate, data, alowFileSelection }) {
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    if (acceptedFiles?.length > 0) handleUpdate(acceptedFiles[0]);
  }, []);
  const handleValidatoin = (file) => {
    if (!alowFileSelection) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please login to upload file",
      });
      return {
        message: `Please login to upload file`,
      };
    }
    if (file.type !== "text/html") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Only html file type accepted",
      });
      return {
        message: `Only html file type accepted`,
      };
    }
    return null;
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxFiles: 1,
    validator: handleValidatoin,
    noClick: data,
  });

  return (
    <div
      {...getRootProps()}
      className="dropzone-container bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none font-medium"
    >
      {data ? (
        <div className="flex flex-row justify-center items-center">
          <div>{data?.name}</div>
          <div>
            <img
              src={close}
              alt="logo"
              className="w-4 h-4 ml-4 object-contain cursor-pointer"
              onClick={() => {
                handleUpdate(null);
              }}
            />
          </div>
        </div>
      ) : (
        <>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop one html file here, or click to select file</p>
          )}
        </>
      )}
    </div>
  );
}

export default Dropzone;
