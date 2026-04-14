import React from "react";
import Hls from "hls.js";

export default function VideoPlayer({ streamUrl, title = "Cloudinary stream" }) {
  const videoRef = React.useRef(null);

  React.useEffect(() => {
    const video = videoRef.current;

    if (!video || !streamUrl) {
      return undefined;
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
      return undefined;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
      });

      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      return () => {
        hls.destroy();
      };
    }

    video.src = streamUrl;
    return undefined;
  }, [streamUrl]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-lg">
      <div className="border-b border-white/10 px-4 py-3 text-sm font-medium text-slate-200">
        {title}
      </div>
      <video
        ref={videoRef}
        controls
        controlsList="nodownload noplaybackrate noremoteplayback"
        disablePictureInPicture
        onContextMenu={(event) => event.preventDefault()}
        className="h-[420px] w-full bg-black object-contain"
        playsInline
      />
    </div>
  );
}