import { Entrance } from "./components/entrance/Entrance";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <Entrance/>
    </div>
  );
}
