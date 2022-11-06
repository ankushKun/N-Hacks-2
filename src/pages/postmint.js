import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import axios from "axios";
import { useEffect, useState, useRef } from 'react';
import Deso from 'deso-protocol';

export default function Home() {
  const [imgUrl, setImgUrl] = useState();
  const [pHash, setPHash] = useState();
  const [status, setStatus] = useState("");

  async function login() {
    const deso = new Deso();
    const request = 3;
    const response = await deso.identity.login(request);
    console.log(response);
  }

  async function uploadImg(img) {
    console.log("upload called", img);
    // setStatus("upload clicked")
    const deso = new Deso();
    const request = {
      "UserPublicKeyBase58Check": localStorage.getItem("deso_user_key"),
      "file": img,
      "jwt": await deso.identity.getJwt(undefined)
    };
    const response = await deso.media.uploadImage(request);
    console.log(response.ImageURL);
    setImgUrl(response.ImageURL);
    setStatus("uploaded");
  }

  async function makePost() {
    const deso = new Deso();
    const request = {
      "UpdaterPublicKeyBase58Check": localStorage.getItem("deso_user_key"),
      "BodyObj": {
        "Body": "img upload test from next",
        "VideoURLs": [],
        "ImageURLs": [imgUrl]
      }
    };
    const response = await deso.posts.submitPost(request);
    console.log(response);
    setPHash(response.submittedTransactionResponse.TxnHashHex);
    setStatus("Posted");
  }

  const hiddenFileInput = useRef(null);

  const handleChange = async (event) => {

    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      console.log("uploading")
      setStatus("Uploading...")
      await uploadImg(i);

    }
  };

  async function mintPost() {
    const deso = new Deso();
    const request = {
      "UpdaterPublicKeyBase58Check": localStorage.getItem("deso_user_key"),
      "NFTPostHashHex": pHash,
      "NumCopies": 1,
      "NFTRoyaltyToCreatorBasisPoints": 100,
      "NFTRoyaltyToCoinBasisPoints": 100,
      "HasUnlockable": false,
      "IsForSale": false,
      "MinFeeRateNanosPerKB": 1000
    };
    const response = await deso.nft.createNft(request);
    console.log(response);
    setStatus("NFT minted");
  }


  return (
    <div>
      <button onClick={login}>login</button>
      <br />
      <input type="file" ref={hiddenFileInput} onChange={handleChange} accept="image/*" />
      <br />
      {status}
      <br />
      <button onClick={makePost}>post</button>
      <br />
      <button onClick={mintPost}>mint</button>
    </div>
  )
}
