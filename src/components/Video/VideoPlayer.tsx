"use client";
import { useEffect, useRef, useState } from "react";
// ✅ chỉ import type để safe với SSR
import type Plyr from "plyr";
import type Hls from "hls.js";
import type { ManifestParsedData, LevelSwitchedData, FragBufferedData } from "hls.js";
import "plyr/dist/plyr.css";

import styles from "EmoEase/components/Video/styles/VideoPlayer.module.css";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

// Bổ sung type cho field không có trong định nghĩa
declare module "hls.js" {
  interface Hls {
    subtitleDisplay?: boolean;
    subtitleTrack?: number;
  }
}

type Props = {
  src: string;
  poster?: string;
  /** Link .vtt bên ngoài (Cloudinary raw) */
  urlVtt?: string;
};

type PlyrQualityOption = {
  default?: number;
  options?: number[];
  forced?: boolean;
  onChange?: (quality: number) => void;
};

type PlyrUrlsOption = { download?: string };

type ExtendedPlyrOptions = Plyr.Options & {
  quality?: PlyrQualityOption;
  urls?: PlyrUrlsOption;
};

type PlyrWithQuality = Plyr & { quality: number };
type PlyrWithLanguage = Plyr & { language: string };

export default function YouTubeStylePlayer({ src, poster, urlVtt }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const trackRef = useRef<HTMLTrackElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const plyrRef = useRef<Plyr | null>(null);
  const [switching, setSwitching] = useState(false);
  const [vttBlobUrl, setVttBlobUrl] = useState<string | null>(null);
  const vttObjectUrlRef = useRef<string | null>(null);
  const [vttBuster, setVttBuster] = useState(0);

  // Bật đúng track ngoài sau khi track đã load
  const onTrackLoad = () => {
    const v = videoRef.current;
    if (!v) return;
    const tt = v.textTracks;

    // Chọn track tiếng Việt nếu có, nếu không chọn track đầu tiên
    let targetIndex = -1;
    for (let i = 0; i < tt.length; i++) {
      const t = tt[i];
      const lang = (t.language || "").toLowerCase();
      const label = (t.label || "").toLowerCase();
      const isVi = lang === "vi" || label.includes("việt") || label.includes("vietnam");
      if (isVi && targetIndex === -1) targetIndex = i;
    }
    if (targetIndex === -1 && tt.length > 0) targetIndex = 0;

    // Buộc reflow: đặt hidden rồi mới showing để đảm bảo render lại cue
    for (let i = 0; i < tt.length; i++) {
      tt[i].mode = i === targetIndex ? "hidden" : "disabled";
    }
    setTimeout(() => {
      const v2 = videoRef.current;
      if (!v2) return;
      const tt2 = v2.textTracks;
      if (targetIndex >= 0 && tt2[targetIndex]) tt2[targetIndex].mode = "showing";
    }, 0);
    // Nếu chưa tìm thấy -> để browser dùng default, Plyr vẫn hiện CC
    try {
      plyrRef.current?.toggleCaptions(true);
    } catch {}

    // debug nhanh (có thể bỏ):
    // console.log([...tt].map(t => ({label: t.label, lang: t.language, mode: t.mode, cues: t.cues?.length ?? 0})));
  };

  const onTrackError = () => {
    // Thử bust cache và trigger remount nếu lỗi
    setVttBuster((prev) => prev + 1);
  };

  useEffect(() => {
    let mounted = true;
    const preferExternal = !!urlVtt;

    (async () => {
      const PlyrCtor = (await import("plyr")).default;
      const { default: HlsClass, Events } = await import("hls.js");
      const video = videoRef.current;
      if (!mounted || !video) return;

      let plyr: Plyr | null = null;

      if (HlsClass.isSupported()) {
        const hls = new HlsClass({
          startLevel: -1,
          capLevelToPlayerSize: false,
          maxBufferLength: 10,
          maxMaxBufferLength: 30,
          backBufferLength: 10,
          // Không ép render native text của HLS để tránh xung đột với track ngoài
          enableWebVTT: true,
          enableIMSC1: true,
        }) as Hls;

        hlsRef.current = hls;
        hls.loadSource(src);
        hls.attachMedia(video);

        // External-only → tắt mọi thứ phụ đề của HLS để không chồng chéo
        if (preferExternal) {
          try { hls.subtitleDisplay = false; } catch {}
          try { hls.subtitleTrack = -1; } catch {}
        }

        hls.on(Events.MANIFEST_PARSED, (_e, data: ManifestParsedData) => {
          const heights = [...new Set((data.levels || []).map(l => l.height).filter(Boolean))].sort((a,b)=>(b??0)-(a??0));

          const options: ExtendedPlyrOptions = {
            ratio: "16:9",
            seekTime: 10,
            controls: [
              "play-large","restart","rewind","play","fast-forward","progress","current-time",
              "duration","mute","volume","captions","settings","pip","airplay","download","fullscreen",
            ],
            settings: ["captions", "quality", "speed", "loop"],
            speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] },
            captions: { active: true, language: preferExternal ? "vi" : "auto", update: true },
            i18n: { settings: "Cài đặt", quality: "Chất lượng", speed: "Tốc độ phát", captions: "Phụ đề" },
            urls: { download: src },
            fullscreen: { enabled: true, fallback: true, iosNative: true },
            storage: { enabled: false },
            quality: {
              default: 0,
              options: [0, ...heights],
              forced: true,
              onChange: (q: number) => {
                const v = videoRef.current!;
                const t = v.currentTime;
                const wasPaused = v.paused;

                setSwitching(true);
                v.pause();

                let targetIdx = -1;
                if (q === 0) {
                  hls.currentLevel = -1; // Auto
                } else {
                  targetIdx = hls.levels.findIndex(l => l.height === q);
                  if (targetIdx < 0) targetIdx = 0;
                  hls.currentLevel = targetIdx;
                }

                const onFragBuffered = (_ev: unknown, fragData: FragBufferedData) => {
                  if (fragData?.frag?.type !== "main") return;
                  if (targetIdx !== -1 && fragData.frag.level !== targetIdx) return;
                  hls.off(Events.FRAG_BUFFERED, onFragBuffered);
                  v.currentTime = t;
                  setTimeout(() => { if (!wasPaused) v.play().catch(()=>{}); setSwitching(false); }, 0);
                };
                hls.on(Events.FRAG_BUFFERED, onFragBuffered);
              },
            },
          };

          plyr = new PlyrCtor(video, options) as Plyr;
          plyrRef.current = plyr;

          plyr.on?.("ready", () => {
            try {
              if (preferExternal) {
                // Ưu tiên ngôn ngữ phụ đề tiếng Việt nếu có
                try { (plyrRef.current as PlyrWithLanguage).language = "vi"; } catch {}
              }
              plyrRef.current?.toggleCaptions(true);
            } catch {}
            if (preferExternal) {
              const tr = trackRef.current;
              // 2 = HTMLTrackElement.LOADED
              if (tr && tr.readyState === 2) onTrackLoad();
              // nếu chưa loaded, onTrackLoad sẽ tự chạy khi <track> fire 'load'
              // chạy lại 1 lần sau tick để chắc chắn render
              setTimeout(() => onTrackLoad(), 50);
              setTimeout(() => onTrackLoad(), 250);
            }
          });

          // Sau khi manifest parse xong, đảm bảo HLS không bật subtitle nội bộ
          if (preferExternal) {
            try { hls.subtitleDisplay = false; } catch {}
            try { hls.subtitleTrack = -1; } catch {}
          }
        });

        hls.on(Events.LEVEL_SWITCHED, (_e, d: LevelSwitchedData) => {
          const h = hls.levels?.[d.level]?.height ?? 0;
          if (plyr) (plyr as PlyrWithQuality).quality = h || 0;
        });

        // ❌ Không đăng ký SUBTITLE_TRACKS_* (external-only)
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Safari native HLS
        video.src = src;
        plyr = new PlyrCtor(video, {
          controls: ["play", "progress", "mute", "volume", "captions", "settings", "fullscreen"],
          captions: { active: true, language: preferExternal ? "vi" : "auto", update: true },
          i18n: { settings: "Cài đặt", quality: "Chất lượng", speed: "Tốc độ phát", captions: "Phụ đề" },
          fullscreen: { enabled: true, fallback: true, iosNative: true },
          storage: { enabled: false },
        }) as Plyr;
        plyrRef.current = plyr;

        plyr.on?.("ready", () => {
          try {
            if (preferExternal) {
              try { (plyrRef.current as PlyrWithLanguage).language = "vi"; } catch {}
            }
            plyrRef.current?.toggleCaptions(true);
          } catch {}
          if (preferExternal) {
            const tr = trackRef.current;
            if (tr && tr.readyState === 2) onTrackLoad();
            else {
              // nếu chưa có metadata, chờ rồi bật track
              if (video.readyState < 1) {
                video.addEventListener("loadedmetadata", onTrackLoad, { once: true });
              }
            }
            setTimeout(() => onTrackLoad(), 50);
            setTimeout(() => onTrackLoad(), 250);
          }
        });
      } else {
        // Fallback
        video.src = src;
        plyr = new PlyrCtor(video, {
          captions: { active: true, language: preferExternal ? "vi" : "auto", update: true },
          storage: { enabled: false },
        }) as Plyr;
        plyrRef.current = plyr;

        if (preferExternal) {
          const tr = trackRef.current;
          if (tr && tr.readyState === 2) onTrackLoad();
          else {
            if (video.readyState >= 1) onTrackLoad();
            else video.addEventListener("loadedmetadata", onTrackLoad, { once: true });
          }
          setTimeout(() => onTrackLoad(), 50);
          setTimeout(() => onTrackLoad(), 250);
        }
      }
    })().catch(() => {});

    return () => {
      mounted = false;
      hlsRef.current?.destroy();
      plyrRef.current?.destroy();
      hlsRef.current = null;
      plyrRef.current = null;
    };
  }, [src, urlVtt]);

  // Đảm bảo lắng nghe sự kiện load/error trực tiếp trên phần tử <track>
  useEffect(() => {
    const tr = trackRef.current;
    if (!tr) return;

    const handleLoad = () => onTrackLoad();
    const handleError = () => onTrackError();

    // Nếu đã loaded trước đó
    if (tr.readyState === 2) {
      onTrackLoad();
    }

    tr.addEventListener("load", handleLoad);
    tr.addEventListener("error", handleError);

    return () => {
      tr.removeEventListener("load", handleLoad);
      tr.removeEventListener("error", handleError);
    };
  }, [urlVtt]);

  // Tải VTT thủ công -> tạo Blob URL để tránh CORS/cache không ổn định
  useEffect(() => {
    let aborted = false;
    async function loadVtt() {
      if (!urlVtt) {
        if (vttObjectUrlRef.current) {
          URL.revokeObjectURL(vttObjectUrlRef.current);
          vttObjectUrlRef.current = null;
        }
        setVttBlobUrl(null);
        return;
      }
      try {
        const res = await fetch(urlVtt, { cache: "no-store", mode: "cors" });
        if (!res.ok) throw new Error(`VTT fetch failed ${res.status}`);
        const text = await res.text();
        if (aborted) return;
        const blob = new Blob([text], { type: "text/vtt" });
        const bu = URL.createObjectURL(blob);
        if (vttObjectUrlRef.current) {
          URL.revokeObjectURL(vttObjectUrlRef.current);
        }
        vttObjectUrlRef.current = bu;
        setVttBlobUrl(bu);
      } catch {
        // fallback: dùng URL gốc, vẫn để event load xử lý
        setVttBlobUrl(null);
      }
    }
    loadVtt();
    return () => {
      aborted = true;
    };
  }, [urlVtt]);

  // Cleanup Blob URL khi unmount
  useEffect(() => {
    return () => {
      if (vttObjectUrlRef.current) {
        URL.revokeObjectURL(vttObjectUrlRef.current);
        vttObjectUrlRef.current = null;
      }
    };
  }, []);

  // Khi video đã có metadata/first frame, thử kích hoạt lại phụ đề (ổn định khi reload)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onMeta = () => onTrackLoad();
    const onData = () => onTrackLoad();
    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("loadeddata", onData);
    return () => {
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("loadeddata", onData);
    };
  }, [src, urlVtt]);

  return (
    <div className="w-full max-w-[1200px] mx-auto">
      <div className={`${styles.player} relative w-full`}>
        <video
          ref={videoRef}
          className="w-full bg-black"
          playsInline
          controls
          crossOrigin="anonymous"
          poster={poster}
          preload="metadata"   // giúp track load sớm
        >
          {/* ✅ CHỈ DÙNG EXTERNAL VTT */}
          {urlVtt ? (
            <track
              ref={trackRef}
              key={`${vttBlobUrl ?? urlVtt}?b=${vttBuster}`}          // remount khi đổi URL
              kind="captions"       // dùng "captions" để Plyr nhận đúng
              src={vttBlobUrl ?? `${urlVtt}${urlVtt.includes("?") ? "&" : "?"}b=${vttBuster}`}
              label="Tiếng Việt"
              srcLang="vi"
              default
              onLoad={onTrackLoad}  // bật sau khi track đã load
              onError={onTrackError}
            />
          ) : null}
        </video>

        {switching && (
          <div className="absolute inset-0 grid place-items-center bg-black/40 text-white rounded-lg">
            <div className="flex items-center gap-2">
              <Spin indicator={<LoadingOutlined style={{ fontSize: 28 }} spin />} />
              <span>Đang đổi chất lượng…</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
