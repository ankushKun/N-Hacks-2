import { useEffect, useState, useContext } from "react";
import Navbar from "../components/navbar";
import { useRouter } from "next/router";
import axios from "axios";
import Loader from "../../utils/Loader";
import DarkModeContext from "../../Context/DarkModeContext";
import Deso from "deso-protocol";

function timeDifference(previous) {
    var current = Date.now();
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;
    var elapsed = current - previous;
    if (elapsed < msPerMinute) {
        return Math.round(elapsed / 1000) + " seconds ago";
    } else if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + " minutes ago";
    } else if (elapsed < msPerDay) {
        return Math.round(elapsed / msPerHour) + " hours ago";
    } else if (elapsed < msPerMonth) {
        return Math.round(elapsed / msPerDay) + " days ago";
    } else if (elapsed < msPerYear) {
        return Math.round(elapsed / msPerMonth) + " months ago";
    } else {
        return Math.round(elapsed / msPerYear) + " years ago";
    }
}

const Card = ({ post, isDark }) => {
    const router = useRouter();
    const url = `/post/${post.key}`;
    return (
        <div
            className={`${isDark ? "darkForm" : "bg-white"
                } my-4 md:w-1/2 lg:w-1/3 mx-4 rounded-md overflow-hidden shadow-lg text-black cursor-pointer hover:scale-105 duration-75`}
            onClick={() => {
                router.push(url);
            }}>
            <img
                className='shadow-lg rounded-t-md cursor-pointer '
                src={post.value.thumbnail_url}
                alt={post.value.title}
            />
            <div className='px-6 py-4'>
                <div className='font-bold text-xl drop-shadow-md'>
                    {post.value.title}
                </div>
                <p
                    className={`${isDark ? "leastLightText" : "text-gray-400"
                        } text-base`}>
                    {/* {post.ipfs_content.substring(0, 20)} */}
                    {timeDifference(Date.parse(post.value.timestamp))}
                </p>
            </div>
        </div>
    );
};

export default function Posts() {
    const contextValue = useContext(DarkModeContext);
    const [responseList, setResponseList] = useState([]);
    const [errorHappened, setErrorHappened] = useState(false);
    useEffect(() => {
        async function getPosts() {
            // try {
            //     const posts = await axios.get(
            //         `https://api.jakartanet.tzkt.io/v1/contracts/${config.CONTRACT_ADDRESS}/bigmaps/posts/keys`
            //     );
            //     if (posts.data) {
            //         setResponseList(posts.data);
            //     } else {
            //         setErrorHappened(true);
            //         window.location.reload();
            //     }
            // } catch (e) {
            //     setErrorHappened(true);
            //     window.location.reload();
            // }
            const deso = new Deso();
            try {
                const request = {
                    "PublicKeyBase58Check": "BC1YLiDshiKuTojmb5AWWGTYLhBvJ7mp2VEr5NouZE9hBUzbkbED8rm",
                    "ReaderPublicKeyBase58Check": "BC1YLiDshiKuTojmb5AWWGTYLhBvJ7mp2VEr5NouZE9hBUzbkbED8rm",
                    "NumToFetch": 15
                };
                const response = await deso.posts.getPostsForPublicKey(request);
            } catch {

            }
        }
        getPosts();
    }, []);

    return (
        <div
            className={`${contextValue.isDark ? "darkBg" : ""
                } leading-normal tracking-normal min-h-screen`}>
            <Navbar title='Vyapaar Link' gradient={true} />

            <div>
                <div className={`${contextValue.isDark ? "darkBg" : ""} pt-24 pb-10`}>

                    {responseList.length > 0 ? (
                        <div>
                            <p
                                className={`${contextValue.isDark ? "lightText" : "textDark"
                                    } text-3xl text-center my-3`}>
                                Trending Blogs
                            </p>
                            <div className='flex flex-wrap mx-auto  justify-center '>
                                {/*  We gotta add infinite scrollbar too. and idk how to the api response work. lmk and i add fix that    */}

                                {responseList.map((post, index) => {
                                    return (
                                        <Card key={index} post={post} isDark={contextValue.isDark} />
                                    );
                                })}
                            </div>
                        </div>
                    ) : errorHappened ? (
                        <p
                            className={`${contextValue.isDark ? "text-white" : "text-dark"
                                } text-xl text-center pt-10`}>
                            Error while loading post. Retrying...
                        </p>
                    ) : (
                        <div className='flex justify-center my-4'>
                            <Loader />{" "}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}