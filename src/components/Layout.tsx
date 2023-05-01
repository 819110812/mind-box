import { Props } from "@nextui-org/react/types/theme/theme-provider";
import styles from "./Layout.module.css";

export function Layout({ children, className, ...props }: any) {
  return <div className={styles.container + ' ' + className}>{children}</div>;
}
