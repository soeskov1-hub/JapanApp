import { isYoutubeUrl, getYoutubeEmbedUrl } from "@/lib/utils";

interface VideoPlayerProps {
  source: string | null;
  url: string;
}

export function VideoPlayer({ source, url }: VideoPlayerProps) {
  if (source === "upload") {
    return (
      <video
        src={url}
        controls
        className="w-full rounded-xl max-h-64 bg-ink"
        playsInline
      />
    );
  }

  if (isYoutubeUrl(url)) {
    const embedUrl = getYoutubeEmbedUrl(url);
    if (embedUrl) {
      return (
        <div className="relative w-full pt-[56.25%] rounded-xl overflow-hidden">
          <iframe
            src={embedUrl}
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      );
    }
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-japan-red text-sm underline underline-offset-2"
    >
      🎬 Watch video
    </a>
  );
}
