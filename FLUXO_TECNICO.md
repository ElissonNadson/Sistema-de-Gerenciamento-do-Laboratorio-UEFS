# 🔧 Fluxo Técnico - Arquitetura do Sistema

## 🏗️ **Arquitetura de Componentes**

```
📁 ESTRUTURA PRINCIPAL
│
├─➤ 🌐 main.tsx
│   ├─ Router configurado
│   ├─ AuthProvider wrapper
│   └─ CSS global (sem animações)
│
├─➤ 📍 Router.tsx
│   ├─ PublicRoute: "/" → PublicDashboard
│   ├─ PrivateRoute: "/admin" → AdminDashboard  
│   └─ Proteção baseada em isAdmin
│
└─➤ 🏠 PublicDashboard.tsx (COMPONENTE PRINCIPAL)
    │
    ├─ 🎯 SEÇÃO 1: VISÃO GERAL
    │   ├─ ModernCalendar
    │   └─ ScheduleGrid
    │
    ├─ 🎯 SEÇÃO 2: AULAS E HORÁRIOS
    │   └─ ClassScheduleView
    │       └─ [SE LOGADO] AdvancedReservationForm
    │
    ├─ 🔘 FLOATING BUTTONS
    │   ├─ UserCard (se logado)
    │   └─ AdminButton
    │
    └─ 📱 MODAIS
        └─ AuthModal (login/register)
```

## 🔗 **Fluxo de Hooks e Contextos**

```
⚡ GERENCIAMENTO DE ESTADO
│
├─➤ 🔐 AuthContext.tsx
│   ├─ user: User | null
│   ├─ isAdmin: boolean
│   ├─ loading: boolean
│   └─ signOut: () => void
│
├─➤ 🪝 CUSTOM HOOKS
│   │
│   ├─ 👤 useAuth.ts
│   │   ├─ Consume AuthContext
│   │   ├─ onAuthStateChanged listener
│   │   └─ Profile fetch from Firestore
│   │
│   ├─ 📅 useLabData.ts
│   │   ├─ getDailySchedules()
│   │   ├─ Estado: availableDays[]
│   │   └─ Para ModernCalendar
│   │
│   ├─ 🕐 useDailySchedules.ts
│   │   ├─ Real-time listener específico dia
│   │   ├─ Estado: schedule | null
│   │   └─ Para ScheduleGrid
│   │
│   ├─ 📝 useReservations.ts
│   │   ├─ getUserReservations()
│   │   ├─ createReservation()
│   │   ├─ createRecurringReservations()
│   │   └─ Para formulários
│   │
│   └─ 🔴 useRealTimeStatus.ts
│       ├─ onSnapshot global do lab
│       ├─ isOpen: boolean calculado
│       └─ Para StatusIndicator
│
└─➤ 📊 FIREBASE OPERATIONS
    ├─ config.ts - Configuração
    ├─ Collections: users, dailySchedules, reservations
    └─ Real-time listeners otimizados
```

## 🎨 **Fluxo de Estilos (CSS)**

```
🎨 SISTEMA DE ESTILOS
│
├─➤ 🌈 tailwind.config.js
│   ├─ Cores UEFS (azul, dourado)
│   ├─ Breakpoints responsivos
│   └─ Componentes customizados
│
├─➤ 🎯 index.css
│   ├─ ❌ ANIMAÇÕES REMOVIDAS
│   │   ├─ transition: none !important
│   │   ├─ transform: none !important
│   │   └─ animation: none !important
│   │
│   ├─ 🎨 TEMA UEFS
│   │   ├─ --primary: Azul UEFS
│   │   ├─ --secondary: Dourado UEFS
│   │   └─ Gradientes customizados
│   │
│   └─ 📐 NORMALIZAÇÃO
│       ├─ min-h-16 para botões
│       ├─ text-sm para textos
│       └─ Padding/margin padronizados
│
└─➤ 📱 COMPONENTES UI
    ├─ ui/button.tsx - Botões padronizados
    ├─ ui/card.tsx - Cards consistentes
    ├─ ui/input.tsx - Inputs validados
    └─ ui/select.tsx - Selects customizados
```

## 🔄 **Fluxo de Dados Firebase**

```
🔥 FIREBASE FLOW
│
├─➤ 📖 READ OPERATIONS
│   │
│   ├─ 📅 ModernCalendar
│   │   ├─ useLabData() 
│   │   ├─ collection("dailySchedules")
│   │   ├─ where("isAvailable", "==", true)
│   │   └─ orderBy("date")
│   │
│   ├─ 🕐 ScheduleGrid  
│   │   ├─ useDailySchedules(selectedDate)
│   │   ├─ doc("dailySchedules", dateId)
│   │   └─ onSnapshot real-time
│   │
│   ├─ 📝 ClassScheduleView
│   │   ├─ useReservations()
│   │   ├─ collection("reservations")
│   │   ├─ where("userId", "==", user.uid)
│   │   └─ orderBy("createdAt", "desc")
│   │
│   └─ ⚡ StatusIndicator
│       ├─ useRealTimeStatus()
│       ├─ doc("config", "general")
│       └─ onSnapshot para status global
│
├─➤ ✍️ WRITE OPERATIONS
│   │
│   ├─ 👤 AUTHENTICATION
│   │   ├─ signInWithEmailAndPassword()
│   │   ├─ createUserWithEmailAndPassword()
│   │   └─ setDoc(profiles/{uid})
│   │
│   ├─ 📝 RESERVAS SIMPLES
│   │   ├─ addDoc("reservations", {...})
│   │   ├─ status: "pending"
│   │   └─ Trigger: notificação admin
│   │
│   ├─ 🔄 RESERVAS RECORRENTES
│   │   ├─ writeBatch() para múltiplas
│   │   ├─ Loop: cada semana do semestre
│   │   └─ Atomic operation
│   │
│   └─ ⚙️ ADMIN OPERATIONS (AdminDashboard)
│       ├─ updateDoc() status reservas
│       ├─ setDoc() dailySchedules
│       └─ deleteDoc() cancelamentos
│
└─➤ 🔒 SECURITY RULES
    ├─ users: only own profile
    ├─ reservations: create if authenticated
    ├─ dailySchedules: read all, write admin
    └─ config: read all, write admin
```

## 📱 **Fluxo de Responsividade**

```
📱 BREAKPOINTS TAILWIND
│
├─➤ 📱 MOBILE (default)
│   ├─ Grid: 1 coluna
│   ├─ Calendário: compacto
│   ├─ Botões: full width
│   └─ Cards: stacked
│
├─➤ 💻 TABLET (md: 768px+)
│   ├─ Grid: 2 colunas
│   ├─ Sidebar: aparece
│   ├─ Calendário: expanded
│   └─ Forms: inline
│
└─➤ 🖥️ DESKTOP (lg: 1024px+)
    ├─ Grid: 3 colunas quando possível
    ├─ Full layout horizontal
    ├─ Hover states (mas sem animação)
    └─ Floating buttons: canto inferior
```

## 🛠️ **Fluxo de Build e Deploy**

```
⚙️ DESENVOLVIMENTO
│
├─➤ 🔧 LOCAL DEV
│   ├─ npm run dev (Vite)
│   ├─ HMR ativo
│   ├─ TypeScript checking
│   └─ Firebase emulator (opcional)
│
├─➤ 🏗️ BUILD PRODUCTION
│   ├─ npm run build
│   ├─ TypeScript compilation
│   ├─ Vite bundling
│   └─ dist/ gerado
│
├─➤ 🚀 DEPLOY FIREBASE
│   ├─ firebase deploy --only hosting
│   ├─ Automatiza: build + upload
│   ├─ CDN global
│   └─ HTTPS automático
│
└─➤ 📋 CI/CD (futuro)
    ├─ GitHub Actions
    ├─ Auto-deploy main branch
    ├─ Tests automatizados
    └─ Rollback capability
```

## 🐛 **Fluxo de Debug**

```
🔍 DEBUGGING FLOW
│
├─➤ 🌐 BROWSER DEVTOOLS
│   ├─ React DevTools extension
│   ├─ Console.log estratégico
│   ├─ Network tab (Firebase calls)
│   └─ Performance tab
│
├─➤ 🔥 FIREBASE DEBUG
│   ├─ Firebase Console
│   ├─ Firestore debugging rules
│   ├─ Auth user management
│   └─ Real-time logs
│
├─➤ ⚡ VS CODE
│   ├─ TypeScript errors inline
│   ├─ ESLint warnings
│   ├─ Auto-formatting (Prettier)
│   └─ Git integration
│
└─➤ 🧪 ERROR HANDLING
    ├─ try/catch em operations
    ├─ Loading states
    ├─ Error boundaries (futuro)
    └─ User feedback toasts
```

## 📊 **Métricas e Performance**

```
📈 MONITORAMENTO
│
├─➤ ⚡ WEB VITALS
│   ├─ LCP: < 2.5s (sem animações)
│   ├─ FID: < 100ms
│   ├─ CLS: < 0.1
│   └─ Bundle size otimizado
│
├─➤ 🔥 FIREBASE USAGE
│   ├─ Reads: minimizados com cache
│   ├─ Writes: batch quando possível
│   ├─ Storage: imagens otimizadas
│   └─ Functions: apenas essenciais
│
└─➤ 👥 USER EXPERIENCE
    ├─ Tempo de login: < 1s
    ├─ Carregamento calendário: < 2s
    ├─ Submit reserva: < 3s
    └─ Real-time updates: instantâneo
```

## 🎯 **Próximos Passos Técnicos**

```
🚀 ROADMAP TÉCNICO
│
├─➤ 📱 PWA SETUP
│   ├─ Service Worker
│   ├─ Offline capability
│   ├─ Install prompt
│   └─ Push notifications
│
├─➤ 🧪 TESTING
│   ├─ Jest + Testing Library
│   ├─ Component tests
│   ├─ Integration tests
│   └─ E2E com Playwright
│
├─➤ 📊 ANALYTICS
│   ├─ Firebase Analytics
│   ├─ User behavior tracking
│   ├─ Error tracking (Sentry)
│   └─ Performance monitoring
│
└─➤ 🔒 SECURITY ENHANCEMENTS
    ├─ Rate limiting
    ├─ Content Security Policy
    ├─ CSRF protection
    └─ Input sanitization
```

**Sistema agora tem arquitetura limpa, performática e escalável!** 🏗️✨
