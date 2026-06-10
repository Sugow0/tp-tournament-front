import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import commonFr from "~/locales/fr/common.json";
import errorsFr from "~/locales/fr/errors.json";

i18n.use(initReactI18next).init({
  lng: "fr",
  fallbackLng: "fr",
  resources: {
    fr: {
      common: commonFr,
      errors: errorsFr,
    },
  },
  defaultNS: "common",
  interpolation: { escapeValue: false },
});

export default i18n;
