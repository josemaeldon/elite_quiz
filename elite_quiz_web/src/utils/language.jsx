"use client"
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
    fallbackLng: 'en',
    lng: 'en',
    resources: {
        en: {
          translations: require('../locale/en.json'), // Fallback English translations
        },
      },
    ns: ["translations"],
    defaultNS: "translations",
});

export default i18n;

export const updateI18nTranslations = (newLangData) => {
        i18n.addResourceBundle('custom', 'translations', newLangData, true, true);
        i18n.changeLanguage('custom');
};