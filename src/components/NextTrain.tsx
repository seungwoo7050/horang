"use client";

import { useEffect, useState, type ReactNode } from "react";
import { getMessages, type Locale } from "@/i18n";
import { koreaMinutes, nextDepartures } from "@/lib/next-departures";
import styles from "./NextTrain.module.css";

export type TrainRow = { depart: string; arrive: string };

type Props = {
  lang: Locale;
  rows: TrainRow[];
  from: string;
  to: string;
  /** 근거 줄(서버에서 그림) */
  meta: ReactNode;
};

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * 다음 직통열차 3편(공식 시각표, 한국 시각). 정적 HTML에는 시각을 굽지 않고
 * 기기에서 처음 그린 뒤 30초마다 다시 계산한다(빌드 시각이 화면에 남지 않게).
 */
export function NextTrain({ lang, rows, from, to, meta }: Props) {
  const t = getMessages(lang).arex.next;
  const [now, setNow] = useState(null as number | null);
  // 스크린 리더에 알릴 말. 첫 열차가 바뀌거나 막차 뒤로 넘어갈 때만 채운다(처음 그릴 때는 비워 둔다)
  const [news, setNews] = useState("");

  useEffect(() => {
    const say = (m: number) => {
      const first = nextDepartures(rows, (r) => r.depart, m, 1)[0];
      return first ? `${t.title} ${first.time}` : t.none.replace("{time}", rows[0]?.depart ?? "");
    };
    let said: string | null = null;
    const tick = () => {
      const m = koreaMinutes(new Date());
      setNow(m);
      const next = say(m);
      if (said !== null && next !== said) setNews(next);
      said = next;
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [rows, t]);

  const next = now === null ? [] : nextDepartures(rows, (r) => r.depart, now, 3);

  return (
    // 패널 전체를 live로 두면 매분 바뀌는 시계·남은 분이 읽는 중에 끼어든다. 알릴 것만 아래 숨은 줄에
    <section className={styles.panel}>
      <p className={styles.announce} aria-live="polite">
        {news}
      </p>
      <div className={styles.head}>
        <h2>{t.title}</h2>
        {now !== null ? (
          <span className={styles.clock}>
            {t.now.replace("{time}", `${pad(Math.floor(now / 60))}:${pad(now % 60)}`)}
          </span>
        ) : null}
      </div>
      <p className={styles.route}>{t.route.replace("{from}", from).replace("{to}", to)}</p>
      {now === null ? null : next.length === 0 ? (
        <p className={styles.none}>{t.none.replace("{time}", rows[0]?.depart ?? "")}</p>
      ) : (
        <ol className={styles.list}>
          {next.map((d, i) => (
            <li key={d.time} className={i === 0 ? styles.first : undefined}>
              <strong>{d.time}</strong>
              <span>
                {d.inMinutes === 0 ? t.leaving : t.in.replace("{m}", String(d.inMinutes))}
              </span>
              <small>{t.arrives.replace("{time}", d.row.arrive)}</small>
            </li>
          ))}
        </ol>
      )}
      <p className={styles.note}>{t.note}</p>
      {meta}
    </section>
  );
}
