import React, { useRef } from "react";

const TopBtnBar = ({
    setTagModalVisible,
    publishHandler,
    coverImgHandler,
    isPosting,
    buttonName
}) => {
    const coverImgInput = useRef();

    return (
        <div className='flex justify-between'>
            <div className='flex gap-4'>
                <button
                    className='p-2 text-white bg-[#f170b7] hover:bg-[#a64379] focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2  focus:outline-none dark:focus:ring-[#e2469c]'
                    onClick={() => coverImgInput.current.click()}>
                    <i className='far fa-image'></i> Set Cover
                    <input
                        type='file'
                        id='coverImgInput'
                        accept='image/png, image/jpeg'
                        onChange={coverImgHandler}
                        className='hidden'
                        ref={coverImgInput}
                    />
                </button>
                {/* <button
                    className='p-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
                    onClick={(e) => setTagModalVisible(true)}>
                    <i className='fas fa-hashtag'></i> Add Tags
                </button> */}
            </div>
            <div className='btns-left'>
                <button
                    className={`p-2 text-[#f170b7] hover:text-white border border-[#f170b7] hover:bg-[#f170b7] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2`}
                    onClick={publishHandler}>
                    {isPosting ? buttonName ? "Updating" : "Publishing.." : buttonName ? "Update" : "Publish"}
                </button>
            </div>
        </div>
    );
};

export default TopBtnBar;
