# 📱 Screen Recorder Pro

تطبيق أندرويد احترافي لتسجيل شاشة الهاتف بجودة عالية مع واجهة مستخدم عصرية وجذابة.

## ✨ المميزات

- 🎥 **تسجيل شاشة عالي الجودة** - يدعم دقة تصل إلى 4K
- 🎙️ **تسجيل الصوت** - دعم المايكروفون والصوت الداخلي
- ⚡ **معدل إطارات مرن** - 30/60/90/120 FPS
- 🎯 **العد التنازلي** - مؤقت قبل بدء التسجيل
- 🎨 **واجهة مستخدم داكنة احترافية** - تصميم Material 3 عصري
- 📦 **حفظ تلقائي** - حفظ فيديوهات في مجلد ScreenRecorderPro
- 🔔 **إشعارات مع أزرار تحكم** - تحكم سريع من شريط الإشعارات
- ⏸️ **إيقاف مؤقت** - إمكانية إيقاف واستئناف التسجيل

## 🚀 البناء

```bash
./gradlew assembleDebug
```

سيكون ملف APK في: `app/build/outputs/apk/debug/app-debug.apk`

## 📂 هيكل المشروع

```
ScreenRecorderPro/
├── app/
│   └── src/main/
│       ├── java/com/screenrecorder/pro/
│       │   ├── MainActivity.kt
│       │   ├── service/ScreenRecordService.kt
│       │   ├── ui/theme/ (Color.kt, Theme.kt)
│       │   ├── ui/screens/ (MainScreen.kt, SettingsSheet.kt)
│       │   ├── ui/components/ (RecorderButton.kt, CountdownOverlay.kt)
│       │   └── utils/PreferencesManager.kt
│       ├── res/values/ (strings.xml, themes.xml, colors.xml)
│       └── AndroidManifest.xml
├── build.gradle.kts
├── settings.gradle.kts
├── gradle.properties
└── .github/workflows/build-apk.yml
```
