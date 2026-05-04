export function Table({
  headers,
  children,
}: {
  headers: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-left text-sm whitespace-nowrap table-hover mb-0">
        <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="px-4 py-3 font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">{children}</tbody>
      </table>
    </div>
  );
}

export function TableRow({ children }: { children: React.ReactNode }) {
  return <tr className="hover:bg-gray-50 transition-colors">{children}</tr>;
}

export function TableCell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-4 py-4 text-gray-800 ${className}`}>{children}</td>;
}
