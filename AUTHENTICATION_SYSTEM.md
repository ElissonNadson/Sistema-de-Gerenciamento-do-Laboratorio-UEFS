# Sistema de Autenticação Completo - UEFS Lab Management

## 📋 Visão Geral

Este documento descreve o sistema de autenticação completo implementado para o Sistema de Gerenciamento do Laboratório UEFS. O sistema integra Firebase Authentication com Firestore para fornecer uma solução robusta de autenticação e autorização.

## 🏗️ Arquitetura do Sistema

### Componentes Principais

#### 1. **Tipos e Interfaces** (`src/types/auth.types.ts`)
- `UserProfile`: Perfil completo do usuário no Firestore
- `AuthUser`: Usuário autenticado com informações do Firebase Auth + perfil
- `LoginCredentials`: Credenciais de login (email/senha)
- `RegisterCredentials`: Dados de registro (nome, email, senha, tipo de usuário)
- `AuthResult`: Resultado das operações de autenticação
- `AuthContextType`: Interface do contexto de autenticação

#### 2. **Contexto de Autenticação** (`src/contexts/AuthContext.tsx`)
- **Estado Global**: Gerencia o estado do usuário autenticado
- **Operações**: Login, registro, logout, recuperação de senha, atualização de perfil
- **Integração Firestore**: Sincronização automática entre Firebase Auth e Firestore
- **Persistência**: Mantém o estado de autenticação entre sessões

#### 3. **Componentes de Interface**

##### **LoginForm** (`src/components/auth/LoginForm.tsx`)
- Campo de email com validação
- Campo de senha com toggle show/hide
- Link para recuperação de senha
- Botão para criar nova conta
- Validação de formulário em tempo real

##### **RegisterForm** (`src/components/auth/RegisterForm.tsx`)
- Nome completo (obrigatório)
- Email com validação de formato
- Seleção de tipo de usuário: "Aluno" ou "Administrador"
- Senha com validação de força (mínimo 6 caracteres)
- Confirmação de senha
- Validação completa do formulário

##### **AuthModal** (`src/components/auth/AuthModal.tsx`)
- Modal unificado para login e registro
- Transição suave entre modos
- Botão de fechamento
- Gerenciamento de estado de loading

##### **ProtectedRoute** (`src/components/auth/ProtectedRoute.tsx`)
- Proteção de rotas baseada em autenticação
- Verificação de roles específicos (admin/aluno)
- Telas de loading e erro apropriadas
- Redirecionamento automático

#### 4. **Integração com Firebase**

##### **Firebase Configuration** (`src/firebase/config.ts`)
- Configuração do Firebase Auth
- Configuração do Firestore
- Configuração do Storage e Analytics

##### **Firestore Structure**
```
/usuarios/{uid}
├── uid: string
├── email: string
├── nome: string
├── tipoUsuario: 'aluno' | 'administrador'
├── criadoEm: timestamp
├── ativo: boolean
└── photoURL?: string
```

## 🔒 Segurança e Regras do Firestore

### Regras de Segurança (`firestore.rules`)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
        get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.tipoUsuario == 'administrador';
    }
    
    // Public read access to lab configuration
    match /lab/config {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // User profile documents
    match /usuarios/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if isAdmin();
    }
    
    // Laboratory management
    match /laboratorios/{document} {
      allow read: if request.auth != null;
      allow write: if isAdmin();
    }
    
    // Schedule management
    match /horarios/{document} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (resource.data.professorId == request.auth.uid || isAdmin());
    }
  }
}
```

## 🎯 Funcionalidades Implementadas

### ✅ Autenticação
- [x] **Login com email/senha**
- [x] **Registro de novos usuários**
- [x] **Recuperação de senha via email**
- [x] **Logout**
- [x] **Persistência de sessão**

### ✅ Autorização
- [x] **Dois tipos de usuário**: Aluno e Administrador
- [x] **Proteção de rotas baseada em roles**
- [x] **Controle de acesso granular**

### ✅ Gerenciamento de Usuário
- [x] **Perfis de usuário no Firestore**
- [x] **Atualização de perfil**
- [x] **Validação de dados**

### ✅ Interface de Usuário
- [x] **Design responsivo**
- [x] **Validação de formulários em tempo real**
- [x] **Feedback visual (loading, erros, sucesso)**
- [x] **Navegação intuitiva entre modos**

## 🚀 Como Usar

### Para Usuários Finais

#### 1. **Acessar o Sistema**
- Visite a página principal do laboratório
- Clique no botão de configurações (⚙️) no canto inferior direito

#### 2. **Criar Nova Conta**
1. No modal de login, clique em "Criar Conta"
2. Preencha todos os campos obrigatórios:
   - Nome completo
   - Email válido
   - Tipo de usuário (Aluno/Administrador)
   - Senha (mínimo 6 caracteres)
   - Confirmação de senha
3. Clique em "Criar Conta"

#### 3. **Fazer Login**
1. Digite seu email e senha
2. Clique em "Entrar"
3. Se for administrador, terá acesso ao painel administrativo

#### 4. **Recuperar Senha**
1. No modal de login, clique em "Esqueceu a senha?"
2. Digite seu email
3. Verifique sua caixa de entrada para as instruções

### Para Desenvolvedores

#### 1. **Usar o Hook de Autenticação**
```typescript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, login, logout, register, loading } = useAuth();
  
  // user.profile?.tipoUsuario para verificar role
  // user.profile?.nome para nome do usuário
}
```

#### 2. **Proteger Rotas**
```typescript
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

function AdminOnlyPage() {
  return (
    <ProtectedRoute requiredRole="administrador">
      <AdminContent />
    </ProtectedRoute>
  );
}
```

#### 3. **Usar o Modal de Autenticação**
```typescript
import { AuthModal } from '../components/auth/AuthModal';

function MyComponent() {
  const [showAuth, setShowAuth] = useState(false);
  
  return (
    <AuthModal
      isOpen={showAuth}
      onClose={() => setShowAuth(false)}
      onSuccess={() => {/* Handle success */}}
      defaultMode="login" // or "register"
    />
  );
}
```

## 🔧 Configuração Técnica

### Dependências Necessárias
```json
{
  "firebase": "^12.0.0",
  "react": "^19.1.0"
}
```

### Variáveis de Ambiente
O sistema usa a configuração Firebase diretamente no código. Para produção, considere usar variáveis de ambiente:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
```

## 📁 Estrutura de Arquivos

```
src/
├── components/
│   ├── auth/
│   │   ├── AuthModal.tsx          # Modal unificado
│   │   ├── LoginForm.tsx          # Formulário de login
│   │   ├── RegisterForm.tsx       # Formulário de registro
│   │   └── ProtectedRoute.tsx     # Proteção de rotas
│   └── ui/
│       └── select.tsx             # Componente Select customizado
├── contexts/
│   └── AuthContext.tsx            # Contexto de autenticação
├── hooks/
│   └── useAuthNew.ts              # Hook de autenticação
├── types/
│   └── auth.types.ts              # Tipos TypeScript
└── firebase/
    └── config.ts                  # Configuração Firebase
```

## 🎨 Design System

### Cores e Estilos
- **Primária**: `uefs-primary` (azul UEFS)
- **Secundária**: `uefs-dark` (azul escuro)
- **Sucesso**: Verde
- **Erro**: Vermelho
- **Cinza**: `uefs-gray-*` para textos e backgrounds

### Componentes UI
- Formulários responsivos com validação visual
- Botões com estados de loading
- Modais com overlay e animações suaves
- Indicadores de status do usuário

## 🔮 Próximos Passos

### Funcionalidades Futuras
- [ ] **Autenticação OAuth** (Google, Facebook)
- [ ] **Verificação de email** obrigatória
- [ ] **Duas etapas de autenticação** (2FA)
- [ ] **Logs de auditoria** para ações administrativas
- [ ] **Perfis de usuário** mais detalhados
- [ ] **Gerenciamento de sessões** ativas

### Melhorias
- [ ] **Testes automatizados** para componentes de autenticação
- [ ] **Integração com sistema de notificações**
- [ ] **Cache de dados** do usuário
- [ ] **Internacionalização** (i18n)

## 📞 Suporte

Para dúvidas sobre o sistema de autenticação:
- **Email**: lab.computacao@uefs.br
- **Documentação**: Este arquivo
- **Código**: Comentários inline nos arquivos

---

**Desenvolvido para a Universidade Estadual de Feira de Santana (UEFS)**  
Sistema de Gerenciamento do Laboratório de Computação  
© 2025 UEFS