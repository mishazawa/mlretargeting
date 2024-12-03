import { Viewport } from "./components/Viewport";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.cont}>
      <Viewport />
    </div>
  );
}
