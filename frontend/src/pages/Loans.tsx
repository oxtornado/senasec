import { Calendar as CalendarIcon, Clock, User, Package } from 'lucide-react';

const Loans = () => {
  const loans = [
    {
      id: 1,
      item: 'Proyector',
      user: 'Juan Pérez',
      startTime: '09:00',
      endTime: '11:00',
      status: 'Activo',
    },
    {
      id: 2,
      item: 'Laptop',
      user: 'María García',
      startTime: '14:00',
      endTime: '16:00',
      status: 'Pendiente',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Préstamos</h2>
        <button className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Solicitar préstamo
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {loans.map((loan) => (
            <li key={loan.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Package className="h-5 w-5 text-gray-400 mr-2" />
                    <p className="text-sm font-medium text-blue-600 truncate">{loan.item}</p>
                  </div>
                  <div className="ml-2 flex-shrink-0">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      loan.status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {loan.status}
                    </span>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      {loan.user}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    <p>Hoy</p>
                    <Clock className="flex-shrink-0 mx-1.5 h-5 w-5 text-gray-400" />
                    <p>
                      {loan.startTime} - {loan.endTime}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Calendario de Reservas
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Vista semanal de las reservas programadas.</p>
          </div>
          <div className="mt-5 border-2 border-gray-300 border-dashed rounded-lg p-6 text-center">
            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Calendario</h3>
            <p className="mt-1 text-sm text-gray-500">
              Próximamente: Integración con calendario
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loans;