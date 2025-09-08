export function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Contato</h3>
            <div className="space-y-2 text-gray-300 text-sm">
              <p>📧 lab.computacao@uefs.br</p>
              <p>📞 (75) 3161-8000</p>
              <p>📍 Campus Universitário, Feira de Santana - BA</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Horários</h3>
            <div className="space-y-1 text-gray-300 text-sm">
              <p>Segunda a Quinta: 12:00 - 18:00</p>
              <p>Sexta-feira: 08:00 - 14:00</p>
              <p>Finais de semana: Fechado</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-4 pt-4 text-center text-gray-400 text-xs">
          <p>&copy; 2025 UEFS - Sistema de Gerenciamento do Laboratório de Computação</p>
        </div>
      </div>
    </footer>
  );
}