import React, { useState } from "react";
import SupportForm from "./SupportForm";
// import nijudemLogo from "../assets/Nijudem.png"; // Temporalmente comentado
import { Link } from "react-router-dom";
import {
  Shield,
  Home as HomeIcon,
  Lock,
  Cloud,
  Bell,
  Mail,
  Cpu,
  Wifi
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import LanguageSelector from "../components/LanguageSelector";
import ThemeToggle from "../components/ThemeToggle";


const Home = () => {
  const { t } = useLanguage();

  // declaracion de modal para el aviso de uso de datos
  const [showModal, setShowModal] = useState(true);

  const features = [
    {
      icon: Shield,
      title: t("securityMonitoring"),
      description: t("securityMonitoringDesc"),
    },
    {
      icon: Bell,
      title: t("alertSystem"),
      description: t("alertSystemDesc"),
    },
    {
      icon: Cpu,
      title: t("smartAutomation"),
      description: t("smartAutomationDesc"),
    },
    {
      icon: Wifi,
      title: t("remoteAccess"),
      description: t("remoteAccessDesc"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow transition-all duration-300">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
              <Lock className="h-10 w-10 text-white" />
            </div>
            <span className="ml-2 text-2xl font-bold text-gray-900 dark:text-white">
              SENASEC
            </span>
          </div>
          <div className="hidden md:flex space-x-4 items-center">
            <LanguageSelector />
            <ThemeToggle />
          </div>

          {/* Opciones para móvil */}
          <div className="flex md:hidden items-center space-x-2">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center py-16 md:py-32">
          <div className="md:w-1/2 md:pr-12 text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-800 dark:text-white leading-tight mb-6">
              {t("smartSecurityForClassrooms")}
            </h1>
            <p className="mt-6 text-2xl text-gray-600 dark:text-gray-300 leading-relaxed">
              {t("landingDescription")}
            </p>
            <div className="mt-12 flex flex-col sm:flex-row justify-center md:justify-start gap-4">
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-10 py-5 border border-transparent text-xl font-bold rounded-2xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                {t("signIn")}
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center px-8 py-5 border-2 border-gray-300 dark:border-gray-600 text-xl font-semibold rounded-2xl text-gray-700 dark:text-white bg-gradient-to-r from-white to-slate-50 dark:from-gray-700 dark:to-gray-800 hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-600 dark:hover:to-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {t("learnMore")}
              </a>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center md:justify-end mt-16 md:mt-0">
            <div className="bg-gradient-to-br from-slate-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 p-12 rounded-3xl shadow-2xl border-2 border-blue-200/50 dark:border-blue-700/50 max-w-xs md:max-w-lg w-full transform hover:scale-105 transition-all duration-300" style={{ minWidth: '220px', maxWidth: '400px' }}>
              <div className="text-center">
                {/* Icono de candado */}
                <div className="mx-auto mb-8 w-28 h-28 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-xl">
                  <Lock className="h-16 w-16 text-white" />
                </div>
                
                {/* Texto Nijudem */}
                <h2 className="text-4xl md:text-6xl font-bold text-blue-900 dark:text-blue-100 mb-4">
                  Nijudem
                </h2>
                
                {/* Texto SOFTWARE */}
                <p className="text-lg md:text-xl font-bold text-blue-700 dark:text-blue-300 tracking-widest">
                  SOFTWARE
                </p>
                
                {/* Línea decorativa */}
                <div className="mt-6 mx-auto w-24 h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full shadow-lg"></div>
              </div>
            </div>
          </div>
        </div>


        {/* Features Section */}
        <section id="features" className="py-16 md:py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-white mb-6">
              {t("ourFeatures")}
            </h2>
            <p className="mt-6 max-w-3xl mx-auto text-2xl text-gray-600 dark:text-gray-300 leading-relaxed">
              {t("featuresDescription")}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="inline-flex items-center justify-center p-2 bg-blue-100 dark:bg-blue-900 rounded-md text-blue-600 dark:text-blue-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Ventajas del Sistema */}
        <section
          id="advantages"
          className="px-6 py-16 md:py-24 bg-blue-100 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 rounded-3xl"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-white mb-6">
              {t("systemAdvantages")}
            </h2>
            <p className="mt-6 max-w-3xl mx-auto text-2xl text-gray-600 dark:text-gray-300 leading-relaxed">
              {t("systemAdvantagesDescription")}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* Ventaja 1 */}
            <div className="bg-gradient-to-br from-white to-slate-50 dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 transform hover:scale-105">
              <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl text-white shadow-lg mb-6">
                <Lock className="h-10 w-10" />
              </div>
              <h3 className="mt-6 text-2xl font-bold text-gray-800 dark:text-white mb-4">
                {t("integralSecurity")}
              </h3>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                {t("integralSecurityDesc")}
              </p>
            </div>
            {/* Ventaja 2 */}
            <div className="bg-gradient-to-br from-white to-slate-50 dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 transform hover:scale-105">
              <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl text-white shadow-lg mb-6">
                <Cloud className="h-10 w-10" />
              </div>
              <h3 className="mt-6 text-2xl font-bold text-gray-800 dark:text-white mb-4">
                {t("centralizedManagement")}
              </h3>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                {t("centralizedManagementDesc")}
              </p>
            </div>
            {/* Ventaja 3 */}
            <div className="bg-gradient-to-br from-white to-slate-50 dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 transform hover:scale-105">
              <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl text-white shadow-lg mb-6">
                <Bell className="h-10 w-10" />
              </div>
              <h3 className="mt-6 text-2xl font-bold text-gray-800 dark:text-white mb-4">
                {t("realTimeAlerts")}
              </h3>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                {t("realTimeAlertsDesc")}
              </p>
            </div>
            {/* Ventaja 4 */}
            <div className="bg-gradient-to-br from-white to-slate-50 dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 transform hover:scale-105">
              <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl text-white shadow-lg mb-6">
                <Mail className="h-10 w-10" />
              </div>
              <h3 className="mt-6 text-2xl font-bold text-gray-800 dark:text-white mb-4">
                {t("supportAndReports")}
              </h3>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                {t("supportAndReportsDesc")}
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="support" className="py-16 md:py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-white mb-6">
              {t("supportAndIssueRegister")}
            </h2>
            <p className="mt-6 max-w-3xl mx-auto text-2xl text-gray-600 dark:text-gray-300 leading-relaxed">
              {t("supportAndIssueRegisterDesc")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-gradient-to-br from-white to-slate-50 dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 p-10 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                {t("sendMessage")}
              </h3>
              <SupportForm />
            </div>
            <div className="bg-gradient-to-br from-white to-slate-50 dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 p-10 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                {t("contactInfo")}
              </h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                    <HomeIcon className="h-8 w-8 text-white" />
                  </div>
                  <div className="ml-4 text-gray-700 dark:text-gray-300">
                    <p className="text-lg font-semibold">CBA Mosquera</p>
                    <p className="text-lg">Mosquera Cundinamarca | 250040</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <span className="ml-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
                    (+57) 3202020844
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <span className="ml-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
                    soporte@senasec.com
                  </span>
                </div>
              </div>
              <div className="mt-8">
                <h4 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                  {t("followUs")}
                </h4>
                <div className="flex space-x-6">
                  {["facebook", "twitter", "instagram", "linkedin"].map(
                    (social) => (
                      <a
                        key={social}
                        href={`#${social}`}
                        className="transform hover:scale-110 transition-all duration-300"
                      >
                        <span className="sr-only">{social}</span>
                        <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl">
                          <span className="text-white text-lg font-bold">
                            {social.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </a>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ventada de aviso de uso de datos del usuario*/}
      {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-900 dark:text-white rounded-2xl shadow-xl max-w-md w-full p-6 text-center">
                        <h2 className="text-xl font-semibold mb-4">
                            Aviso de privacidad
                        </h2>
                        <p className="text-gray-700 mb-6 dark:text-white">
                            SENASEC usará su foto y acceso a la cámara para la
                            apertura de aulas.  
                            <br />
                            Garantizamos la seguridad de su información y el
                            resguardo responsable de sus datos.
                        </p>
                        <button
                            onClick={() => setShowModal(false)}
                            className="bg-blue-700 text-white px-6 py-2 rounded-xl hover:bg-blue-800 transition"
                        >
                            Aceptar
                        </button>
                    </div>
                </div>
            )}

      {/* Footer Mejorado */}
      <footer className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-6 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm font-medium">
            &copy; 2025 SENASEC, todos los derechos reservados. Contacto: <a href="mailto:soporte@senasec.com" className="underline hover:text-blue-200">soporte@senasec.com</a> | Tel: (57+)3202020844
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
