import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useState } from "react";
import { AiFillHeart } from "react-icons/ai";

import "./HeartBeat.css";

interface HeartBeatProps {
  heartRate: number;
}

const HeartBeat = ({ heartRate }: HeartBeatProps) => {
  const controls = useAnimationControls();
  const [animationTimeout, setAnimationTimeout] = useState<number>();

  useEffect(() => {
    beat(0.5);

    return () => {
      if (animationTimeout) {
        controls.stop();
        clearTimeout(animationTimeout);
      }
    };
  }, []);

  function beat(duration: number) {
    controls.start(
      {
        scaleX: [1, 1.4, 1],
        scaleY: [1, 1.3, 1],
        color: ["#494949", "#595959", "#494949"],
      },
      { duration }
    );
  }

  return (
    <motion.div
      initial={{ scale: 1 }}
      animate={controls}
      onAnimationComplete={() => {
        const duration = 1 / (Math.max(30, heartRate) / 60);
        beat(duration);
      }}
      transition={{}}
      className="heart-beat__icon"
    >
      <AiFillHeart />
    </motion.div>
  );
};

export default HeartBeat;
