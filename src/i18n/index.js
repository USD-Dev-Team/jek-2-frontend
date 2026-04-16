import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import "./i18n";

// === 1) MODULLAR TARJIMALARI ===

// AUTH
import authUZ from "./modules/auth/uz.json";
import authRU from "./modules/auth/ru.json";
import authEN from "./modules/auth/en.json";

// LOGIN
import loginUZ from "./modules/login/uz.json";
import loginRU from "./modules/login/ru.json";
import loginEN from "./modules/login/en.json";

// SIDEBAR
import sidebarUZ from "./modules/sidebar/uz.json";
import sidebarRU from "./modules/sidebar/ru.json";
import sidebarEN from "./modules/sidebar/en.json";


// === 2) HAMMASINI BIRLASHTIRAMIZ ===
const resources = {
    uz: {
        translation: {
            auth: authUZ,
            login: loginUZ,
            sidebar: sidebarUZ,
        }
    },
    ru: {
        translation: {
            auth: authRU,
            login: loginRU,
            sidebar: sidebarRU,
        }
    },
    en: {
        translation: {
            auth: authEN,
            login: loginEN,
            sidebar: sidebarEN,
        }
    }
};


// === 3) i18n INIT ===
i18n
    .use(initReactI18next)
    .init({
        lng: localStorage.getItem("lang") || "uz",
        fallbackLng: "uz",
        interpolation: {
            escapeValue: false,
        },
        resources
    });

export default i18n;