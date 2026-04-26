import React from "react";
import Hls from "hls.js";

function getMediaKind(fileType = "") {
  const value = fileType.toString().trim().toUpperCase();
  if (value === "VIDEO") return "video";
  if (value === "IMAGE" || value === "PNG" || value === "JPG" || value === "JPEG" || value === "WEBP" || value === "GIF") return "image";
  if (value === "PDF" || value === "FILE" || value === "RAW" || value === "DOC" || value === "DOCX") return "file";
  return "file";
}

export default function CloudMediaViewer({ mediaUrl, fileType, title = "Cloud preview" }) {
  const videoRef = React.useRef(null);
  const mediaKind = getMediaKind(fileType);

  React.useEffect(() => {
    const video = videoRef.current;

    if (!video || mediaKind !== "video" || !mediaUrl) {
      return undefined;
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = mediaUrl;
      return undefined;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true, lowLatencyMode: false });
      hls.loadSource(mediaUrl);
      hls.attachMedia(video);

      return () => {
        hls.destroy();
      };
    }

    video.src = mediaUrl;
    return undefined;
  }, [mediaKind, mediaUrl]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-lg">
      {mediaKind === "video" ? (
        <video
          ref={videoRef}
          controls
          controlsList="nodownload noplaybackrate noremoteplayback"
          disablePictureInPicture
          onContextMenu={(event) => event.preventDefault()}
          className="h-105 w-full bg-black object-contain"
          playsInline
        />
      ) : mediaKind === "image" ? (
        <div className="flex min-h-105 items-center justify-center bg-black p-4">
          <img
            src={mediaUrl}
            alt={title}
            className="max-h-105 w-full object-contain"
            draggable="false"
            onContextMenu={(event) => event.preventDefault()}
          />
        </div>
      ) : (
        <iframe
          src={mediaUrl}
          title={title}
          className="h-105 w-full bg-white"
          loading="lazy"
        />
      )}
    </div>
  );
}
