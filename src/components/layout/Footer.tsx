export function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Contato</h3>
            <div className="space-y-2 text-gray-300">
              <p>📧 lab.computacao@uefs.br</p>
              <p>📞 (75) 3161-8000</p>
              <p>📍 Campus Universitário, Km 03, BR-116</p>
              <p>Feira de Santana - BA</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Horários de Funcionamento</h3>
            <div className="space-y-1 text-gray-300 text-sm">
              <p>Segunda a Quinta: 12:00 - 18:00</p>
              <p>Sexta-feira: 08:00 - 14:00</p>
              <p>Sábado e Domingo: Fechado</p>
              <p>Feriados: Fechado</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Sobre</h3>
            <p className="text-gray-300 text-sm">
              Sistema de gerenciamento e monitoramento em tempo real 
              do Laboratório de Computação da UEFS. 
              Desenvolvido para facilitar o acesso às informações 
              de funcionamento e status do laboratório.
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-6 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; 2025 Universidade Estadual de Feira de Santana - UEFS</p>
          <p>Sistema de Gerenciamento do Laboratório de Computação</p>
        </div>
      </div>
    </footer>
  );
}