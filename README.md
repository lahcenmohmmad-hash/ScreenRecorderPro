# SpellMaster – متقن الإملاء (تطبيق أندرويد)

تدريب إملاء الكلمات الإنجليزية: نطق صوتي أصلي بدون إنترنت، حروف مبعثرة مع حروف زائدة، تكرار متباعد ذكي، ووضع حفظ.

## تحميل التطبيق
https://github.com/lahcenmohmmad-hash/ScreenRecorderPro/releases/latest/download/SpellMaster.apk

افتح الرابط من هاتفك ← نزّل الملف ← ثبّته (اسمح بالتثبيت من هذا المصدر عند السؤال).

## النطق بدون إنترنت
الإعدادات ← تحويل النص إلى كلام ← Google ← تثبيت بيانات الصوت ← English.

يُبنى الـAPK تلقائياً عند كل تعديل على main عبر GitHub Actions.

## القاموس المدمج
المعاني والأمثلة تأتي من **Princeton WordNet 3.1** (رخصة WordNet: https://wordnet.princeton.edu/license-and-commercial-use) وتُدمج داخل التطبيق عند البناء، فتعمل بدون إنترنت.

## المعاني العربية (بدون إنترنت)
مصدرها قاموس **en-ar** من مشروع koreader-dicts (https://github.com/DanielGregorini/koreader-dicts)، الإصدار v1.3.0، ورخصته **CC BY-SA 4.0**. وهو مبني على ويكاموس الإنجليزي (عبر kaikki.org) وArabic WordNet وPrinceton WordNet. الملف الأصلي محفوظ في `data/en-ar.zip` ومعه نصا LICENSE وATTRIBUTION، ويحوّله `scripts/build-ar.py` إلى ملفات JSON أصغر عند البناء (تعديل: اقتصر على الكلمات التي لها ترجمة عربية وعلى أول 4 أنواع نحوية و8 مرادفات). والبيانات الناتجة تبقى تحت رخصة CC BY-SA 4.0.
