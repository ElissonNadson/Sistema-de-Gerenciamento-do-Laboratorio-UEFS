# 🚀 Guia Completo de Deploy

Este documento contém instruções detalhadas para fazer o deploy do Sistema de Gerenciamento do Laboratório de Computação da UEFS.

## 📋 Visão Geral

O sistema utiliza **Firebase Hosting** para hospedagem, com deploy automático configurado através do **GitHub Actions**. Também é possível fazer deploy manual quando necessário.

## 🔄 Deploy Automático (Recomendado)

### ⚙️ Configuração Inicial

O deploy automático já está configurado e funciona da seguinte forma:

- **Deploy de Produção**: Acontece automaticamente a cada push na branch `main`
- **Deploy de Preview**: Criado automaticamente para Pull Requests

### 🔑 Requisitos para Deploy Automático

1. **Service Account Key** configurada como secret no GitHub:
   - Nome do secret: `FIREBASE_SERVICE_ACCOUNT_SISTEMA_HORARIO_LAB_UEFS`
   - Valor: JSON da service account do Firebase

2. **Project ID** configurado: `sistema-horario-lab-uefs`

### 📊 Status dos Deploys

Você pode acompanhar o status dos deploys em:
- **GitHub Actions**: Na aba "Actions" do repositório
- **Firebase Console**: Na seção "Hosting" do projeto

## 🛠️ Deploy Manual

### 📋 Pré-requisitos

```bash
# 1. Instale o Firebase CLI globalmente
npm install -g firebase-tools

# 2. Faça login no Firebase
firebase login

# 3. Selecione ou configure o projeto
firebase use --add
# Escolha: sistema-horario-lab-uefs
```

### 🔨 Processo de Deploy Manual

#### Método 1: Deploy Direto (Recomendado)
```bash
# Deploy completo em um comando
npm run deploy
```

#### Método 2: Deploy Passo a Passo
```bash
# 1. Instale as dependências (se necessário)
npm install

# 2. Execute o linter
npm run lint

# 3. Gere o build de produção
npm run build

# 4. Faça o deploy para o Firebase
firebase deploy --only hosting
```

### 🎯 Deploy para Ambientes Específicos

```bash
# Deploy apenas para hosting
firebase deploy --only hosting

# Deploy com mensagem personalizada
firebase deploy --only hosting -m "Atualização dos horários de inverno"

# Deploy de preview (canal temporário)
firebase hosting:channel:deploy preview-feature
```

## 🌐 URLs de Acesso

### 🏭 Produção
- **URL Principal**: https://sistema-horario-lab-uefs.web.app
- **URL Alternativa**: https://sistema-horario-lab-uefs.firebaseapp.com

### 🧪 Preview/Testing
URLs de preview são geradas automaticamente para Pull Requests e podem ser encontradas nos comentários do PR.

## 📁 Estrutura de Deploy

```
📦 Deploy Package/
├── 📂 dist/                     # Arquivos buildados
│   ├── 📄 index.html           # HTML principal
│   ├── 📂 assets/              # CSS, JS otimizados
│   └── 📄 favicon.ico          # Ícone do site
├── 📄 firebase.json            # Configuração do Firebase
├── 📄 .firebaserc             # Projeto ativo
└── 📄 firestore.rules         # Regras de segurança
```

## ⚙️ Configurações do Firebase

### 🗄️ Hosting
```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

### 🗃️ Firestore
- **Database**: Modo produção
- **Rules**: Configuradas para segurança otimizada
- **Indexes**: Criados automaticamente

### 🔐 Authentication
- **Providers**: Email/Password
- **Security**: Regras restritivas para admin

## 🔧 Troubleshooting

### ❌ Problemas Comuns

#### 1. **Erro de Build**
```bash
# Limpe cache e reinstale dependências
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

#### 2. **Erro de Autenticação**
```bash
# Refaça o login no Firebase
firebase logout
firebase login
```

#### 3. **Projeto não encontrado**
```bash
# Verifique projetos disponíveis
firebase projects:list

# Configure o projeto correto
firebase use sistema-horario-lab-uefs
```

#### 4. **Erro de Permissões**
```bash
# Verifique se você tem acesso ao projeto
firebase projects:list

# Solicite acesso ao administrador do projeto
```

#### 5. **Deploy trava ou falha**
```bash
# Tente deploy com debug
firebase deploy --debug

# Deploy apenas hosting
firebase deploy --only hosting
```

### 🧪 Testando o Deploy

Após o deploy, teste as funcionalidades principais:

1. ✅ **Página carrega** sem erros
2. ✅ **Status em tempo real** funciona
3. ✅ **Grid de horários** exibe corretamente
4. ✅ **Login administrativo** funciona
5. ✅ **Responsividade** em dispositivos móveis

### 📊 Monitoramento

#### Performance
```bash
# Analise o bundle size
npm run build
ls -la dist/assets/
```

#### Logs
```bash
# Visualize logs do Firebase
firebase functions:log

# Logs em tempo real
firebase functions:log --follow
```

## 🚨 Deploy de Emergência

### 🔄 Rollback Rápido
```bash
# Liste versões anteriores
firebase hosting:releases:list

# Faça rollback para versão anterior
firebase hosting:rollback
```

### 🆘 Deploy de Hotfix
```bash
# Para correções urgentes
git checkout main
git pull origin main

# Implemente a correção
# ... faça as alterações necessárias ...

# Deploy direto (pula testes automáticos)
npm run build
firebase deploy --only hosting -m "HOTFIX: Correção urgente"
```

## 📈 Otimizações de Deploy

### ⚡ Performance
- **Build otimizado** com Vite
- **Code splitting** automático
- **Tree shaking** para bundle menor
- **Compressão gzip** habilitada
- **Cache headers** otimizados

### 🔒 Segurança
- **HTTPS** obrigatório
- **Headers de segurança** configurados
- **Firestore rules** restritivas
- **Auth tokens** com expiração

### 📱 PWA
- **Service Worker** configurado
- **Manifest** otimizado
- **Icons** para instalação

## 📞 Suporte

### 🆘 Em caso de problemas

1. **Verifique logs** do GitHub Actions
2. **Consulte documentação** do Firebase
3. **Teste deploy local** primeiro
4. **Entre em contato** com o administrador

### 📧 Contatos
- **Desenvolvedor**: [ElissonNadson](https://github.com/ElissonNadson)
- **Repositório**: [GitHub Issues](https://github.com/ElissonNadson/Sistema-de-Gerenciamento-do-Laboratorio-UEFS/issues)

---

<div align="center">

**Guia de Deploy - Sistema UEFS**

*Desenvolvido para facilitar o processo de deploy e manutenção*

</div>