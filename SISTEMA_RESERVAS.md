# 📚 Sistema de Reservas do Laboratório UEFS

## 🎯 Visão Geral

O Sistema de Reservas permite que estudantes e professores solicitem o uso do laboratório de computação, com aprovação administrativa. O sistema é integrado ao cronograma oficial da universidade e garante o controle adequado dos recursos.

## 👥 Tipos de Usuários e Permissões

### 👨‍🎓 Estudantes
- **Visualizar**: Todas as aulas confirmadas e horários livres
- **Solicitar**: Reservas de horário disponível
- **Acompanhar**: Status das suas solicitações (Pendente/Aprovada/Rejeitada)

### 👩‍🏫 Professores  
- **Visualizar**: Disponibilidade do laboratório
- **Solicitar**: Reservas informando matéria e curso
- **Gerenciar**: Suas próprias reservas aprovadas

### 👨‍💼 Administradores
- **Aprovar/Rejeitar**: Solicitações de reserva
- **Notificações**: Alertas de novas solicitações
- **Gerenciar**: Ajustar horários e reservas
- **Monitorar**: Histórico completo de atividades

## 📅 Horários de Funcionamento

Baseado no arquivo `cronograma_laboratorio_2025-2_Version2.xlsx`:

### 📊 Horários Regulares
- **Segunda a Quinta**: 12:00 - 18:00 (6 horas/dia)
- **Sexta-feira**: 08:00 - 14:00 (6 horas/dia)
- **Fins de semana**: Fechado

### 🎪 Feriados e Exceções
- **07/09/2025**: Independência do Brasil (Fechado)
- **12/10/2025**: Padroeira do Brasil (Fechado)
- **28/10/2025**: Dia do Servidor Público (Fechado)
- **02/11/2025**: Finados (Fechado)
- **15/11/2025**: Proclamação da República (Fechado)
- **20/11/2025**: Consciência Negra (Fechado)

## 🔄 Fluxo de Reservas

### 📝 1. Solicitação de Reserva

#### Para Estudantes:
```
1. Acessar aba "Aulas e Horários"
2. Selecionar data desejada
3. Clicar em horário livre (verde)
4. Preencher formulário:
   - Email institucional (@uefs.br)
   - Nome completo
   - Observações (opcional)
5. Enviar solicitação
```

#### Para Professores:
```
1. Acessar aba "Aulas e Horários"
2. Selecionar data desejada
3. Clicar em horário livre (verde)
4. Preencher formulário:
   - Email institucional (@uefs.br)
   - Nome completo
   - Nome da matéria *
   - Nome do curso *
   - Observações (opcional)
5. Enviar solicitação
```

### ✅ 2. Processo de Aprovação

#### Administrador recebe notificação:
```
1. Acesso ao Painel Admin
2. Aba "Gerenciar Reservas"
3. Visualizar detalhes da solicitação
4. Aprovar ou Rejeitar com motivo
5. Usuário é notificado automaticamente
```

### 📊 3. Estados da Reserva

| Status | Descrição | Ações Disponíveis |
|--------|-----------|-------------------|
| 🟡 **Pendente** | Aguardando aprovação | Admin pode aprovar/rejeitar |
| 🟢 **Aprovada** | Confirmada pelo admin | Horário reservado no calendário |
| 🔴 **Rejeitada** | Negada com motivo | Usuário pode fazer nova solicitação |

## 🎨 Interface do Usuário

### 🌈 Código de Cores

- **🟢 Verde**: Horário livre/disponível
- **🔴 Vermelho**: Aula confirmada/ocupado
- **🟡 Amarelo**: Reserva pendente
- **⚫ Cinza**: Horário indisponível/feriado

### 📱 Componentes Principais

#### `ClassScheduleView`
- Calendário interativo com horários
- Visualização de aulas confirmadas
- Formulário de nova reserva
- Legenda explicativa

#### `ReservationForm`
- Validação de email institucional
- Campos específicos por tipo de usuário
- Cálculo automático de horário de fim
- Integração com horários disponíveis

#### `AdminReservationManager`
- Lista de todas as reservas
- Filtros por data, status, usuário
- Ações de aprovação/rejeição
- Sistema de notificações

## 🔧 Configuração Técnica

### 📊 Estrutura de Dados

```typescript
interface Reservation {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  userType: 'student' | 'professor';
  
  // Específico para professores
  subject?: string; // Nome da matéria
  course?: string;  // Nome do curso
  
  // Dados da reserva
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  
  // Status e controle
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  
  // Aprovação administrativa
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  
  observations?: string;
}
```

### 🔐 Regras de Segurança (Firestore)

```javascript
// Reservations - students and professors can create, admins manage all
match /reservations/{document} {
  allow read: if isAuthenticated();
  allow create: if isAuthenticated();
  allow update: if isAdmin() || 
    (isAuthenticated() && resource.data.userId == request.auth.uid && resource.data.status == 'pending');
  allow delete: if isAdmin();
}
```

### ⚙️ Validações Implementadas

#### Email Institucional:
- `@uefs.br` (geral)
- `@aluno.uefs.br` (estudantes)
- `@docente.uefs.br` (professores)

#### Horários:
- Apenas horários de funcionamento
- Verificação de disponibilidade
- Duração mínima: 1 hora
- Não permite sobreposição

## 📈 Benefícios do Sistema

### 🚀 Para Usuários
- **Transparência**: Visibilidade completa da agenda
- **Praticidade**: Solicitação online 24/7
- **Feedback**: Status em tempo real
- **Organização**: Planejamento antecipado

### 💼 Para Administração
- **Controle**: Aprovação manual de reservas
- **Auditoria**: Histórico completo de atividades
- **Notificações**: Alertas automáticos
- **Relatórios**: Estatísticas de uso

### 🏫 Para a Universidade
- **Eficiência**: Melhor utilização dos recursos
- **Digitalização**: Redução de processos manuais
- **Acessibilidade**: Interface responsiva
- **Integração**: Compatível com cronograma oficial

## 🔍 Monitoramento e Métricas

### 📊 Dados Coletados
- Número de reservas por período
- Taxa de aprovação/rejeição
- Horários mais solicitados
- Usuários mais ativos
- Motivos de rejeição

### 🎯 KPIs do Sistema
- **Taxa de Ocupação**: % de horários utilizados
- **Tempo de Resposta**: Média de aprovação de reservas
- **Satisfação**: Taxa de reservas aprovadas
- **Utilização**: Horários por tipo de usuário

## 🛠️ Comandos de Desenvolvimento

### 🚀 Executar o Sistema
```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Deploy para Firebase
firebase deploy
```

### 🧪 Testes
```bash
# Executar testes
npm run test

# Testes com cobertura
npm run test:coverage
```

## 📞 Suporte e Contato

### 🔧 Problemas Técnicos
- **GitHub Issues**: [Reportar Bug](https://github.com/ElissonNadson/Sistema-de-Gerenciamento-do-Laboratorio-UEFS/issues)
- **Email**: Suporte técnico via GitHub

### 🎓 Suporte Acadêmico
- **Universidade**: UEFS - Universidade Estadual de Feira de Santana
- **Departamento**: Computação
- **Laboratório**: Laboratório de Computação

---

## 🎉 Conclusão

O Sistema de Reservas do Laboratório UEFS moderniza e automatiza o processo de agendamento, proporcionando:

- ✅ **Maior controle** sobre o uso dos recursos
- ✅ **Transparência** nas informações
- ✅ **Eficiência** nos processos administrativos
- ✅ **Melhor experiência** para usuários

**Desenvolvido com ❤️ para a comunidade acadêmica da UEFS**
