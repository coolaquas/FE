import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { loader } from "../assets";

import { EarthCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";
import Dropzone from "./Dropzone";
import Swal from "sweetalert2";
const Demo = () => {
  const [accountAddress, setaccountAddress] = useState("");
  const [loading, setLoading] = useState(null);
  const [file, setFile] = useState(null);
  const handleLogin = () => {
    setLoading("login");
    if (window.ethereum) {
      window.ethereum.request({ method: "eth_requestAccounts" }).then((res) => {
        setaccountAddress(res[0]);
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "install metamask extension",
      });
    }
    setLoading(null);
  };
  const handleUpload = async () => {
    setLoading("upload");
    if (!accountAddress || !file) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: !accountAddress
          ? "Please login to upload file"
          : "Please select file to upload",
      });
      setLoading(null);
    }
    const content = await getBase64(file);
    const payload = {
      address: accountAddress,
      content: content,
    };
    let config = {
      method: "post",
      url: "https://web-hosting-be.onrender.com/ipfs",
      headers: {
        "Content-Type": "application/json",
      },
      data: payload,
    };

    axios(config)
      .then((response) => {
        setLoading(null);
        Swal.fire({
          icon: "success",
          text: response?.data?.message,
          confirmButtonText: "Continue",
        }).then((result) => {
          if (result.isConfirmed) {
            setFile(null);
            window?.open(response?.data?.cid);
          }
        });
      })
      .catch((error) => {
        setLoading(null);
        const message =
          error?.response?.data?.error ||
          "Something went wrong, Please try again later.";
        console.log(message);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: message,
        });
      });
  };
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  return (
    <div
      className={`xl:mt-12 flex xl:flex-row flex-col-reverse gap-10 overflow-hidden`}
    >
      <motion.div
        variants={slideIn("left", "tween", 0.2, 1)}
        className="flex-[0.75] bg-black-100 p-8 rounded-2xl"
      >
        <button
          disabled={loading}
          onClick={handleLogin}
          className={`${
            accountAddress ? "bg-tertiary" : "bg-cyan-500"
          } mb-5 py-3 px-8 rounded-xl outline-none w-full text-white font-bold shadow-md shadow-primary`}
        >
          {loading === "login" ? (
            <img src={loader} alt="logo" className="w-6 h-6 mx-auto" />
          ) : accountAddress ? (
            `Account :
            ${
              accountAddress.slice(0, 6) +
              "......." +
              accountAddress.substring(accountAddress.length - 6)
            }`
          ) : (
            "Login"
          )}
        </button>
        <label className="flex flex-col">
          <Dropzone
            data={file}
            handleUpdate={(data) => setFile(data)}
            alowFileSelection={!!accountAddress}
          />
        </label>
        <button
          disabled={loading}
          onClick={handleUpload}
          className="bg-tertiary mt-5 py-3 px-8 rounded-xl outline-none w-full text-white font-bold shadow-md shadow-primary"
        >
          {loading === "upload" ? (
            <img src={loader} alt="logo" className="w-6 h-6 mx-auto" />
          ) : (
            <span>Upload</span>
          )}
        </button>
      </motion.div>

      <motion.div
        variants={slideIn("right", "tween", 0.2, 1)}
        className="xl:flex-1 xl:h-auto md:h-[550px] h-[350px]"
      >
        <EarthCanvas />
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Demo, "demo");
