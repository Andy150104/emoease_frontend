"use client";
import { Button } from "antd";
import VideoPlayer, { PauseReason } from "EmoEase/components/Video/VideoPlayer";

export default function VideoPage() {
  const hlsUrl =
    // "https://res.cloudinary.com/dbfokyruf/video/upload/sp_auto:maxres_2160p/v1754870027/Hc-lp-trnh-NET---phn-1---Ci-t-Visual-Studio-v-vit-chng-trnh-NET-u-tin.m3u8";

    // "https://res.cloudinary.com/dbfokyruf/video/upload/sp_auto:maxres_2160p/v1754879599/Hc-lp-trnh-NET---phn-1---Ci-t-Visual-Studio-v-vit-chng-trnh-NET-u-tin-1.m3u8";
    // "https://res.cloudinary.com/dbfokyruf/video/upload/sp_auto/v1754883646/Kinh-nghim-phng-vn-backend-NET-C-2-nm-kinh-nghim.m3u8";
    // "https://cdn.bitmovin.com/content/assets/sintel/hls/playlist.m3u8";
    "https://res.cloudinary.com/dbfokyruf/video/upload/sp_auto:subtitles_((code_vi-VN;file_Hng-Trm---Ngc-2-Hy--Em-Qun-Official-MV.vi-VN.vtt))/v1754995566/Hng-Trm---Ngc-2-Hy--Em-Qun-Official-MV.m3u8";
  const vttUrl =
    "https://res.cloudinary.com/dbfokyruf/raw/upload/v1754995569/Hng-Trm---Ngc-2-Hy--Em-Qun-Official-MV.vi-VN.vtt";
  const handlePause = (info: {
    currentTime: number;
    duration: number;
    reason: PauseReason;
  }) => {
    console.log("Paused:", info);
    // TODO: gọi API lưu progress, analytics, v.v...
  };
  

const makeOverlayClose = (id: string, close: () => void) => () => {
  console.log(`overlay ${id} close clicked`);
  close();
};

  return (
    <main className="p-5">
      <h1 className="mb-5 text-xl font-semibold">Xem Video Ngrok 1</h1>
      <VideoPlayer
        src={hlsUrl}
        // poster="https://media.istockphoto.com/id/2150399781/vi/anh/m%E1%BB%99t-c%C3%A1nh-%C4%91%E1%BB%93ng-n%C3%B4ng-nghi%E1%BB%87p-r%E1%BB%99ng-l%E1%BB%9Bn-v%E1%BB%9Bi-nh%E1%BB%AFng-c%C3%A2y-ng%C3%B4-tr%E1%BB%93ng-ng%C3%B4-%E1%BB%9F-quy-m%C3%B4-c%C3%B4ng-nghi%E1%BB%87p-c%E1%BA%A3nh-quan.jpg?s=2048x2048&w=is&k=20&c=IX8bx3uLJS71IP7WHB3mvlj7pKJrx5T-YG6_pCXNrko="
        urlVtt={vttUrl}
        onPause={handlePause}
        onResume={(info) =>
          console.log(`Resumed after ${info.pausedForMs}ms`, info)
        }
        timedOverlays={[
          {
            id: "quiz-150",
            start: 3, // 2:30
            pauseOnShow: true, // tự pause khi xuất hiện
            backdrop: true, // mặc định true, có thể bỏ
            className: "absolute inset-0 !z-50 h-full w-full bg-black/50",
            content: ({ close }) => (
              <div className="h-full w-full bg-white p-6 overflow-auto">
                {/* Nếu muốn nội dung ở giữa, dùng flex */}
                <div className="mx-auto flex h-full max-w-2xl flex-col justify-center">
                  <h3 className="mb-3 text-lg font-semibold">Quiz ôn tập 1</h3>
                  <p className="mb-3 font-medium">
                    Trong React, Hook nào để thêm state vào functional
                    component?
                  </p>

                  <ul className="space-y-2">
                    <li>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="q1" /> useContext
                      </label>
                    </li>
                    <li>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="q1" /> useEffect
                      </label>
                    </li>
                    <li>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="q1" /> useReducer
                      </label>
                    </li>
                    <li>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="q1" /> <b>useState</b>
                      </label>
                    </li>
                  </ul>

                  <div className="mt-6 self-end">
                    <Button
                      onClick={makeOverlayClose("quiz-003", close)}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-white pointer-events-auto"
                    >
                      Tiếp tục xem
                    </Button>
                  </div>
                </div>
              </div>
            ),
          },
          {
            id: "quiz-151",
            start: 6, // 2:30
            pauseOnShow: true, // tự pause khi xuất hiện
            // backdrop: true,    // mặc định true, có thể bỏ
            className: "absolute inset-0 z-50 h-full w-full bg-black/50",
            content: ({ close }) => (
              <div className="h-full w-full bg-white p-6 overflow-auto">
                {/* Nếu muốn nội dung ở giữa, dùng flex */}
                <div className="mx-auto flex h-full max-w-2xl flex-col justify-center">
                  <h3 className="mb-3 text-lg font-semibold">Quiz ôn tập 2</h3>
                  <p className="mb-3 font-medium">
                    Trong React, Hook nào để thêm state vào functional
                    component?
                  </p>

                  <ul className="space-y-2">
                    <li>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="q1" /> useContext
                      </label>
                    </li>
                    <li>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="q1" /> useEffect
                      </label>
                    </li>
                    <li>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="q1" /> useReducer
                      </label>
                    </li>
                    <li>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="q1" /> <b>useState</b>
                      </label>
                    </li>
                  </ul>

                  <div className="mt-6 self-end">
                    <Button
                      onClick={close}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-white"
                    >
                      Tiếp tục xem
                    </Button>
                  </div>
                </div>
              </div>
            ),
          },
        ]}
      />
    </main>
  );
}
