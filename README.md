# 💜 Best Sua Agenda - SaaS de Agendamento para Salões

Sistema completo de agendamento automático para salões de beleza com 13 perfis pré-configurados, sistema de indicações, loja virtual integrada e notificações push em tempo real.

![Status](https://img.shields.io/badge/status-production-success)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-Private-red)

---

## 🚀 Características Principais

### 🎯 **Agendamento Inteligente**
- ✅ 13 perfis pré-configurados (Barbearia, Salão Feminino, Estética, etc)
- ✅ Até 3 profissionais por salão
- ✅ Cálculo automático de horários disponíveis
- ✅ Prevenção de conflitos de agenda
- ✅ Intervalos de almoço configuráveis

### 💰 **Sistema de Pagamento**
- ✅ PIX antecipado ou "pagar no dia"
- ✅ Aprovação via WhatsApp
- ✅ Checkout integrado
- ✅ Notificações de pagamento

### 🔔 **Notificações Push (OneSignal)**
- ✅ Notificação de novo agendamento em tempo real
- ✅ Lembretes automáticos
- ✅ Notificações de vendas
- ✅ Funciona em desktop e mobile

### 🏪 **Loja Virtual Integrada**
- ✅ Venda de produtos online
- ✅ Galeria de fotos
- ✅ Checkout com WhatsApp
- ✅ Gerenciamento de estoque

### 👥 **Sistema de Indicações**
- ✅ Link personalizado para cada salão
- ✅ Desconto para indicados
- ✅ Rastreamento de conversões

### 📊 **Painel Master (Admin)**
- ✅ Controle total de todos os salões
- ✅ Sistema de bloqueio/desbloqueio por inadimplência
- ✅ Aprovação manual de pagamentos
- ✅ Mensagens de cobrança via WhatsApp
- ✅ Analytics e métricas

### ⏰ **Planos e Cobrança**
- ✅ Teste grátis de 24 horas (não ilimitado)
- ✅ Plano Essencial: R$ 49,90/mês
- ✅ Plano Pro: R$ 79,90/mês
- ✅ 30 dias após pagamento + 3 dias de tolerância
- ✅ Bloqueio automático após vencimento
- ✅ Garantia de devolução de 30 dias

---

## 🛠️ Tecnologias

### **Frontend**
- **React** 18 + TypeScript
- **Tailwind CSS** 4.0
- **Vite** (Build tool)
- **Lucide React** (Ícones)
- **Sonner** (Toasts)

### **Backend**
- **Supabase** (Database + Auth + Storage)
- **Supabase Edge Functions** (Serverless API)
- **Hono** (Web framework)

### **Integrações**
- **OneSignal** (Push notifications)
- **Resend** (Email transacional)
- **WhatsApp Business API** (Comunicação com clientes)

### **Deploy**
- **Vercel** (Frontend hosting)
- **GitHub** (Version control)

---

## 📦 Instalação Local

### **Pré-requisitos**
- Node.js 18+
- npm ou yarn
- Conta Supabase
- Conta OneSignal
- Conta Resend

### **Passo 1: Clone o repositório**

```bash
git clone https://github.com/seu-usuario/best-sua-agenda.git
cd best-sua-agenda
```

### **Passo 2: Instale dependências**

```bash
npm install
```

### **Passo 3: Configure variáveis de ambiente**

```bash
cp .env.example .env
```

Edite `.env` e preencha com suas credenciais.

### **Passo 4: Rode localmente**

```bash
npm run dev
```

Acesse: `http://localhost:5173`

---

## 🚀 Deploy em Produção

### **Vercel (Recomendado)**

1. Faça push para o GitHub
2. Conecte o repositório na Vercel
3. Configure variáveis de ambiente
4. Deploy automático!

[Guia completo de deploy](./GUIA_MIGRACAO_VERCEL.md)

---

## 📁 Estrutura do Projeto

```
best-sua-agenda/
├── src/
│   ├── app/
│   │   ├── components/          # Componentes React
│   │   │   ├── ui/              # Componentes base (button, input, etc)
│   │   │   ├── SalonDashboard.tsx    # Dashboard do salão
│   │   │   ├── MasterDashboardV2.tsx # Painel admin
│   │   │   ├── BookingFlow.tsx       # Fluxo de agendamento
│   │   │   └── ...
│   │   ├── data/                # Dados estáticos
│   │   │   └── services.ts      # 13 perfis pré-configurados
│   │   └── App.tsx              # Componente principal
│   ├── utils/
│   │   ├── notifications.ts     # OneSignal helpers
│   │   └── getPublicUrl.ts      # Helpers de URL
│   └── styles/
│       ├── theme.css            # Tema (roxo + verde neon)
│       └── fonts.css            # Fontes
├── supabase/
│   └── functions/
│       └── server/              # Backend (Edge Functions)
│           ├── index.tsx        # API principal
│           ├── kv_store.tsx     # Database helpers
│           ├── push-notifications.ts  # OneSignal
│           └── security.tsx     # Auth & validação
├── public/                      # Assets estáticos
├── vercel.json                  # Config Vercel
├── package.json
└── README.md
```

---

## 🎨 Design System

### **Cores**

- **Primária (Roxo Profundo):** `#2D005E`
- **Acento (Verde Neon):** `#39FF14`
- **Background:** `#0A0A0A`
- **Texto:** `#FFFFFF`

### **Tipografia**

- **Títulos:** Inter (Bold)
- **Corpo:** Inter (Regular)

### **Inspiração**

Design minimalista estilo **Linear** - clean, moderno e profissional.

---

## 📱 PWA (Progressive Web App)

O sistema é instalável como app nativo:

- ✅ Ícones em todas as resoluções
- ✅ Funciona offline (cache)
- ✅ Notificações push
- ✅ Instalável na home screen

---

## 🔐 Segurança

- ✅ Autenticação com Supabase Auth
- ✅ Hash de senhas (bcrypt)
- ✅ Rate limiting
- ✅ Sanitização de inputs
- ✅ CORS configurado
- ✅ Headers de segurança (CSP, XSS, etc)

---

## 📊 Analytics & Monitoramento

### **Vercel Analytics**
- Page views
- Performance metrics
- Real user monitoring

### **Logs**
- Supabase logs (database)
- Vercel logs (frontend)
- OneSignal logs (notifications)

---

## 🆘 Suporte

### **Documentação**
- [Guia de Migração](./GUIA_MIGRACAO_VERCEL.md)
- [OneSignal Configurado](./ONESIGNAL_CONFIGURADO.md)

### **Problemas Comuns**
Veja a seção de troubleshooting no [guia de migração](./GUIA_MIGRACAO_VERCEL.md#-problemas-comuns).

---

## 🗺️ Roadmap

### **V1.0** ✅ (ATUAL)
- [x] Sistema de agendamento
- [x] 13 perfis pré-configurados
- [x] Notificações push
- [x] Loja virtual
- [x] Painel master
- [x] Sistema de planos

### **V1.1** (Em breve)
- [ ] Relatórios financeiros
- [ ] Exportação de dados (CSV/PDF)
- [ ] Multi-idioma (PT/EN/ES)
- [ ] App móvel nativo

### **V1.2** (Futuro)
- [ ] Integração com Instagram
- [ ] Chatbot com IA
- [ ] Agendamento por voz
- [ ] Marketplace de profissionais

---

## 📄 Licença

**Proprietary Software** - Todos os direitos reservados.

Este software é propriedade privada e não pode ser redistribuído, modificado ou usado comercialmente sem permissão expressa.

---

## 👨‍💻 Desenvolvido por

**Best Sua Agenda**  
Sistema de agendamento profissional para salões de beleza.

📧 Email: bestseuagendamento@gmail.com  
🌐 Site: https://bestsuaagenda.com.br

---

## 🎉 Status

✅ **PRODUÇÃO** - Sistema 100% funcional e pronto para escalar!

**Última atualização:** 30/12/2025  
**Versão:** 1.0.0  
**Deploy:** Vercel + Supabase  
