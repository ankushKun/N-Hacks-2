// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Deso from "deso-protocol";

export default function Nft(req, res) {
  const deso = new Deso();
  const request = {
    "UpdaterPublicKeyBase58Check": null,
    "BodyObj": {
      "Body": "Checking out the developer hub",
      "VideoURLs": [],
      "ImageURLs": []
    }
  };
  const response = deso.posts.submitPost(request);
  response.then(() => {
    res.status(200).json("OK");
  })
}
