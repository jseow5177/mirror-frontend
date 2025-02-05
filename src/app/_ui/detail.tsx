import { ReactNode } from 'react';

export function DetailGrid({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '150px auto',
        rowGap: '16px',
        marginBottom: '16px',
      }}
    >
      {children}
    </div>
  );
}

export function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | number | ReactNode;
}) {
  return (
    <>
      <strong>{label}:</strong>
      {typeof value === 'string' || typeof value === 'number' ? (
        <p>{value}</p>
      ) : (
        value
      )}
    </>
  );
}
