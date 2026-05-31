interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function Card({ children, className = "", style }: CardProps) {
  return (
    <div className={`dq-window p-5 ${className}`} style={style}>
      {children}
    </div>
  );
}
