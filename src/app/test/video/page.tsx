import VideoPlayer from "EmoEase/components/Video/VideoPlayer";

export default function VideoPage() {
  // const hlsUrl =
  //   // "https://res.cloudinary.com/dbfokyruf/video/upload/sp_auto:maxres_2160p/v1754870027/Hc-lp-trnh-NET---phn-1---Ci-t-Visual-Studio-v-vit-chng-trnh-NET-u-tin.m3u8";

  //   // "https://res.cloudinary.com/dbfokyruf/video/upload/sp_auto:maxres_2160p/v1754879599/Hc-lp-trnh-NET---phn-1---Ci-t-Visual-Studio-v-vit-chng-trnh-NET-u-tin-1.m3u8";
  //   // "https://res.cloudinary.com/dbfokyruf/video/upload/sp_auto/v1754883646/Kinh-nghim-phng-vn-backend-NET-C-2-nm-kinh-nghim.m3u8";
  //   // "https://cdn.bitmovin.com/content/assets/sintel/hls/playlist.m3u8";
  //   "https://res.cloudinary.com/dbfokyruf/video/upload/sp_auto:maxres_2160p/v1754913618/Kinh-nghim-phng-vn-backend-NET-C-2-nm-kinh-nghim.m3u8";

  return (
    <main className="p-5">
      <h1 className="mb-5 text-xl font-semibold">Xem Video</h1>
      <VideoPlayer src="https://res.cloudinary.com/dbfokyruf/video/upload/sp_auto:maxres_2160p/v1754913618/Kinh-nghim-phng-vn-backend-NET-C-2-nm-kinh-nghim.m3u8"
      urlVtt="https://res.cloudinary.com/dbfokyruf/raw/upload/v1754913621/Kinh-nghim-phng-vn-backend-NET-C-2-nm-kinh-nghim.vi-VN.vtt"/>
    </main>
  );
}
