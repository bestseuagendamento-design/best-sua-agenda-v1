import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import { AdminLogin } from "./components/AdminLogin";
import { AdminDashboard } from "./components/AdminDashboard";
import { MasterDashboardV2 } from "./components/MasterDashboardV2";
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
        <MasterDashboardV2 
          onLogout={handleLogout}
        />
      )}
      {currentPage === "salon-register" && (
        <SalonRegister 
          selectedPlan={selectedPlan}
          onGoToLogin={() => navigate("salon-login")}
          onRegister={(salonData) => {
            if (salonData.selectedPlan) {
              setSalon(salonData);
              setSelectedPlan(salonData.selectedPlan);
              navigate("payment-screen", { plan: salonData.selectedPlan, salon: salonData });
              return;
            }
            if (selectedPlan && selectedPlan.id !== "free-trial") {
              setSalon(salonData);
              navigate("payment-screen", { plan: selectedPlan, salon: salonData });
              return;
            }
            if (!selectedPlan || selectedPlan.id === "free-trial") {
              navigate("salon-dashboard", { salon: salonData });
              return;
            }
            if (salonData.status === "pending_payment" || salonData.subscription?.paymentStatus === "pending_first_payment") {
              navigate("payment-pending", { salon: salonData });
            } else {
              navigate("salon-dashboard", { salon: salonData });
            }
          }}
          onBack={() => {
            setSelectedPlan(null);
            navigate("landing");
          }}
        />
      )}
      {currentPage === "salon-login" && (
        <SalonLogin 
          onLogin={(salonData, needsPayment) => {
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
            if (needsPayment) {
              navigate("payment-pending", { salon: salonData });
              return;
            }
            navigate("salon-dashboard", { salon: salonData });
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
            navigate("salon-register");
          }}
        />
      )}
      {currentPage === "booking" && salonSlug && (
        <PublicBookingFlowHybrid slug={salonSlug} onBack={() => navigate("landing")} />
      )}
      <Toaster />
      <PWAInstallPrompt />
      {currentPage === "landing" && <WhatsAppButton variant="floating" />}
    </div>
  );
}