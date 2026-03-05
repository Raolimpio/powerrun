interface SpecificationsTableProps {
  specifications: Record<string, string>;
  title?: string;
  className?: string;
}

export function SpecificationsTable({
  specifications,
  title = 'Especificações',
  className = '',
}: SpecificationsTableProps) {
  const entries = Object.entries(specifications);

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}>
      <div className='bg-gray-50 px-4 py-3 border-b border-gray-200'>
        <h5 className='text-sm font-semibold text-gray-900 flex items-center'>
          <span className='mr-2'>📋</span>
          {title} ({entries.length})
        </h5>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Especificação
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Valor
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {entries.map(([key, value], index) => (
              <tr key={key} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className='px-4 py-3 text-sm font-medium text-gray-900'>{key}</td>
                <td className='px-4 py-3 text-sm text-gray-700'>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
