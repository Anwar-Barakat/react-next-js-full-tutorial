================================================================================
                    REACT-I18NEXT TRANSLATIONS IMPLEMENTATION GUIDE
                              Q&A DOCUMENTATION
================================================================================

Last Updated: 2026-02-01

================================================================================
                              TABLE OF CONTENTS
================================================================================

1. GENERAL OVERVIEW
2. CONFIGURATION
3. FILE STRUCTURE
4. NAMESPACES
5. IMPLEMENTATION PATTERNS
6. ADDING NEW TRANSLATIONS
7. RTL (RIGHT-TO-LEFT) SUPPORT
8. LANGUAGE SWITCHING
9. BEST PRACTICES
10. TROUBLESHOOTING

================================================================================
                           1. GENERAL OVERVIEW
================================================================================

Q: What translation library is used?
A: React-i18next with i18next core.

Q: Where is the i18n configuration located?
A: resources/js/locales/locales.ts (or your project's locale config path)

Q: How is user language preference stored?
A: In localStorage under a configurable key (e.g., 'app-language').

================================================================================
                            2. CONFIGURATION
================================================================================

Q: How is i18n initialized?
A: In your locales configuration file:

   i18n.use(initReactI18next).init({
       resources,
       fallbackLng: defaultLocale,
       lng: initialLanguage,
       defaultNS: 'common',
       fallbackNS: ['common'],
       interpolation: {
           escapeValue: false,
       },
   });

Q: What are the key configuration options?

   OPTION          | VALUE                    | PURPOSE
   ----------------|--------------------------|---------------------------
   fallbackLng     | 'en'                     | Fallback if key missing
   defaultNS       | 'common'                 | Default namespace
   fallbackNS      | ['common', ...]          | Fallback namespaces
   escapeValue     | false                    | React handles escaping

Q: How do I import i18n in my application?
A: Import from your locales index:

   import i18n from '@/locales';

================================================================================
                           3. FILE STRUCTURE
================================================================================

Q: What is the recommended translation file structure?
A:
   resources/js/locales/
   ├── index.ts              # Main export
   ├── locales.ts            # i18n configuration
   ├── en/                   # English translations
   │   ├── common.json       # Shared/common translations
   │   └── [namespace].json  # Feature-specific translations
   ├── ar/                   # Arabic translations (or other languages)
   │   ├── common.json       # Shared/common translations
   │   └── [namespace].json  # Feature-specific translations
   └── lang/                 # Additional language utilities

Q: What is the purpose of namespace files?

   FILE           | PURPOSE
   ---------------|--------------------------------------------------
   common.json    | Shared UI elements (buttons, labels, messages)
   [feature].json | Feature-specific translations

================================================================================
                             4. NAMESPACES
================================================================================

Q: What are namespaces?
A: Namespaces organize translations into logical groups by feature or module.
   Common namespaces include:
   - common    : Shared translations across all modules
   - auth      : Authentication pages
   - dashboard : Dashboard/home pages
   - [feature] : Any feature-specific translations

Q: How do I use a specific namespace?
A: Specify the namespace in useTranslation:

   // Use a specific namespace
   const { t } = useTranslation('dashboard');

   // Use common namespace
   const { t } = useTranslation('common');

Q: Can I use multiple namespaces in one component?
A: Yes, pass an array:

   const { t } = useTranslation(['dashboard', 'common']);

   // Access dashboard namespace (first in array)
   t('title')

   // Access common namespace explicitly
   t('common:button')

Q: What is the fallback namespace order?
A: If a key is not found, i18n searches in this order:
   1. Requested namespace
   2. Namespaces listed in fallbackNS configuration

================================================================================
                        5. IMPLEMENTATION PATTERNS
================================================================================

Q: How do I use translations in a component?
A: Basic pattern:

   import { useTranslation } from 'react-i18next';

   const MyComponent = () => {
       const { t } = useTranslation('dashboard');

       return (
           <div>
               <h1>{t('title')}</h1>
               <p>{t('description')}</p>
           </div>
       );
   };

Q: How do I use interpolation (dynamic values)?
A: Use double curly braces in JSON, pass object to t():

   JSON:
   "welcome": "Welcome, {{name}}!"
   "itemCount": "You have {{count}} items"

   Component:
   t('welcome', { name: 'John' })
   t('itemCount', { count: 5 })

Q: How do I handle pluralization?
A: Use i18next plural suffixes:

   JSON:
   "item_one": "{{count}} item"
   "item_other": "{{count}} items"

   Component:
   t('item', { count: 1 })  // "1 item"
   t('item', { count: 5 })  // "5 items"

   Or use separate keys with conditional logic:
   t(count === 1 ? 'item' : 'items')

Q: How do I use translations in page titles?
A: With Inertia Head component:

   import { Head } from '@inertiajs/react';
   import { useTranslation } from 'react-i18next';

   const MyPage = () => {
       const { t } = useTranslation('pages');
       return (
           <>
               <Head title={t('myPage.title')} />
               {/* content */}
           </>
       );
   };

Q: How do I use translations in toast notifications?
A: Pass translated strings:

   import { toast } from 'sonner';
   import { useTranslation } from 'react-i18next';

   const { t } = useTranslation('messages');

   toast.success(t('saveSuccess'));
   toast.error(t('saveError'));

Q: How do I use translations in form validation?
A: Translate error messages:

   const { t } = useTranslation('validation');

   const schema = z.object({
       email: z.string().email(t('invalidEmail')),
       name: z.string().min(2, t('nameTooShort')),
   });

================================================================================
                       6. ADDING NEW TRANSLATIONS
================================================================================

Q: How do I add a new translation key?
A: Follow these steps:

   STEP 1: Add to primary language file (e.g., en/[namespace].json)

   {
       "mySection": {
           "myKey": "My English text"
       }
   }

   STEP 2: Add to other language files (e.g., ar/[namespace].json)

   {
       "mySection": {
           "myKey": "النص العربي"
       }
   }

   STEP 3: Use in component

   const { t } = useTranslation('[namespace]');
   <span>{t('mySection.myKey')}</span>

Q: How do I add a new namespace?
A: Follow these steps:

   STEP 1: Create JSON files for each language
   - resources/js/locales/en/newnamespace.json
   - resources/js/locales/ar/newnamespace.json

   STEP 2: Import in locales.ts
   import enNewNamespace from './en/newnamespace.json';
   import arNewNamespace from './ar/newnamespace.json';

   STEP 3: Add to resources object
   const resources = {
       en: {
           common: enCommon,
           newnamespace: enNewNamespace,
       },
       ar: {
           common: arCommon,
           newnamespace: arNewNamespace,
       },
   };

   STEP 4: Add to fallbackNS array (optional)
   fallbackNS: ['common', 'newnamespace'],

Q: What naming convention should I use for keys?
A: Use camelCase with dot notation:

   CORRECT:
   - dashboard.pageTitle
   - profile.form.firstName
   - messages.saveSuccess

   INCORRECT:
   - Dashboard.PageTitle   (PascalCase)
   - profile-form-name     (kebab-case)
   - profile_form_name     (snake_case)

================================================================================
                      7. RTL (RIGHT-TO-LEFT) SUPPORT
================================================================================

Q: How is RTL handled?
A: Document direction is set based on language:

   const setDocumentDirection = (lang: string) => {
       const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
       const dir = rtlLanguages.includes(lang) ? 'rtl' : 'ltr';
       document.documentElement.dir = dir;
       document.documentElement.lang = lang;
   };

Q: How do I check if current language is RTL?
A: Use i18n.dir() method:

   import { useTranslation } from 'react-i18next';

   const { i18n } = useTranslation();
   const isRTL = i18n.dir() === 'rtl';

Q: How do I apply RTL-aware styles?
A: Use logical CSS properties or conditional classes:

   // Logical properties (recommended)
   <div className="ps-4 pe-2">  // padding-start, padding-end

   // Conditional spacing
   <span className={isRTL ? 'ml-2' : 'mr-2'}>

   // RTL-aware flex
   <div className="flex flex-row rtl:flex-row-reverse">

Q: How do I handle RTL icons?
A: Flip directional icons:

   <ArrowRight className={isRTL ? 'rotate-180' : ''} />

================================================================================
                         8. LANGUAGE SWITCHING
================================================================================

Q: How do I change the language programmatically?
A: Use i18n.changeLanguage():

   import { useTranslation } from 'react-i18next';

   const LanguageSwitcher = () => {
       const { i18n } = useTranslation();

       const changeLanguage = (lang: string) => {
           i18n.changeLanguage(lang);
           localStorage.setItem('app-language', lang);

           // Update document direction for RTL languages
           const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
           document.documentElement.dir = rtlLanguages.includes(lang) ? 'rtl' : 'ltr';
           document.documentElement.lang = lang;
       };

       return (
           <>
               <button onClick={() => changeLanguage('en')}>English</button>
               <button onClick={() => changeLanguage('ar')}>العربية</button>
           </>
       );
   };

Q: How do I get the current language?
A: Access via i18n.language:

   const { i18n } = useTranslation();
   const currentLang = i18n.language;

Q: How do I format dates based on language?
A: Use dayjs or date-fns with locale:

   import dayjs from 'dayjs';

   // Load locale dynamically
   await import(`dayjs/locale/${i18n.language}`);
   dayjs.locale(i18n.language);

   // Format date
   dayjs(date).format('DD MMMM YYYY');

================================================================================
                           9. BEST PRACTICES
================================================================================

Q: What are the key best practices?
A:
   1. NEVER hardcode user-facing text
   2. ALWAYS add keys to ALL language files
   3. Use descriptive key names
   4. Group related keys logically
   5. Keep translations flat when possible
   6. Test all languages after changes
   7. Use common namespace for shared elements

Q: How should I structure translation keys?
A: Follow hierarchical structure by feature:

   {
       "[page]": {
           "pageTitle": "Page Title",
           "[component]": {
               "[element]": "Element text"
           },
           "messages": {
               "success": "Success message",
               "error": "Error message"
           }
       }
   }

Q: What should go in common.json vs specific namespace?
A:
   COMMON.JSON:
   - Button labels (Save, Cancel, Submit)
   - Loading states
   - Generic errors
   - Shared UI elements
   - Form actions

   SPECIFIC NAMESPACE:
   - Page titles
   - Feature-specific content
   - Form labels for that module
   - Module-specific messages

Q: How do I handle long text or paragraphs?
A: Keep them in JSON but consider:
   - Breaking into smaller keys if reusable
   - Using interpolation for dynamic parts
   - Keeping formatting simple (no HTML in translations)

Q: Should I use translation keys in API responses?
A: No. Keep translations client-side only.
   API should return data, not translated text.

================================================================================
                          10. TROUBLESHOOTING
================================================================================

Q: Translation key shows instead of text. What's wrong?
A: Check these:
   1. Key exists in JSON file
   2. Correct namespace in useTranslation()
   3. JSON syntax is valid
   4. No typos in key path
   5. File is imported in locales config

Q: How do I debug translation issues?
A: Use these techniques:

   // Check if key exists
   console.log(i18n.exists('namespace:section.key'));

   // Log current language
   console.log(i18n.language);

   // Log all loaded resources
   console.log(i18n.store.data);

   // Check translation value
   console.log(t('section.key'));

Q: Interpolation not working?
A: Verify variable names match:

   JSON: "hello": "Hello {{userName}}"

   CORRECT: t('hello', { userName: 'John' })
   WRONG:   t('hello', { name: 'John' })

Q: Language not persisting after refresh?
A: Ensure localStorage is being set:

   localStorage.setItem('app-language', lang);

   And check that initialization reads from localStorage.

Q: RTL text not displaying correctly?
A: Check:
   1. Font supports the language's characters
   2. dir attribute is set on document
   3. Text is properly encoded (UTF-8)

Q: How do I validate JSON syntax?
A: Use JSON.parse or online validator:

   // In browser console
   JSON.parse(jsonString);

   // Or use: jsonlint.com

================================================================================
                              QUICK REFERENCE
================================================================================

IMPORT:
    import { useTranslation } from 'react-i18next';

INITIALIZE:
    const { t } = useTranslation('namespace');
    const { t, i18n } = useTranslation('namespace');

BASIC USAGE:
    {t('section.key')}

WITH INTERPOLATION:
    {t('section.key', { variable: value })}

WITH PLURALIZATION:
    {t('item', { count: 5 })}

MULTIPLE NAMESPACES:
    const { t } = useTranslation(['feature', 'common']);
    t('feature:key') or t('common:key')

CHECK RTL:
    const isRTL = i18n.dir() === 'rtl';

CHANGE LANGUAGE:
    i18n.changeLanguage('ar');

GET CURRENT LANGUAGE:
    i18n.language

CHECK KEY EXISTS:
    i18n.exists('namespace:key')

================================================================================
                           TRANSLATION CHECKLIST
================================================================================

[ ] Key added to primary language JSON file
[ ] Key added to all other language JSON files
[ ] Keys match exactly in all files
[ ] Using correct namespace in component
[ ] Tested in all supported languages
[ ] RTL layout verified (if applicable)
[ ] No hardcoded text in component
[ ] Interpolation variables match between code and JSON

================================================================================
                                   END
================================================================================