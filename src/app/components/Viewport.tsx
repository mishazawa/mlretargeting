"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { SkeletonHelper } from "three";
import {
  filterPoseLandmarks,
  Keypoint3D,
  useBodyPose,
} from "../hooks/useBodyPose";
import { Video } from "./Video";
import { CameraControls, useHelper } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three-stdlib";

function Box(props: any) {
  return (
    <mesh {...props}>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshStandardMaterial color={"orange"} />
    </mesh>
  );
}

export function Viewport() {
  const source = useRef<HTMLVideoElement>(null!);
  const [frames, setFrames] = useState<Keypoint3D[]>([]);
  const pose = useBodyPose();

  useEffect(() => {
    if (!pose) return;
    const v = source.current;
    v.currentTime = 36;
    v.oncanplay = (event) => {
      pose.detect(source.current, (body, err) => {
        if (err) return console.error(err);
        if (!body.length) return;
        setFrames(filterPoseLandmarks(body[0].keypoints3D, 0.75));
      });
    };
  }, [pose]);

  return !pose ? (
    <p>loading...</p>
  ) : (
    <>
      <Video ref={source} />
      <Canvas>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        {frames.map((kp) => {
          return <Box key={kp.name} position={[kp.x, -kp.y, -kp.z]} />;
        })}
        <Character />
        <CameraControls />
      </Canvas>
    </>
  );
}

function Character() {
  const ref = useRef(null!);
  const gltf = useLoader(GLTFLoader, "/char.glb");
  useHelper(ref, SkeletonHelper);
  return <primitive ref={ref} object={gltf.scene} />;
}
