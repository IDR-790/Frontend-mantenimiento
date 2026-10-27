import { FlvPlayer } from "./FlvPlayer";

export default function VideoGrid({ videos }) {
  const gridSize = Math.ceil(Math.sqrt(videos.length));

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        gridAutoRows: "1fr",
        gap: "4px",
        height: "100vh"
      }}
    >
      {videos.map((video) => (
        <FlvPlayer key={video.id} url={video.url} />
      ))}
    </div>
  );
}