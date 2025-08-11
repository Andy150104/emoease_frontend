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
  }
}

type ExternalTrack = {
  src: string;
  srclang: string;
  label: string;
  kind?: "subtitles" | "captions";
  default?: boolean;
};

type Props = {
  src: string;
  poster?: string;
  /** Link .vtt bên ngoài (Cloudinary raw) */
  urlVtt?: string;
  /** Vẫn hỗ trợ mảng tracks nếu cần nhiều hơn */
  tracks?: ExternalTrack[];
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

export default function YouTubeStylePlayer({ src, poster, urlVtt, tracks }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const plyrRef = useRef<Plyr | null>(null);
  const [switching, setSwitching] = useState(false);
  const [subtitleOptions, setSubtitleOptions] = useState<Array<{ index: number; label: string }>>([]);
  const [selectedSubtitleIdx, setSelectedSubtitleIdx] = useState<number>(-1);

  useEffect(() => {
    let mounted = true;

    (async () => {
      // ⬇️ dynamic import (client-only)
      const PlyrMod = await import("plyr");
      const PlyrCtor = PlyrMod.default;
      const { default: HlsClass, Events } = await import("hls.js"); // <- lấy class & Events

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
          // Hiển thị subtitle từ manifest (nếu có)
          renderTextTracksNatively: true,
          enableWebVTT: true,
          enableIMSC1: true,
        }) as Hls;

        hlsRef.current = hls;

        hls.loadSource(src);
        hls.attachMedia(video);

        try {
          hls.subtitleDisplay = true;
        } catch {}

        hls.on(Events.SUBTITLE_TRACKS_UPDATED, (_ev: unknown, d: unknown) => {
          const data = d as { subtitleTracks?: Array<{ name?: string; lang?: string }> } | undefined;
          const sts = data?.subtitleTracks ?? [];
          if (!Array.isArray(sts) || sts.length === 0) return;

          const pickIndex = (() => {
            const enIdx = sts.findIndex((t) => {
              const n = `${t?.name ?? ""} ${t?.lang ?? ""}`.toLowerCase();
              return n === "en" || n.includes("english");
            });
            return enIdx >= 0 ? enIdx : 0;
          })();

          hls.subtitleTrack = pickIndex;
          const tt = video.textTracks;
          for (let i = 0; i < tt.length; i += 1) tt[i].mode = i === pickIndex ? "showing" : "disabled";

          const options = sts.map((t, i) => ({ index: i, label: (t?.name || t?.lang || `Track ${i + 1}`) + "" }));
          setSubtitleOptions(options);
          setSelectedSubtitleIdx(pickIndex);
        });

        hls.on(Events.MANIFEST_PARSED, (_e: unknown, data: ManifestParsedData) => {
          const heights = [...new Set((data.levels || []).map((l) => l.height).filter(Boolean))].sort(
            (a, b) => (b ?? 0) - (a ?? 0)
          );

          const options: ExtendedPlyrOptions = {
            ratio: "16:9",
            seekTime: 10,
            controls: [
              "play-large",
              "restart",
              "rewind",
              "play",
              "fast-forward",
              "progress",
              "current-time",
              "duration",
              "mute",
              "volume",
              "captions",
              "settings",
              "pip",
              "airplay",
              "download",
              "fullscreen",
            ],
            settings: ["captions", "quality", "speed", "loop"],
            speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] },
            captions: { active: true, language: "auto", update: true },
            i18n: { settings: "Cài đặt", quality: "Chất lượng", speed: "Tốc độ phát", captions: "Phụ đề" },
            urls: { download: src },
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
                  hls.currentLevel = -1;
                } else {
                  targetIdx = hls.levels.findIndex((l) => l.height === q);
                  if (targetIdx < 0) targetIdx = 0;
                  hls.currentLevel = targetIdx;
                }

                const onFragBuffered = (_ev: unknown, fragData: FragBufferedData) => {
                  if (fragData?.frag?.type !== "main") return;
                  if (targetIdx !== -1 && fragData.frag.level !== targetIdx) return;
                  hls.off(Events.FRAG_BUFFERED, onFragBuffered);
                  v.currentTime = t;
                  setTimeout(() => {
                    if (!wasPaused) v.play().catch(() => {});
                    setSwitching(false);
                  }, 0);
                };
                hls.on(Events.FRAG_BUFFERED, onFragBuffered);
              },
            },
          };

          plyr = new PlyrCtor(video, options) as Plyr;
          plyrRef.current = plyr;

          try {
            plyr?.on("ready", () => {
              try {
                // Bật CC để nhận external <track> nếu có
                plyrRef.current?.toggleCaptions(true);
              } catch {}
            });
          } catch {}
        });

        hls.on(Events.LEVEL_SWITCHED, (_e: unknown, d: LevelSwitchedData) => {
          const h = hls.levels?.[d.level]?.height ?? 0;
          if (plyr) (plyr as PlyrWithQuality).quality = h || 0;
        });

        hls.on(Events.SUBTITLE_TRACK_LOADED, () => {
          const v = videoRef.current;
          if (!v) return;
          const activeIdx = hls.subtitleTrack ?? -1;
          const tt = v.textTracks;
          for (let i = 0; i < tt.length; i += 1) tt[i].mode = i === activeIdx ? "showing" : "disabled";
          setTimeout(() => {
            try {
              plyrRef.current?.toggleCaptions(true);
            } catch {}
          }, 0);
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Safari native HLS
        video.src = src;
        plyr = new PlyrCtor(video, {
          controls: ["play", "progress", "mute", "volume", "captions", "settings", "fullscreen"],
          captions: { active: true, language: "auto", update: true },
        }) as Plyr;
        plyrRef.current = plyr;
        try {
          plyr?.on("ready", () => {
            try {
              plyrRef.current?.toggleCaptions(true);
            } catch {}
          });
        } catch {}
      } else {
        video.src = src;
        plyr = new PlyrCtor(video) as Plyr;
        plyrRef.current = plyr;
      }
    })().catch(() => {});

    return () => {
      mounted = false;
      hlsRef.current?.destroy();
      plyrRef.current?.destroy();
      hlsRef.current = null;
      plyrRef.current = null;
    };
  }, [src]);

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
        >
          {/* Track phụ đề ngoài (Cloudinary raw) */}
          {urlVtt ? (
            <track
              key="vi-default"
              kind="subtitles"
              src={urlVtt}
              label="Tiếng Việt"
              srcLang="vi"
              default
            />
          ) : null}

          {/* Vẫn hỗ trợ mảng tracks nếu cần nhiều track */}
          {Array.isArray(tracks)
            ? tracks.map((t, idx) => (
                <track
                  key={`${t.srclang}-${idx}`}
                  kind={t.kind ?? "subtitles"}
                  src={t.src}
                  label={t.label}
                  srcLang={t.srclang}
                  default={t.default}
                />
              ))
            : null}
        </video>

        {/* Menu phụ đề thủ công – chỉ dùng khi subtitle đến từ manifest HLS */}
        {subtitleOptions.length > 0 && (
          <div className="absolute right-4 bottom-20 z-20">
            <label className="mr-2 text-white text-sm">Phụ đề:</label>
            <select
              className="bg-black/70 text-white text-sm px-2 py-1 rounded"
              value={selectedSubtitleIdx}
              onChange={(e) => {
                const idx = Number(e.target.value);
                setSelectedSubtitleIdx(idx);
                const hls = hlsRef.current;
                const video = videoRef.current;
                if (!hls || !video) return;
                hls.subtitleTrack = idx;
                const tt = video.textTracks;
                for (let i = 0; i < tt.length; i += 1) {
                  tt[i].mode = i === idx ? "showing" : "disabled";
                }
              }}
            >
              {subtitleOptions.map((opt) => (
                <option key={opt.index} value={opt.index}>
                  {opt.label}
                </option>
              ))}
              <option value={-1}>Tắt</option>
            </select>
          </div>
        )}

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
