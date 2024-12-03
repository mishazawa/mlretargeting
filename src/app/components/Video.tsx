import { forwardRef } from "react";

const ML_VIDEO_HEIGHT = 240;
const ML_VIDEO_WIDTH = 320;

export const Video = forwardRef<HTMLVideoElement, any>(function Video(
  props,
  ref
) {
  return (
    <video
      ref={ref}
      width={ML_VIDEO_WIDTH}
      height={ML_VIDEO_HEIGHT}
      controls
      preload="auto"
      muted
      {...props}
      style={{ display: "none" }}
    >
      <source src={props.src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
});
