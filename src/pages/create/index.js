import { useState, useRef, useContext } from "react";
// import { connectWallet, getPKH, createPost } from "../../utils/wallet";
import TopBtnBar from "./TopBtnBar";
import TextEditor from "./TextEditor";
// import { uploadToIpfs, uploadToIpfsFromUrl } from "../../utils/ipfs";
import Navbar from "../components/navbar";
import Image from "next/image";
import DarkModeContext from "../../Context/DarkModeContext";
import Deso from "deso-protocol";


export default function Create() {
  // const [walletAddress, setWalletAddress] = useState();
  const contextValue = useContext(DarkModeContext);
  // const btnConnect = async () => {
  //   const w = await connectWallet();
  //   const addr = await getPKH();
  //   setWalletAddress(addr);
  // };

  const [titleText, setTitleText] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [tagModalVisible, setTagModalVisible] = useState(false);
  const [postCover, setPostCover] = useState("");
  const [postTags, setPostTags] = useState([]);
  const [loggedInPublicKey, setLoggedInPublicKey] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const [coverImageURL, setCoverImageURL] = useState("");

  // const [priceTez, setPriceTez] = useState();
  // const [royalty, setRoyalty] = useState();
  // const [copies, setCopies] = useState();
  // const [sellPost, setSellPost] = useState(true);
  // const [fundraisingAmt, setFundraisingAmt] = useState();

  const tagInput = useRef();

  // Event Listeners
  const onCoverInputChange = async (e) => {
    if (!localStorage.getItem("deso_user_key")) {
      var deso = new Deso();
      const request = 3;
      const response = await deso.identity.login(request);
      console.log(response);
    }

    const img = e.target.files[0];
    console.log("upload called", img);
    // setStatus("upload clicked")
    var deso = new Deso();
    const request = {
      "UserPublicKeyBase58Check": localStorage.getItem("deso_user_key"),
      "file": img,
      "jwt": await deso.identity.getJwt(undefined)
    };
    const response = await deso.media.uploadImage(request);
    console.log(response.ImageURL);

    setPostCover(response.ImageURL);
    // let rawImage = e.target.files[0];
    // if (!rawImage) {
    //   setPostCover(null);
    // }
    // let url = URL.createObjectURL(rawImage);
    // const thumb = await uploadToIpfsFromUrl(url);

    // setPostCover(thumb);
    // e.target.value = "";
  };

  // const onTagInputChange = (e) => {
  //   const text = e.target.value;

  //   if (text[text.length - 1] === " ") {
  //     let newTag = text.split(" ")[0];
  //     setPostTags([...postTags, newTag]);
  //     if (postTags.length + 1 >= 5) {
  //       tagInput.current.readOnly = true;
  //     }
  //     console.log(postTags.length);
  //     e.target.value = "";
  //   }
  // };

  // const onInputKeyDown = (e) => {
  //   // Remove Tags
  //   if (postTags.length <= 0) return;
  //   if (e.code === "Backspace" && e.target.value === "") {
  //     let newTags = [...postTags];
  //     newTags.splice(newTags.length - 1, 1);
  //     setPostTags(newTags);
  //     if (newTags.length <= 5) {
  //       tagInput.current.readOnly = false;
  //     }
  //   }
  // };

  const onPublishBtnClicked = async (e) => {
    // Publish

    // checks before publishing
    if (bodyText.length <= 10) {
      alert("Content should be atleast 10 characters long");
      return;
    }
    if (titleText.length <= 3) {
      alert("Title should be atleast 3 characters long");
      return;
    }
    if (!postCover) {
      alert("You must set a post cover");
      return;
    }

    if (!localStorage.getItem("deso_user_key")) {
      var deso = new Deso();
      const request = 3;
      const response = await deso.identity.login(request);
      console.log(response);
    }

    const body = "# " + titleText + "\n" + bodyText;

    console.log(postCover, body);

    var deso = new Deso();
    var request = {
      "UpdaterPublicKeyBase58Check": localStorage.getItem("deso_user_key"),
      "BodyObj": {
        "Body": body,
        "VideoURLs": [],
        "ImageURLs": [postCover]
      }
    };
    var response = await deso.posts.submitPost(request);
    console.log(response);
    const hash = response.submittedTransactionResponse.TxnHashHex;
    console.log(hash);

    alert("Posted at https://diamondapp.com/posts/" + hash);

    var deso = new Deso();
    var request = {
      "UpdaterPublicKeyBase58Check": localStorage.getItem("deso_user_key"),
      "NFTPostHashHex": hash,
      "NumCopies": 10,
      "NFTRoyaltyToCreatorBasisPoints": 100,
      "NFTRoyaltyToCoinBasisPoints": 100,
      "HasUnlockable": false,
      "IsForSale": false,
      "MinFeeRateNanosPerKB": 1000
    };
    var response = await deso.nft.createNft(request);
    console.log(response);

    alert("Your post has been minted as an NFT");

    // const postResponse = await createPost({
    //   // royalty: royalty,
    //   // sell: sellPost,
    //   // price_mutez: priceTez,
    //   // copies: copies,
    //   ipfs_url: ipfs_url,
    //   title: titleText,
    //   thumbnail_url: postCover,
    //   frGoal: fundraisingAmt,
    // });

    // console.log(postResponse)
  };

  // Utilities
  const uploadImg = async (img) => {
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
    return response.ImageURL;
  };

  return (
    <div className={`${contextValue.isDark ? "darkBg" : "bg-white"}` + " min-h-screen"}>
      <Navbar title='Writez' />
      {/* <button onClick={btnConnect}>connect</button>
            <p>{walletAddress ? walletAddress : "Not Logged in"}</p> */}

      <div className={`flex ${contextValue.isDark ? "darkBg" : "bg-white"}`}>
        <div
          className={`${contextValue.isDark ? "darkBg" : "bg-white"
            } mt-24 w-screen md:w-4/5 m-auto px-2 md:px-8 mb-6`}>
          <TopBtnBar
            setTagModalVisible={setTagModalVisible}
            publishHandler={onPublishBtnClicked}
            isPosting={isPosting}
            coverImgHandler={onCoverInputChange}
          />

          {/* Cover Image Preview */}

          <div
            className={`cover-preview bg-center rounded-lg bg-no-repeat w-2/3 mx-auto h-96 bg-cover relative  ${!postCover && "hidden"
              }`}
            style={{ backgroundImage: `url(${postCover})` }}>
            <div className='cover-toolkit absolute top-0 right-0 m-5 flex items-center'>
              <button
                className='px-4 py-2 bg-red-600 text-white opacity-75 hover:opacity-100 duration-300 rounded-lg'
                onClick={() => setPostCover(null)}>
                <i className='fal fa-close'></i>
              </button>
            </div>
          </div>

          <TextEditor
            titleText={titleText}
            bodyText={bodyText}
            setTitleText={setTitleText}
            setBodyText={setBodyText}
            uploadImage={uploadImg}
          />

          {/* <form>
            <div className='mb-10 mt-10'>
              <label
                className={`${contextValue.isDark ? "lightText" : "darkText"
                  } inline-block mb-2 text-sm font-medium `}>
                Fundraising Goal{" "}
                <Image
                  src={tezIcon}
                  width={15}
                  height={15}
                  className='inline-block'
                />{" "}
                (optional)
              </label>
              <input
                type='number'
                min={0}
                className={`${contextValue.isDark ? "darkForm" : "lightForm"}  text-sm rounded-lg  block w-full p-2.5 mb-96`}
                placeholder='e.g 100Tez'
                onChange={(e) => {
                  setFundraisingAmt(Math.abs(e.target.value * 1e6));
                }}
                onKeyUp={(e) => {
                  e.target.value = Math.abs(e.target.value);
                }}
              />
            </div>
          </form> */}
        </div>
      </div>
    </div>
  );
}
