import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import { AdminLogin } from "./components/AdminLogin";
import { MasterDashboardApple } from "./components/MasterDashboardApple";
import { SalonRegister } from "./components/SalonRegister";
import { SalonLogin } from "./components/SalonLogin";
import { SalonDashboard } from "./components/SalonDashboard";
import { PublicBookingFlowHybrid } from "./components/PublicBookingFlowHybrid";
import { LinearLandingPage } from "./components/LinearLandingPage";
import { PaymentPending } from "./components/PaymentPending";
import { PaymentScreen } from "./components/PaymentScreen";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
import { UpgradeScreen } from "./components/UpgradeScreen";
import { WhatsAppButton } from "./components/WhatsAppButton";

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>("landing");
  const [admin, setAdmin] = useState<any>(null);
  const [salon, setSalon] = useState<any>(null);
  const [salonSlug, setSalonSlug] = useState<string>("");
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [upgradeReason, setUpgradeReason] = useState<"trial_expired" | "payment_overdue" | null>(null);

  // Register Service Worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then((registration) => {
            console.log('✅ Service Worker registrado:', registration.scope);
            if ('Notification' in window && Notification.permission === 'default') {
              Notification.requestPermission().then((permission) => {
                console.log('Permissão de notificação:', permission);
              });
            }
          })
          .catch((error) => {
            console.error('❌ Erro ao registrar Service Worker:', error);
          });
      });
    }
  }, []);

  // Check URL for salon booking page
  useEffect(() => {
    const path = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    const referralCode = urlParams.get('ref');
    
    if (referralCode) {
      console.log("🎁 CÓDIGO DE INDICAÇÃO DETECTADO:", referralCode);
      console.log("🚀 Redirecionando para página de cadastro...");
      setCurrentPage("salon-register");
      return;
    }
    
    const bookingMatch = path.match(/^\/best-suaagenda\/(.+)$/);
    
    if (bookingMatch) {
      const slug = bookingMatch[1];
      setSalonSlug(slug);
      setCurrentPage("booking");
    } else if (path === "/admin" || path === "/master") {
      setCurrentPage("admin-login");
    } else if (path === "/salon/register") {
      setCurrentPage("salon-register");
    } else if (path === "/salon/login") {
      setCurrentPage("salon-login");
    } else {
      setCurrentPage("landing");
    }
  }, []);

  const navigate = (page: string, data?: any) => {
    if (page === "master-login") {
      page = "admin-login";
    }
    setCurrentPage(page);
    if (data) {
      if (data.admin) setAdmin(data.admin);
      if (data.salon) setSalon(data.salon);
      if (data.plan) setSelectedPlan(data.plan);
      if (data.slug) setSalonSlug(data.slug);
    }
  };

  const handleLogout = () => {
    setAdmin(null);
    setSalon(null);
    navigate("landing");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage === "landing" && (
        <LinearLandingPage onNavigate={navigate} />
      )}
      
      {currentPage === "admin-login" && (
        <AdminLogin 
          onLogin={(adminData) => navigate("admin-dashboard", { admin: adminData })} 
          onBack={() => navigate("landing")}
        />
      )}
      
      {currentPage === "admin-dashboard" && admin && (
        <MasterDashboardApple 
          onLogout={handleLogout}
        />
      )}
      
      {currentPage === "salon-register" && (
        <SalonRegister 
          selectedPlan={selectedPlan}
          onGoToLogin={() => navigate("salon-login")}
          onRegister={(salonData) => {
            console.log("🎯 SalonRegister - Salão cadastrado:", salonData);
            console.log("📦 Plano selecionado:", selectedPlan);
            
            // 🎄 VERIFICAR SE TEM PROMOÇÃO DE NATAL (vem do salonData.selectedPlan)
            if (salonData.selectedPlan) {
              console.log("🎄 PROMOÇÃO DE NATAL DETECTADA! Redirecionando para PaymentScreen...");
              setSalon(salonData);
              setSelectedPlan(salonData.selectedPlan);
              navigate("payment-screen", { plan: salonData.selectedPlan, salon: salonData });
              return;
            }
            
            // LÓGICA CORRETA DO FLUXO:
            
            // 1. Se tem plano PAGO selecionado → Vai para PaymentScreen
            if (selectedPlan && selectedPlan.id !== "free-trial") {
              console.log("💰 PLANO PAGO - Redirecionando para PaymentScreen...");
              setSalon(salonData); // Salva os dados do salão
              navigate("payment-screen", { plan: selectedPlan, salon: salonData });
              return;
            }
            
            // 2. Se é TESTE GRATUITO → Vai direto para Dashboard
            if (!selectedPlan || selectedPlan.id === "free-trial") {
              console.log("🎁 TESTE GRATUITO - Liberando acesso imediato...");
              navigate("salon-dashboard", { salon: salonData });
              return;
            }
            
            // 3. Fallback: verifica status do servidor
            if (salonData.status === "pending_payment" || salonData.subscription?.paymentStatus === "pending_first_payment") {
              navigate("payment-pending", { salon: salonData });
            } else {
              navigate("salon-dashboard", { salon: salonData });
            }
          }}
          onBack={() => {
            setSelectedPlan(null); // Limpa o plano selecionado
            navigate("landing");
          }}
        />
      )}
      
      {currentPage === "salon-login" && (
        <SalonLogin 
          onLogin={(salonData, needsPayment) => {
            console.log("🎯 App.tsx - Dados recebidos do login:", {
              status: salonData.status,
              paymentStatus: salonData.subscription?.paymentStatus,
              name: salonData.name,
              needsPayment
            });
            
            // 🎯 NOVO: Verifica se está bloqueado e mostra UpgradeScreen
            if (salonData.status === "blocked") {
              setSalon(salonData);
              
              if (salonData.blockReason === "trial_expired") {
                setUpgradeReason("trial_expired");
                navigate("upgrade-screen");
                return;
              }
              
              if (salonData.blockReason === "payment_overdue") {
                setUpgradeReason("payment_overdue");
                navigate("upgrade-screen");
                return;
              }
            }
            
            // Check if needs payment (first registration with pending_payment status)
            if (needsPayment) {
              console.log("⚠️ Precisa completar pagamento, redirecionando...");
              navigate("payment-pending", { salon: salonData });
              return;
            }
            
            // 🚀 SE A API RETORNOU SUCESSO, É PORQUE ESTÁ TUDO OK!
            // A validação já foi feita no servidor (status === "active" && paymentStatus === "paid")
            // LIBERA ACESSO IMEDIATAMENTE!
            
            // Apenas verifica pending_renewal (já está ativo mas precisa renovar em breve)
            if (salonData.subscription?.paymentStatus === "pending_renewal") {
              console.log("⚠️ Pagamento vencido, mas ainda permite acesso");
              // Ainda permite acesso, mas mostra aviso
              navigate("salon-dashboard", { salon: salonData });
            } else {
              // ✅ TUDO CERTO - LIBERA DASHBOARD IMEDIATAMENTE!
              console.log("✅✅✅ LIBERANDO DASHBOARD IMEDIATAMENTE!");
              navigate("salon-dashboard", { salon: salonData });
            }
          }}
          onBack={() => navigate("landing")}
        />
      )}
      
      {currentPage === "upgrade-screen" && salon && upgradeReason && (
        <UpgradeScreen 
          salon={salon}
          reason={upgradeReason}
          onClose={() => navigate("landing")}
        />
      )}
      
      {currentPage === "salon-dashboard" && salon && (
        <SalonDashboard 
          salon={salon}
          onLogout={() => {
            setSalon(null);
            navigate("landing");
          }}
          onSelectPlan={(plan) => {
            console.log("💳 App.tsx - Plano selecionado do dashboard:", plan);
            setSelectedPlan(plan);
            navigate("payment-screen", { plan, salon });
          }}
        />
      )}
      
      {currentPage === "payment-pending" && salon && (
        <PaymentPending 
          salon={salon}
          onPaymentSubmitted={() => navigate("landing")}
        />
      )}
      
      {currentPage === "payment-screen" && selectedPlan && (
        <PaymentScreen 
          plan={selectedPlan}
          salon={salon}
          onBack={() => navigate("landing")}
          onPaymentConfirmed={() => {
            // Após pagamento confirmado, redireciona para registro
            navigate("salon-register");
          }}
        />
      )}
      
      {currentPage === "booking" && salonSlug && (
        <PublicBookingFlowHybrid slug={salonSlug} onBack={() => navigate("landing")} />
      )}
      <Toaster />
      <PWAInstallPrompt />
      
      {/* WhatsApp flutuante APENAS na landing page */}
      {currentPage === "landing" && <WhatsAppButton variant="floating" />}
    </div>
  );
}