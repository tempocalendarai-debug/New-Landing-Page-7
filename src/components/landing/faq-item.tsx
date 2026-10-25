import type { ReactNode } from "react";

/** Native disclosure: keyboard accessible and usable before JavaScript loads. */
export function FaqItem({ question, children, icon, defaultOpen = false, group }: { question: string; children: ReactNode; icon?: ReactNode; defaultOpen?: boolean; group?: string }) {
  return (
    <details className="faq__item" open={defaultOpen} name={group}>
      <summary>
        {icon && <span className="faq__topic-icon" aria-hidden="true">{icon}</span>}
        <span className="faq__question">{question}</span>
        <svg className="faq__icon" width={20} height={20} viewBox="0 0 22 22" fill="none" aria-hidden="true">
          <path d="M4 11 C9 10.8 13 11 18 11.2" />
          <path className="faq__icon-upright" pathLength={1} d="M11 4 C11.2 9 11 13 10.8 18" />
        </svg>
      </summary>
      <div className="faq__panel"><div><div className="faq__answer">{children}</div></div></div>
    </details>
  );
}
