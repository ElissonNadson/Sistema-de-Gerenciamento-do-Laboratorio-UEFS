# Sistema de Gerenciamento do Laboratório de Computação - UEFS

Sistema web completo para gerenciar e exibir horários do laboratório de computação da UEFS, com painel administrativo para alterações em tempo real.

## 🚀 Tecnologias Utilizadas

- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** + **Shadcn UI**
- **Firebase** (Hosting + Firestore + Auth)
- **Lucide React** (ícones)

## 📱 Funcionalidades

### Página Principal (Pública)
- ✅ Header com logo UEFS e status atual em tempo real
- ✅ Grid responsivo mostrando horários da semana
- ✅ Indicador visual do dia atual
- ✅ Status: Aberto (🟢) / Fechado (🔴) / Manutenção (🟡)
- ✅ Banner de avisos especiais (quando houver)
- ✅ Informações de contato do laboratório

### Sistema de Horários
- ✅ Segunda a Quinta: 12:00 - 18:00
- ✅ Sexta: 08:00 - 14:00
- ✅ Véspera de feriado: 08:00 - 14:00
- ✅ Sábado/Domingo: Fechado
- ✅ Feriados: Fechado

### Painel Administrativo
- ✅ Login protegido por senha (Firebase Auth)
- ✅ Alterar status (Aberto/Fechado/Manutenção)
- ✅ Criar avisos especiais urgentes
- ✅ Modificar horários pontuais
- ✅ Histórico de alterações
- ✅ Botão flutuante para acesso rápido

## ⚙️ Configuração e Instalação

### 1. Clone o repositório
```bash
git clone https://github.com/ElissonNadson/Sistema-de-Gerenciamento-do-Laboratorio-UEFS.git
cd Sistema-de-Gerenciamento-do-Laboratorio-UEFS
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o Firebase
1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ative o **Firestore Database** e **Authentication**
3. Configure Authentication para usar Email/Password
4. Copie `.env.example` para `.env` e preencha com suas credenciais:

```bash
cp .env.example .env
```

Edite o arquivo `.env`:
```env
VITE_FIREBASE_API_KEY=sua_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=seu_auth_domain_aqui
VITE_FIREBASE_PROJECT_ID=seu_project_id_aqui
VITE_FIREBASE_STORAGE_BUCKET=seu_storage_bucket_aqui
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id_aqui
VITE_FIREBASE_APP_ID=seu_app_id_aqui
```

### 4. Configure dados iniciais no Firestore
Crie uma collection `lab` com documento `config`:

```json
{
  "status": "open",
  "specialAlert": "",
  "schedule": {
    "monday": {"start": "12:00", "end": "18:00", "active": true},
    "tuesday": {"start": "12:00", "end": "18:00", "active": true},
    "wednesday": {"start": "12:00", "end": "18:00", "active": true},
    "thursday": {"start": "12:00", "end": "18:00", "active": true},
    "friday": {"start": "08:00", "end": "14:00", "active": true},
    "saturday": {"start": "", "end": "", "active": false},
    "sunday": {"start": "", "end": "", "active": false}
  },
  "lastUpdate": "2025-08-02T03:02:51Z"
}
```

### 5. Configure usuário administrativo
No Firebase Console > Authentication, crie um usuário com email/senha para acesso admin.

## 🚀 Comandos Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Lint do código
npm run lint

# Visualizar build
npm run preview

# Deploy para Firebase (único comando)
npm run deploy
```

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── dashboard/
│   │   ├── ScheduleGrid.tsx
│   │   ├── StatusIndicator.tsx
│   │   └── AlertBanner.tsx
│   ├── admin/
│   │   ├── AdminPanel.tsx
│   │   ├── LoginModal.tsx
│   │   └── ScheduleEditor.tsx
│   └── ui/ (Shadcn components)
├── hooks/
│   ├── useLabData.ts
│   ├── useAuth.ts
│   └── useRealTimeStatus.ts
├── firebase/
│   └── config.ts
├── types/
│   └── lab.ts
├── lib/
│   ├── utils.ts
│   └── timeUtils.ts
├── App.tsx
└── main.tsx
```

## 🔒 Segurança

- Regras do Firestore configuradas para permitir leitura pública dos horários
- Escrita protegida por autenticação
- Painel administrativo protegido por login

## 📱 Responsividade

- Design mobile-first
- Funciona perfeitamente em desktop, tablet e mobile
- Componentes responsivos usando Tailwind CSS

## 🎨 Design

- Cores da UEFS (azul/roxo)
- Interface moderna e intuitiva
- Animações suaves
- Componentes acessíveis

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

Desenvolvido para a **Universidade Estadual de Feira de Santana - UEFS**
