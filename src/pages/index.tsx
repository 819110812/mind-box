import Image from "next/image";
import { Inter } from "next/font/google";
import { Card } from "@/components/Card";
import styles from "@/styles/index.module.css";
import { CurvedBackground } from "@/components/CurvedBackground";
import { Layout } from "@/components/Layout";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main>
      <CurvedBackground />
      <Layout className={styles.layoutConatiner}>
        <Card title="test" />
        <Card title="test" />
        <Card title="test" />
        <Card title="test" />
        <Card title="test" />
        <Card title="test" />
      </Layout>
    </main>
  );
}
