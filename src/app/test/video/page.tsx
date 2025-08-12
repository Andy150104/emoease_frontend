import VideoPlayer from "EmoEase/components/Video/VideoPlayer";

export default function VideoPage() {
  const hlsUrl =
    // "https://res.cloudinary.com/dbfokyruf/video/upload/sp_auto:maxres_2160p/v1754870027/Hc-lp-trnh-NET---phn-1---Ci-t-Visual-Studio-v-vit-chng-trnh-NET-u-tin.m3u8";

    // "https://res.cloudinary.com/dbfokyruf/video/upload/sp_auto:maxres_2160p/v1754879599/Hc-lp-trnh-NET---phn-1---Ci-t-Visual-Studio-v-vit-chng-trnh-NET-u-tin-1.m3u8";
    // "https://res.cloudinary.com/dbfokyruf/video/upload/sp_auto/v1754883646/Kinh-nghim-phng-vn-backend-NET-C-2-nm-kinh-nghim.m3u8";
    // "https://cdn.bitmovin.com/content/assets/sintel/hls/playlist.m3u8";
    "https://res.cloudinary.com/dbfokyruf/video/upload/sp_auto:maxres_2160p/v1754913618/Kinh-nghim-phng-vn-backend-NET-C-2-nm-kinh-nghim.m3u8";
  const vttUrl =
    "https://res.cloudinary.com/dbfokyruf/raw/upload/v1754913621/Kinh-nghim-phng-vn-backend-NET-C-2-nm-kinh-nghim.vi-VN.vtt";

  return (
    <main className="p-5">
      <h1 className="mb-5 text-xl font-semibold">Xem Video Ngrok 1</h1>
      <VideoPlayer 
      src={hlsUrl}
      // poster="https://media.istockphoto.com/id/2150399781/vi/anh/m%E1%BB%99t-c%C3%A1nh-%C4%91%E1%BB%93ng-n%C3%B4ng-nghi%E1%BB%87p-r%E1%BB%99ng-l%E1%BB%9Bn-v%E1%BB%9Bi-nh%E1%BB%AFng-c%C3%A2y-ng%C3%B4-tr%E1%BB%93ng-ng%C3%B4-%E1%BB%9F-quy-m%C3%B4-c%C3%B4ng-nghi%E1%BB%87p-c%E1%BA%A3nh-quan.jpg?s=2048x2048&w=is&k=20&c=IX8bx3uLJS71IP7WHB3mvlj7pKJrx5T-YG6_pCXNrko="
      urlVtt={vttUrl}/>
    </main>
  );
}
