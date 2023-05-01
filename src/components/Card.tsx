import styles from './Card.module.css'
import Image from 'next/image'

// define a interface for the props
interface CardProps {
    image?: string;
    title?: string;
    paragraph?: string;
}


export function Card(props: CardProps) {
    return (
        <div className={styles.card}>
            <Image alt='' src="https://golearning.oss-cn-shanghai.aliyuncs.com/202305010847243.png" width={100} height={100} className={styles.img}/>
            <div className={styles.content}>
                <div className={styles.title}>{props.title}</div>
                <p>{props.paragraph}</p>
            </div>
        </div>
    )
}