# 🔄 Fluxo do Sistema - Interface Simplificada

## 📊 **Fluxo Principal do Usuário**

```
🌐 USUÁRIO ACESSA O SITE
│
└─➤ CARREGA PublicDashboard.tsx
    │
    ├─➤ 🔍 VERIFICA STATUS DE LOGIN
    │   ├─ ✅ Logado: Mostra nome + botão sair
    │   └─ ❌ Não logado: Mostra apenas botão admin
    │
    ├─➤ 📋 SEÇÃO 1: VISÃO GERAL
    │   │
    │   ├─ 📅 ModernCalendar
    │   │   ├─ Busca dailySchedules do Firebase
    │   │   ├─ Mostra dias disponíveis
    │   │   └─ Permite seleção de data
    │   │
    │   └─ 🕐 ScheduleGrid  
    │       ├─ Mostra horários do dia selecionado
    │       ├─ Status: Aberto/Fechado/Ocupado
    │       └─ Informações de funcionamento
    │
    ├─➤ 📚 SEÇÃO 2: AULAS E HORÁRIOS
    │   │
    │   ├─ 🚪 VERIFICA LOGIN
    │   │   ├─ ❌ Não logado: Mostra aviso + botão login
    │   │   └─ ✅ Logado: Mostra sistema completo
    │   │
    │   └─ 📝 ClassScheduleView
    │       ├─ Lista aulas confirmadas
    │       ├─ Mostra horários disponíveis
    │       └─ [SE LOGADO] Formulário de reserva
    │
    └─➤ 🔘 BOTÕES FLUTUANTES
        ├─ 👤 Card Usuário (se logado)
        │   └─ Botão "Sair"
        │
        └─ ⚙️ Botão Admin
            ├─ Se logado admin: Vai direto /admin
            └─ Se não logado: Abre modal login
```

## 🎯 **Fluxos de Interação Específicos**

### **Fluxo 1: Usuário Não Logado**
```
🔴 USUÁRIO ANÔNIMO
│
├─➤ 👁️ VÊ TUDO (modo read-only)
│   ├─ Calendário funcionando
│   ├─ Grade de horários
│   └─ Lista de aulas (sem formulário)
│
├─➤ 💡 AVISO: "Faça login para reservas"
│
└─➤ 🔘 PODE FAZER LOGIN
    ├─ Clica "Fazer Login" → AuthModal
    ├─ Clica botão Admin → AuthModal  
    └─ Após login → Recarrega com permissões
```

### **Fluxo 2: Professor Logado**
```
🟢 PROFESSOR AUTENTICADO
│
├─➤ 👤 Card com nome + tipo de usuário
│
├─➤ 📝 ACESSO AO SISTEMA DE RESERVAS
│   ├─ Vê AdvancedReservationForm
│   ├─ Pode criar reservas:
│   │   ├─ Reserva única (data específica)
│   │   ├─ Reservas recorrentes (toda semana)
│   │   └─ Múltiplas datas específicas
│   │
│   └─ Submete → useReservations → Firebase
│       ├─ Status: "aguardando_department_confirmation"
│       └─ Notificação de sucesso
│
└─➤ 🔘 Botão Admin (se for admin também)
```

### **Fluxo 3: Administrador**
```
🔵 ADMIN AUTENTICADO  
│
├─➤ 👤 Card com "administrador"
│
├─➤ 📝 ACESSO COMPLETO AO SISTEMA
│   ├─ Pode fazer reservas como professor
│   └─ Vê todas as funcionalidades
│
└─➤ ⚙️ ACESSO AO PAINEL ADMIN
    │
    └─➤ /admin (AdminDashboard.tsx)
        ├─ ReservationManager
        ├─ DailyScheduleManager  
        ├─ ReservationNotifications
        └─ Controles administrativos
```

## 🔄 **Fluxo de Dados (Firebase)**

```
📊 DADOS FLUINDO
│
├─➤ 🔥 FIREBASE COLLECTIONS
│   │
│   ├─ 📅 dailySchedules
│   │   ├─ useLabData() → ModernCalendar
│   │   └─ useDailySchedules() → ScheduleGrid
│   │
│   ├─ 📝 reservations  
│   │   ├─ useReservations() → ClassScheduleView
│   │   └─ Estados: pending/approved/rejected
│   │
│   └─ 👥 users/profiles
│       └─ useAuth() → Verificação de permissões
│
├─➤ ⚡ REAL-TIME UPDATES
│   ├─ onSnapshot() monitora mudanças
│   ├─ Status atualiza automaticamente
│   └─ useRealTimeStatus() → StatusIndicator
│
└─➤ 📤 WRITE OPERATIONS
    ├─ createReservation() → Nova reserva
    ├─ createRecurringReservations() → Batch write
    └─ updateReservationStatus() → Admin aprova
```

## 🎨 **Fluxo Visual da Interface**

```
┌─────────────────────────────────────────┐
│  🔵 HEADER (sempre visível)              │
│  ├─ Logo UEFS                           │  
│  ├─ Status: 🟢 Aberto / 🔴 Fechado      │
│  └─ Informações básicas                 │
└─────────────────────────────────────────┘
│
├─ 🎨 HERO SECTION (compacto)
│   └─ "Laboratório de Computação - UEFS"
│
├─ 🚨 ALERTAS (se config.specialAlert)
│   └─ Banner de aviso importante
│
├─ 📊 SEÇÃO: VISÃO GERAL
│   ├─ ═══════════════════════════════════
│   ├─ 📅 Calendário │ 🕐 Grade Horários
│   └─ (sempre visível - sem abas)
│
├─ 📚 SEÇÃO: AULAS E HORÁRIOS  
│   ├─ ═══════════════════════════════════
│   ├─ [Aviso Login] (se não logado)
│   └─ 📝 Sistema de Reservas
│
├─ 📄 FOOTER (simplificado)
│   └─ Contato + Horários essenciais
│
└─ 🔘 BOTÕES FLUTUANTES (canto inferior)
    ├─ 👤 [Nome Usuário] [Sair]
    └─ ⚙️ [Admin]
```

## ⚡ **Fluxo de Performance**

```
🚀 CARREGAMENTO OTIMIZADO
│
├─➤ 🎯 SEM ANIMAÇÕES
│   ├─ Zero transition CSS
│   ├─ Sem hover effects
│   └─ Renderização mais rápida
│
├─➤ 📦 COMPONENTES SIMPLES
│   ├─ Sem lazy loading desnecessário
│   ├─ Props diretas entre componentes
│   └─ Estado local quando possível
│
└─➤ 🔥 FIREBASE OTIMIZADO
    ├─ onSnapshot apenas onde necessário
    ├─ Queries específicas (não full scan)
    └─ Cache local automático
```

## 🛡️ **Fluxo de Segurança**

```
🔐 CONTROLE DE ACESSO
│
├─➤ 🚪 NÍVEIS DE PERMISSÃO
│   ├─ Anônimo: Read-only
│   ├─ Professor: Read + Create reservations
│   └─ Admin: Full access
│
├─➤ 🛡️ VALIDAÇÕES
│   ├─ Email @uefs.br obrigatório
│   ├─ Firebase Auth verificação
│   └─ Regras Firestore server-side
│
└─➤ 🔍 VERIFICAÇÕES EM TEMPO REAL
    ├─ useAuth() monitora estado
    ├─ ProtectedRoute no /admin
    └─ Componentes condicionais baseados em user
```

## 📋 **Resumo do Fluxo Atual**

### **✅ Interface Simplificada:**
1. **Uma página** com todas as informações
2. **Seções separadas** visualmente 
3. **Sem navegação complexa** de abas
4. **Acesso baseado em login** (gradual)

### **✅ Funcionalidades por Usuário:**
- **Visitante**: Vê calendário + horários
- **Professor**: + Sistema de reservas
- **Admin**: + Painel administrativo

### **✅ Fluxo de Dados Direto:**
- **Firebase → Hooks → Componentes**
- **Atualizações em tempo real**
- **Operações batch para eficiência**

**A interface agora tem um fluxo linear, claro e sem distrações!** 🎯
