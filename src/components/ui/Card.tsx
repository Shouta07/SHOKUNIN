interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function Card({ children, className = "", style }: CardProps) {
  return (
    <div className={`rounded-2xl bg-white p-5 shadow-sm ${className}`} style={style}>
      {children}
    </div>
  );
}
