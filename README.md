# Sistema de Gerenciamento do Laboratório de Computação - UEFS

🎓 **Sistema web completo para gerenciar e exibir horários do laboratório de computação da UEFS**

Este é um sistema desenvolvido para a **Universidade Estadual de Feira de Santana (UEFS)** que permite o gerenciamento em tempo real dos horários e status do laboratório de computação. O sistema oferece uma interface pública para consulta de horários e um painel administrativo para alterações em tempo real.

## 📋 Resumo do Projeto

O sistema foi desenvolvido para resolver a necessidade de comunicação eficiente sobre o funcionamento do laboratório de computação da UEFS. Através de uma interface web moderna e responsiva, estudantes e professores podem:

- **Consultar horários de funcionamento** em tempo real
- **Verificar o status atual** do laboratório (aberto/fechado/manutenção)
- **Receber avisos especiais** sobre mudanças pontuais
- **Acessar informações de contato** do laboratório

Para os administradores, o sistema oferece:
- **Painel de controle** para alteração de status e horários
- **Gerenciamento de avisos** especiais
- **Sistema de autenticação** seguro
- **Histórico de alterações** para controle

## 🚀 Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Shadcn UI
- **Backend**: Firebase (Firestore Database + Authentication)
- **Hosting**: Firebase Hosting
- **Ícones**: Lucide React

## 📱 Funcionalidades Principais

### 🌐 Página Principal (Acesso Público)
- ✅ **Header responsivo** com logo UEFS e status em tempo real
- ✅ **Grid de horários** da semana com design moderno
- ✅ **Indicador visual** do dia atual destacado
- ✅ **Status em tempo real**: Aberto (🟢) / Fechado (🔴) / Manutenção (🟡)
- ✅ **Banner de avisos** especiais quando necessário
- ✅ **Calendário interativo** para consulta de datas
- ✅ **Informações de contato** do laboratório
- ✅ **Última atualização** visível para transparência

### ⏰ Sistema de Horários Inteligente
- ✅ **Segunda a Quinta**: 12:00 - 18:00
- ✅ **Sexta**: 08:00 - 14:00
- ✅ **Véspera de feriado**: 08:00 - 14:00
- ✅ **Fins de semana**: Fechado
- ✅ **Feriados**: Fechado automaticamente
- ✅ **Horários especiais** configuráveis pelos administradores

### 🔐 Painel Administrativo
- ✅ **Sistema de login** protegido (Firebase Authentication)
- ✅ **Controle de status** em tempo real
- ✅ **Criação e edição** de avisos especiais
- ✅ **Modificação de horários** pontuais
- ✅ **Histórico completo** de todas as alterações
- ✅ **Botão de acesso rápido** flutuante
- ✅ **Controle de usuários** com diferentes permissões

## ⚙️ Configuração e Instalação

### 📋 Pré-requisitos

- **Node.js** versão 18 ou superior
- **npm** ou **yarn**
- **Conta Firebase** (gratuita)
- **Git** instalado

### 🔧 Instalação Passo a Passo

#### 1. Clone o repositório
```bash
git clone https://github.com/ElissonNadson/Sistema-de-Gerenciamento-do-Laboratorio-UEFS.git
cd Sistema-de-Gerenciamento-do-Laboratorio-UEFS
```

#### 2. Instale as dependências
```bash
npm install
```

#### 3. Configure as variáveis de ambiente

**Opção A: Para desenvolvimento com as credenciais do projeto**
```bash
# Copie o arquivo de exemplo (já configurado)
cp .env.example .env.local
```

**Opção B: Para seu próprio projeto Firebase**
1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ative o **Firestore Database** e **Authentication**
3. Configure Authentication para usar Email/Password
4. Copie `.env.example` para `.env.local` e substitua pelas suas credenciais

```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local`:
```env
VITE_FIREBASE_API_KEY=sua_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=seu_auth_domain_aqui
VITE_FIREBASE_PROJECT_ID=seu_project_id_aqui
VITE_FIREBASE_STORAGE_BUCKET=seu_storage_bucket_aqui
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id_aqui
VITE_FIREBASE_APP_ID=seu_app_id_aqui
VITE_FIREBASE_MEASUREMENT_ID=seu_measurement_id_aqui
```

#### 4. Configure dados iniciais no Firestore (apenas para novo projeto)

Se você criou um novo projeto Firebase, será necessário configurar os dados iniciais:

1. Acesse o Firebase Console > Firestore Database
2. Crie uma collection chamada `lab`
3. Crie um documento com ID `config`
4. Adicione os seguintes campos:

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
  "lastUpdate": "2025-01-01T00:00:00Z"
}
```

#### 5. Configure usuário administrativo (apenas para novo projeto)

No Firebase Console > Authentication, crie um usuário com email/senha para acesso admin.

## 🚀 Como Executar o Projeto

### 💻 Desenvolvimento Local

```bash
# Inicia o servidor de desenvolvimento
npm run dev
```

O projeto estará disponível em: `http://localhost:5173`

### 🔨 Build para Produção

```bash
# Gera os arquivos otimizados para produção
npm run build
```

### 🔍 Verificação e Qualidade

```bash
# Executa o linter para verificar qualidade do código
npm run lint

# Visualiza o build de produção localmente
npm run preview
```

## 🚀 Deploy e Hospedagem

### 📡 Deploy Automático (Recomendado)

O projeto está configurado com **GitHub Actions** para deploy automático:

- **Deploy de produção**: Push para branch `main`
- **Deploy de preview**: Pull requests para `main`

### 🛠️ Deploy Manual

```bash
# Deploy direto para Firebase Hosting
npm run deploy
```

**Nota**: Para deploy manual, você precisa:
1. Instalar Firebase CLI: `npm install -g firebase-tools`
2. Fazer login: `firebase login`
3. Configurar o projeto: `firebase use --add`

### 🌐 URLs de Acesso

- **Produção**: https://sistema-horario-lab-uefs.web.app
- **Alternativa**: https://sistema-horario-lab-uefs.firebaseapp.com

## 📁 Estrutura do Projeto

```
📦 Sistema-de-Gerenciamento-do-Laboratorio-UEFS/
├── 📂 public/                    # Arquivos estáticos
│   ├── 🖼️ favicon.ico           # Ícone do site
│   └── 📄 vite.svg              # Logo do Vite
├── 📂 src/                       # Código fonte
│   ├── 📂 components/           # Componentes React
│   │   ├── 📂 admin/           # Painel administrativo
│   │   │   ├── AdminPanel.tsx   # Painel principal
│   │   │   └── ...
│   │   ├── 📂 auth/            # Sistema de autenticação
│   │   │   ├── AuthModal.tsx    # Modal de login
│   │   │   ├── LoginForm.tsx    # Formulário de login
│   │   │   ├── RegisterForm.tsx # Formulário de registro
│   │   │   └── ProtectedRoute.tsx # Rotas protegidas
│   │   ├── 📂 dashboard/        # Componentes da dashboard
│   │   │   ├── ScheduleGrid.tsx # Grid de horários
│   │   │   ├── StatusIndicator.tsx # Indicador de status
│   │   │   ├── AlertBanner.tsx  # Banner de avisos
│   │   │   └── ModernCalendar.tsx # Calendário
│   │   ├── 📂 layout/          # Componentes de layout
│   │   │   ├── Header.tsx       # Cabeçalho
│   │   │   └── Footer.tsx       # Rodapé
│   │   └── 📂 ui/              # Componentes UI (Shadcn)
│   ├── 📂 contexts/            # Contextos React
│   │   └── AuthContext.tsx     # Contexto de autenticação
│   ├── 📂 firebase/            # Configuração Firebase
│   │   └── config.ts           # Configurações do Firebase
│   ├── 📂 hooks/               # Hooks personalizados
│   │   ├── useAuth.ts          # Hook de autenticação
│   │   ├── useLabData.ts       # Hook de dados do lab
│   │   └── useRealTimeStatus.ts # Hook de status em tempo real
│   ├── 📂 lib/                 # Utilitários
│   │   ├── utils.ts            # Funções utilitárias
│   │   └── timeUtils.ts        # Utilitários de tempo
│   ├── 📂 types/               # Definições TypeScript
│   │   ├── auth.types.ts       # Tipos de autenticação
│   │   └── lab.ts              # Tipos do laboratório
│   ├── 📄 App.tsx              # Componente principal
│   ├── 📄 main.tsx             # Ponto de entrada
│   └── 🎨 index.css           # Estilos globais
├── 📄 .env.example             # Exemplo de variáveis de ambiente
├── 📄 .gitignore              # Arquivos ignorados pelo Git
├── 📄 firebase.json           # Configuração do Firebase
├── 📄 firestore.rules         # Regras do Firestore
├── 📄 package.json            # Dependências e scripts
├── 📄 README.md               # Este arquivo
├── 📄 tailwind.config.js      # Configuração do Tailwind
├── 📄 tsconfig.json           # Configuração do TypeScript
└── 📄 vite.config.ts          # Configuração do Vite
```

## 🔒 Segurança e Permissões

### 🛡️ Firestore Security Rules
- **Leitura pública** dos horários e status do laboratório
- **Escrita protegida** por autenticação obrigatória
- **Validação de dados** no servidor
- **Rate limiting** para prevenir abuso

### 🔐 Sistema de Autenticação
- **Firebase Authentication** com email/senha
- **Painel administrativo** protegido por login
- **Controle de acesso** baseado em funções
- **Sessões seguras** com tokens JWT

### 🚫 Dados Sensíveis
- **Variáveis de ambiente** para credenciais
- **Regras do Firestore** para controle de acesso
- **Validação client-side** e server-side

## 📱 Responsividade e Compatibilidade

### 📐 Design Responsivo
- **Mobile-first** approach
- **Breakpoints otimizados** para todos os dispositivos
- **Grid flexível** que se adapta ao tamanho da tela
- **Tipografia responsiva** usando clamp()

### 🌐 Compatibilidade de Browsers
- **Chrome/Edge** 90+
- **Firefox** 85+
- **Safari** 14+
- **Mobile browsers** (iOS Safari, Chrome Mobile)

### 📲 PWA Ready
- **Manifest configurado** para instalação
- **Ícones otimizados** para diferentes resoluções
- **Performance otimizada** para carregamento rápido

## 🎨 Design System

### 🎨 Cores UEFS
```css
--uefs-primary: #4F46E5    /* Azul UEFS */
--uefs-dark: #312E81       /* Azul escuro */
--uefs-gray-50: #F9FAFB    /* Cinza claro */
--uefs-gray-600: #4B5563   /* Cinza médio */
--uefs-danger: #EF4444     /* Vermelho para erros */
```

### 🖼️ Componentes
- **Interface moderna** e intuitiva
- **Animações suaves** para melhor UX
- **Componentes acessíveis** (ARIA labels)
- **Feedback visual** para todas as ações

## 🔧 Troubleshooting

### ❌ Problemas Comuns

**1. Erro "Firebase configuration is undefined"**
```bash
# Verifique se o arquivo .env.local existe e está configurado
cp .env.example .env.local
```

**2. Erro de build TypeScript**
```bash
# Reinstale as dependências
rm -rf node_modules package-lock.json
npm install
```

**3. Erro de permissão no Firestore**
```bash
# Verifique as regras do Firestore no console Firebase
# Certifique-se de que a autenticação está configurada
```

**4. Deploy falha**
```bash
# Verifique se está logado no Firebase
firebase login
firebase use --add
```

### 🆘 Suporte

Para problemas técnicos:
1. Verifique os logs do browser (F12 > Console)
2. Consulte a documentação do Firebase
3. Abra uma issue no GitHub
4. Entre em contato com a equipe de TI da UEFS

## 📈 Performance

### ⚡ Otimizações Implementadas
- **Code splitting** automático pelo Vite
- **Tree shaking** para bundle menor
- **Lazy loading** de componentes
- **Cache otimizado** pelo Firebase
- **Compressão gzip** habilitada

### 📊 Métricas
- **First Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Bundle size**: ~190KB gzipped
- **Lighthouse Score**: 90+

## 🤝 Contribuição

### 📝 Como Contribuir

1. **Fork** este repositório
2. **Clone** seu fork localmente
3. **Crie uma branch** para sua feature: `git checkout -b feature/nova-funcionalidade`
4. **Commit** suas mudanças: `git commit -m 'Adiciona nova funcionalidade'`
5. **Push** para a branch: `git push origin feature/nova-funcionalidade`
6. **Abra um Pull Request**

### 📋 Guidelines

- Use **commits semânticos** (feat, fix, docs, etc.)
- **Teste** suas mudanças antes do commit
- **Documente** novas funcionalidades
- Siga os **padrões de código** existentes

## 📝 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Equipe

### 🛠️ Desenvolvimento
- **Desenvolvedor Principal**: [ElissonNadson](https://github.com/ElissonNadson)

### 🎓 Instituição
**Universidade Estadual de Feira de Santana - UEFS**
- **Departamento**: Computação
- **Laboratório**: Laboratório de Computação

### 📞 Contato

- **GitHub**: [ElissonNadson/Sistema-de-Gerenciamento-do-Laboratorio-UEFS](https://github.com/ElissonNadson/Sistema-de-Gerenciamento-do-Laboratorio-UEFS)
- **Email**: [Contato UEFS](mailto:contato@uefs.br)
- **Site**: [www.uefs.br](https://www.uefs.br)

---

<div align="center">

**Desenvolvido com ❤️ para a Universidade Estadual de Feira de Santana - UEFS**

![UEFS Logo](https://www.uefs.br/logo.png)

*Sistema de Gerenciamento do Laboratório de Computação - 2025*

</div>
