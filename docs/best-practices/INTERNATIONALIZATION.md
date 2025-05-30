# Internationalization and Localization Best Practices

## Text Extraction

1. **Use a translation framework (i18next)**
   ```tsx
   // Set up i18next
   import i18n from 'i18next';
   import { initReactI18next } from 'react-i18next';
   
   i18n
     .use(initReactI18next)
     .init({
       resources: {
         en: {
           translation: {
             greeting: 'Hello',
             farewell: 'Goodbye',
             buttons: {
               submit: 'Submit',
               cancel: 'Cancel',
             },
           },
         },
         es: {
           translation: {
             greeting: 'Hola',
             farewell: 'Adiós',
             buttons: {
               submit: 'Enviar',
               cancel: 'Cancelar',
             },
           },
         },
       },
       lng: 'en',
       fallbackLng: 'en',
       interpolation: {
         escapeValue: false,
       },
     });
   
   export default i18n;
   ```

2. **Extract all user-facing strings**
   ```tsx
   import { useTranslation } from 'react-i18next';
   
   function WelcomeMessage() {
     const { t } = useTranslation();
     
     return (
       <div>
         <h1>{t('greeting')}</h1>
         <button>{t('buttons.submit')}</button>
       </div>
     );
   }
   ```

3. **Avoid hardcoded text**
   ```tsx
   // Bad
   <button>Submit</button>
   
   // Good
   <button>{t('buttons.submit')}</button>
   ```

## Formatting

1. **Use proper date/time/number formatting**
   ```tsx
   import { useTranslation } from 'react-i18next';
   
   function DateDisplay({ date }) {
     const { t, i18n } = useTranslation();
     
     const formattedDate = new Intl.DateTimeFormat(i18n.language, {
       year: 'numeric',
       month: 'long',
       day: 'numeric',
     }).format(date);
     
     return <div>{formattedDate}</div>;
   }
   ```

2. **Support RTL languages**
   ```tsx
   import { useTranslation } from 'react-i18next';
   import { createContext, useContext } from 'react';
   
   const RTLContext = createContext({ isRTL: false });
   
   function RTLProvider({ children }) {
     const { i18n } = useTranslation();
     const isRTL = i18n.dir() === 'rtl';
     
     return (
       <RTLContext.Provider value={{ isRTL }}>
         <div dir={isRTL ? 'rtl' : 'ltr'}>
           {children}
         </div>
       </RTLContext.Provider>
     );
   }
   ```

3. **Consider cultural differences**
   ```tsx
   const formatCurrency = (amount, currency, locale) => {
     return new Intl.NumberFormat(locale, {
       style: 'currency',
       currency,
     }).format(amount);
   };
   
   // Usage
   const price = formatCurrency(9.99, 'USD', 'en-US'); // $9.99
   const priceDE = formatCurrency(9.99, 'EUR', 'de-DE'); // 9,99 €
   ```

## Dynamic Content

1. **Account for text expansion in translations**
   ```tsx
   // Use flexible containers that can accommodate longer text
   <div className="min-h-[50px] flex items-center">
     {t('welcome.message')}
   </div>
   ```

2. **Use flexible layouts**
   ```tsx
   // Use Flexbox or Grid for layouts that can adapt to content size
   <div className="flex flex-wrap gap-4">
     <button className="flex-shrink-0">{t('buttons.previous')}</button>
     <div className="flex-grow">{t('content.title')}</div>
     <button className="flex-shrink-0">{t('buttons.next')}</button>
   </div>
   ```

3. **Test with various languages**
   - Test with languages that tend to have longer words (German)
   - Test with languages that use different character sets (Japanese)
   - Test with RTL languages (Arabic, Hebrew)

## Translation Management

1. **Organize translations by namespace**
   ```tsx
   // resources.js
   export const resources = {
     en: {
       common: {
         buttons: {
           submit: 'Submit',
           cancel: 'Cancel',
         },
       },
       auth: {
         login: 'Log in',
         signup: 'Sign up',
       },
       dashboard: {
         welcome: 'Welcome to your dashboard',
       },
     },
     // other languages...
   };
   ```

2. **Implement language selection**
   ```tsx
   function LanguageSelector() {
     const { i18n } = useTranslation();
     
     const changeLanguage = (language) => {
       i18n.changeLanguage(language);
     };
     
     return (
       <div>
         <button onClick={() => changeLanguage('en')}>English</button>
         <button onClick={() => changeLanguage('es')}>Español</button>
         <button onClick={() => changeLanguage('fr')}>Français</button>
       </div>
     );
   }
   ```

3. **Store user language preference**
   ```tsx
   function useLanguagePreference() {
     const { i18n } = useTranslation();
     
     useEffect(() => {
       // Store language preference when it changes
       localStorage.setItem('language', i18n.language);
     }, [i18n.language]);
     
     useEffect(() => {
       // Load language preference on mount
       const savedLanguage = localStorage.getItem('language');
       if (savedLanguage) {
         i18n.changeLanguage(savedLanguage);
       }
     }, []);
   }
   ```

## Pluralization and Complex Translations

1. **Handle pluralization correctly**
   ```tsx
   // In translation file
   {
     "items": {
       "zero": "No items",
       "one": "1 item",
       "other": "{{count}} items"
     }
   }
   
   // In component
   function ItemCount({ count }) {
     const { t } = useTranslation();
     return <div>{t('items', { count })}</div>;
   }
   ```

2. **Use context for ambiguous translations**
   ```tsx
   // In translation file
   {
     "report": {
       "button": "Generate Report",
       "noun": "Report"
     }
   }
   
   // In component
   function ReportSection() {
     const { t } = useTranslation();
     return (
       <div>
         <h2>{t('report.noun')}</h2>
         <button>{t('report.button')}</button>
       </div>
     );
   }
   ```

3. **Support variable interpolation**
   ```tsx
   // In translation file
   {
     "welcome": "Welcome, {{name}}!"
   }
   
   // In component
   function Welcome({ user }) {
     const { t } = useTranslation();
     return <h1>{t('welcome', { name: user.name })}</h1>;
   }
   ```
