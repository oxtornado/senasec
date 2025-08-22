import React from "react";
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
  Key,
  Cpu,
  Wifi,
  ChevronRight
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import LanguageSelector from "../components/LanguageSelector";
import ThemeToggle from "../components/ThemeToggle";

const Home = () => {
  const { t } = useLanguage();

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
            <Lock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="ml-2 text-2xl font-bold text-gray-900 dark:text-white">
              SENASEC
            </span>
          </div>
          <div className="flex space-x-4 items-center">
            <LanguageSelector />
            <ThemeToggle />
          </div>

          {/* Opciones para móvil */}
          <div className="flex md:hidden items-center space-x-2">
            <LanguageSelector />
            <ThemeToggle />
            <Link to="/login" className="p-2 text-blue-600 dark:text-blue-400">
              {t("signIn")}
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center py-12 md:py-24">
          <div className="md:w-1/2 md:pr-8 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
              {t("smartSecurityForClassrooms")}
            </h1>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
              {t("landingDescription")}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center md:justify-start">
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-lg transition md:py-4 md:text-lg md:px-8"
              >
                {t("signIn")}
              </Link>
              <a
                href="#features"
                className="mt-3 sm:mt-0 sm:ml-3 inline-flex items-center justify-center px-5 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 md:py-4 md:text-lg md:px-8"
              >
                {t("learnMore")}
              </a>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center md:justify-end mt-10 md:mt-0">
            {/* <img
              src={nijudemLogo}
              alt="Nijudem Software Logo"
              className="max-w-xs md:max-w-md w-full h-auto object-contain drop-shadow-xl"
              style={{ minWidth: '180px', maxWidth: '320px' }}
            /> */}
            <div className="bg-blue-100 p-8 rounded-lg">
              <h3 className="text-xl font-bold text-blue-600">NIJUDEM</h3>
              <p className="text-gray-600">Software Solutions</p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="py-12 md:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {t("ourFeatures")}
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
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
          className="py-12 md:py-20 bg-blue-50 dark:bg-gray-900 rounded-lg"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {t("systemAdvantages")}
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
              {t("systemAdvantagesDescription")}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* Ventaja 1 */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="inline-flex items-center justify-center p-2 bg-blue-100 dark:bg-blue-900 rounded-md text-blue-600 dark:text-blue-300">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                {t("integralSecurity")}
              </h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                {t("integralSecurityDesc")}
              </p>
            </div>
            {/* Ventaja 2 */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="inline-flex items-center justify-center p-2 bg-blue-100 dark:bg-blue-900 rounded-md text-blue-600 dark:text-blue-300">
                <Cloud className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                {t("centralizedManagement")}
              </h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                {t("centralizedManagementDesc")}
              </p>
            </div>
            {/* Ventaja 3 */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="inline-flex items-center justify-center p-2 bg-blue-100 dark:bg-blue-900 rounded-md text-blue-600 dark:text-blue-300">
                <Bell className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                {t("realTimeAlerts")}
              </h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                {t("realTimeAlertsDesc")}
              </p>
            </div>
            {/* Ventaja 4 */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="inline-flex items-center justify-center p-2 bg-blue-100 dark:bg-blue-900 rounded-md text-blue-600 dark:text-blue-300">
                <Mail className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                {t("supportAndReports")}
              </h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                {t("supportAndReportsDesc")}
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="support" className="py-12 md:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {t("supportAndIssueRegister")}
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
              {t("supportAndIssueRegisterDesc")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {t("sendMessage")}
              </h3>
              <SupportForm />
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {t("contactInfo")}
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <HomeIcon className="h-5 w-5 text-blue-500 mt-1" />
                  <div className="ml-3 text-gray-600 dark:text-gray-300">
                    <p>CBA Mosquera</p>
                    <p>Mosquera Cundinamarca | 250040</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span className="ml-3 text-gray-600 dark:text-gray-300">
                    (+57) 3202020844
                  </span>
                </div>
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span className="ml-3 text-gray-600 dark:text-gray-300">
                    soporte@senasec.com
                  </span>
                </div>
              </div>
              <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  {t("followUs")}
                </h4>
                <div className="flex space-x-4">
                  {["facebook", "twitter", "instagram", "linkedin"].map(
                    (social) => (
                      <a
                        key={social}
                        href={`#${social}`}
                        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                      >
                        <span className="sr-only">{social}</span>
                        <div className="h-6 w-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-300 text-xs">
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
