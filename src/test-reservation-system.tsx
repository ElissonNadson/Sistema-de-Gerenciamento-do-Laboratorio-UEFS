import { AdvancedReservationForm } from './components/reservations/AdvancedReservationForm';
import { useReservations } from './hooks/useReservations';

// Teste simples para verificar se o sistema de reservas funciona
export function TestReservationSystem() {
  const { reservations, createReservation, createRecurringReservations, loading, error } = useReservations();

  const handleReservationSubmit = async (data: any) => {
    try {
      console.log('Dados da reserva:', data);
      
      if (data.reservationType === 'single') {
        const id = await createReservation(data);
        console.log('Reserva criada com ID:', id);
      } else {
        const ids = await createRecurringReservations(data);
        console.log('Reservas recorrentes criadas com IDs:', ids);
      }
    } catch (error) {
      console.error('Erro ao criar reserva:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Sistema de Reservas Avançado - Teste</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
          <p className="text-red-800">Erro: {error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulário de reserva */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Criar Nova Reserva</h2>
          <AdvancedReservationForm 
            onSubmit={handleReservationSubmit}
            isLoading={loading}
          />
        </div>
        
        {/* Lista de reservas */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Reservas Existentes</h2>
          {loading ? (
            <p>Carregando reservas...</p>
          ) : (
            <div className="space-y-2">
              {reservations.length === 0 ? (
                <p className="text-gray-500">Nenhuma reserva encontrada</p>
              ) : (
                reservations.map((reservation) => (
                  <div key={reservation.id} className="border p-3 rounded">
                    <p><strong>Professor:</strong> {reservation.userName}</p>
                    <p><strong>Email:</strong> {reservation.userEmail}</p>
                    <p><strong>Disciplina:</strong> {reservation.subject}</p>
                    <p><strong>Status:</strong> {reservation.status}</p>
                    <p><strong>Datas:</strong> {reservation.dates?.join(', ')}</p>
                    <p><strong>Horários:</strong> {reservation.timeSlots?.join(', ')}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
