import { useEffect, useState } from "react";

type ModelType =
  | "MULTIPOSE_LIGHTNING"
  | "SINGLEPOSE_LIGHTNING"
  | "SINGLEPOSE_THUNDER";
type TrackerType = "keypoint" | "boundingBox";

type GotPosesCallback = (results: Array<PoseFrame>, error: any) => void;

export type BodyPose = {
  detectStart: (
    media: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement,
    gotPoses: GotPosesCallback
  ) => void;
  detect: (
    media: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement,
    gotPoses: GotPosesCallback
  ) => void;
};

declare global {
  interface Window {
    ml5: {
      bodyPose: (
        model?: "MoveNet" | "BlazePose",
        options?: {
          modelType: ModelType;
          enableSmoothing: boolean;
          minPoseScore: number;
          multiPoseMaxDimension: number;
          enableTracking: boolean;
          trackerType: TrackerType;
          trackerConfig: any;
          modelUrl?: string;
          flipped: boolean;
        },
        callback?: (bp: BodyPose, error: any) => void
      ) => BodyPose;
    };
  }
}

type LandmarksList = typeof LANDMARKS_FULL;
type LandmarkName = LandmarksList[number];

export type Keypoint3D = {
  x: number;
  y: number;
  z: number;
  confidence: number;
  name: LandmarkName;
};

type PoseFrame = {
  [k in LandmarkName]: Keypoint3D;
} & {
  box: {
    width: number;
    height: number;
    xMax: number;
    xMin: number;
    yMax: number;
    yMin: number;
  };
  id: number;
  keypoints: Keypoint3D[];
  keypoints3D: Keypoint3D[];
  confidence: number;
};

const LANDMARKS_FULL = [
  "nose",
  "left_eye_inner",
  "left_eye",
  "left_eye_outer",
  "right_eye_inner",
  "right_eye",
  "right_eye_outer",
  "left_ear",
  "right_ear",
  "mouth_left",
  "mouth_right",
  "left_shoulder",
  "right_shoulder",
  "left_elbow",
  "right_elbow",
  "left_wrist",
  "right_wrist",
  "left_pinky",
  "right_pinky",
  "left_index",
  "right_index",
  "left_thumb",
  "right_thumb",
  "left_hip",
  "right_hip",
  "left_knee",
  "right_knee",
  "left_ankle",
  "right_ankle",
  "left_heel",
  "right_heel",
  "left_foot index",
  "right_foot index",
  "body_center",
  "forehead",
  "left_thumb",
  "left_hand",
  "right_thumb",
  "right_hand",
] as const;

const LANDMARKS = [
  "left_shoulder",
  "right_shoulder",
  "left_elbow",
  "right_elbow",
  "left_wrist",
  "right_wrist",
  "left_hip",
  "right_hip",
  "left_knee",
  "right_knee",
  "left_ankle",
  "right_ankle",
  "left_heel",
  "right_heel",
  "left_foot_index",
  "right_foot_index",
  "body_center",
  "forehead",
  "left_hand",
  "right_hand",
];

const DEFAULT_OPTIONS = {
  modelType: "MULTIPOSE_LIGHTNING" as ModelType, // "MULTIPOSE_LIGHTNING", "SINGLEPOSE_LIGHTNING", or "SINGLEPOSE_THUNDER".
  enableSmoothing: true,
  minPoseScore: 0.25,
  multiPoseMaxDimension: 256,
  enableTracking: true,
  trackerType: "boundingBox" as TrackerType, // "keypoint" or "boundingBox"
  trackerConfig: {},
  modelUrl: undefined,
  flipped: false,
};

export function useBodyPose() {
  const [pose, setPose] = useState<BodyPose>(null!);

  useEffect(() => {
    window.ml5.bodyPose("BlazePose", DEFAULT_OPTIONS, (res, err) => {
      if (err) console.error(err);
      setPose(res);
    });
  }, []);

  return pose;
}

export function filterPoseLandmarks(
  data: Keypoint3D[],
  confidence: number = 0.5,
  list = LANDMARKS
): Keypoint3D[] {
  return data.filter(
    (kp) => list.includes(kp.name) && kp.confidence >= confidence
  );
}
