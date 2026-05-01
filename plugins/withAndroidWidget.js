/**
 * Expo Config Plugin — Widget Android "Prochain anniversaire"
 *
 * Ajoute un AppWidget natif Android qui affiche :
 *   🎁 Prochain anniversaire  (nom + jours restants)
 *   🌸 Prochaine fête prénom  (nom + jours restants)
 *
 * Données écrites par React Native via NativeModule WidgetDataModule
 * → SharedPreferences "ConfettiCakeWidget"
 */

const {
  withAndroidManifest,
  withMainApplication,
  withDangerousMod,
} = require('@expo/config-plugins');
const path = require('path');
const fs   = require('fs');

// ── Kotlin source ──────────────────────────────────────────────────────────────

const BIRTHDAY_WIDGET_PROVIDER_KT = (pkg) => `package ${pkg}

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews
import org.json.JSONArray

class BirthdayWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray,
    ) {
        for (id in appWidgetIds) updateWidget(context, appWidgetManager, id)
    }

    companion object {
        fun updateWidget(context: Context, mgr: AppWidgetManager, widgetId: Int) {
            val views = RemoteViews(context.packageName, R.layout.birthday_widget)
            val prefs = context.getSharedPreferences("ConfettiCakeWidget", Context.MODE_PRIVATE)
            val json  = prefs.getString("upcomingEvents", null)

            var bdName: String? = null; var bdDays = -1
            var ndName: String? = null; var ndDays = -1

            if (json != null) {
                try {
                    val arr = JSONArray(json)
                    for (i in 0 until arr.length()) {
                        val o = arr.getJSONObject(i)
                        val t = o.getString("type")
                        val d = o.getInt("days")
                        val n = o.getString("name")
                        if (t == "birthday" && bdDays == -1) { bdName = n; bdDays = d }
                        else if (t == "nameday" && ndDays == -1) { ndName = n; ndDays = d }
                    }
                } catch (_: Exception) {}
            }

            fun label(d: Int) = when (d) {
                0    -> "Aujourd'hui !"
                1    -> "Demain !"
                else -> "Dans \$d jours"
            }

            views.setTextViewText(
                R.id.widget_birthday_name,
                if (bdName != null) "🎁 \$bdName" else "🎁 Aucun anniversaire proche",
            )
            views.setTextViewText(
                R.id.widget_birthday_days,
                if (bdDays >= 0) label(bdDays) else "dans les 30 prochains jours",
            )
            views.setTextViewText(
                R.id.widget_nameday_name,
                if (ndName != null) "🌸 \$ndName" else "🌸 Aucune fête proche",
            )
            views.setTextViewText(
                R.id.widget_nameday_days,
                if (ndDays >= 0) label(ndDays) else "dans les 30 prochains jours",
            )

            // Tap → ouvre l'appli
            val intent       = context.packageManager.getLaunchIntentForPackage(context.packageName)
            val pendingIntent = PendingIntent.getActivity(
                context, 0, intent,
                PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT,
            )
            views.setOnClickPendingIntent(R.id.widget_root, pendingIntent)

            mgr.updateAppWidget(widgetId, views)
        }
    }
}
`;

const WIDGET_DATA_MODULE_KT = (pkg) => `package ${pkg}

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import org.json.JSONArray
import org.json.JSONObject

class WidgetDataModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "WidgetDataModule"

    @ReactMethod
    fun setUpcomingEvents(events: ReadableArray, promise: Promise) {
        try {
            val arr = JSONArray()
            for (i in 0 until events.size()) {
                val map = events.getMap(i) ?: continue
                arr.put(JSONObject().apply {
                    put("type", map.getString("type") ?: "")
                    put("name", map.getString("name") ?: "")
                    put("days", map.getInt("days"))
                })
            }
            reactContext
                .getSharedPreferences("ConfettiCakeWidget", Context.MODE_PRIVATE)
                .edit()
                .putString("upcomingEvents", arr.toString())
                .apply()

            // Demande au widget de se rafraîchir
            val mgr = AppWidgetManager.getInstance(reactContext)
            val ids = mgr.getAppWidgetIds(
                ComponentName(reactContext, BirthdayWidgetProvider::class.java),
            )
            if (ids.isNotEmpty()) {
                BirthdayWidgetProvider().onUpdate(reactContext, mgr, ids)
            }
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("WIDGET_ERROR", e.message, e)
        }
    }
}
`;

const WIDGET_DATA_PACKAGE_KT = (pkg) => `package ${pkg}

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class WidgetDataPackage : ReactPackage {
    override fun createNativeModules(ctx: ReactApplicationContext): List<NativeModule> =
        listOf(WidgetDataModule(ctx))

    override fun createViewManagers(ctx: ReactApplicationContext): List<ViewManager<*, *>> =
        emptyList()
}
`;

// ── XML resources ──────────────────────────────────────────────────────────────

const WIDGET_LAYOUT_XML = `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/widget_root"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:background="@drawable/widget_bg"
    android:padding="14dp">

    <!-- En-tête -->
    <TextView
        android:id="@+id/widget_title"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="🎂 ConfettiCake"
        android:textColor="#CCFFFFFF"
        android:textSize="11sp"
        android:textStyle="bold"
        android:layout_marginBottom="6dp" />

    <!-- Anniversaire -->
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="0dp"
        android:layout_weight="1"
        android:orientation="vertical"
        android:background="@drawable/widget_row_bg"
        android:padding="10dp"
        android:gravity="center_vertical"
        android:layout_marginBottom="5dp">

        <TextView
            android:id="@+id/widget_birthday_name"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="🎁 Chargement..."
            android:textColor="#FFFFFF"
            android:textSize="14sp"
            android:textStyle="bold"
            android:singleLine="true"
            android:ellipsize="end" />

        <TextView
            android:id="@+id/widget_birthday_days"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text=""
            android:textColor="#DDD0EE"
            android:textSize="11sp" />
    </LinearLayout>

    <!-- Fête du prénom -->
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="0dp"
        android:layout_weight="1"
        android:orientation="vertical"
        android:background="@drawable/widget_row_bg"
        android:padding="10dp"
        android:gravity="center_vertical">

        <TextView
            android:id="@+id/widget_nameday_name"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="🌸 Chargement..."
            android:textColor="#FFFFFF"
            android:textSize="14sp"
            android:textStyle="bold"
            android:singleLine="true"
            android:ellipsize="end" />

        <TextView
            android:id="@+id/widget_nameday_days"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text=""
            android:textColor="#DDD0EE"
            android:textSize="11sp" />
    </LinearLayout>

</LinearLayout>
`;

const WIDGET_BG_XML = `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android"
    android:shape="rectangle">
    <solid android:color="#CC9b6bb5" />
    <corners android:radius="18dp" />
</shape>
`;

const WIDGET_ROW_BG_XML = `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android"
    android:shape="rectangle">
    <solid android:color="#33FFFFFF" />
    <corners android:radius="10dp" />
</shape>
`;

const WIDGET_INFO_XML = `<?xml version="1.0" encoding="utf-8"?>
<appwidget-provider xmlns:android="http://schemas.android.com/apk/res/android"
    android:minWidth="250dp"
    android:minHeight="110dp"
    android:targetCellWidth="3"
    android:targetCellHeight="2"
    android:updatePeriodMillis="1800000"
    android:initialLayout="@layout/birthday_widget"
    android:resizeMode="horizontal|vertical"
    android:widgetCategory="home_screen" />
`;

// ── Plugin ─────────────────────────────────────────────────────────────────────

/** @type {(config: import('@expo/config-plugins').ExpoConfig) => import('@expo/config-plugins').ExpoConfig} */
module.exports = function withAndroidWidget(config) {
  const packageName = config.android?.package ?? 'com.confettiscake.app';

  // 1. Copie des fichiers Kotlin + XML dans le projet Android généré
  config = withDangerousMod(config, [
    'android',
    async (cfg) => {
      const root    = cfg.modRequest.projectRoot;
      const pkgPath = packageName.replace(/\./g, '/');
      const ktDir   = path.join(root, 'android', 'app', 'src', 'main', 'java', pkgPath);

      fs.mkdirSync(ktDir, { recursive: true });
      fs.writeFileSync(path.join(ktDir, 'BirthdayWidgetProvider.kt'), BIRTHDAY_WIDGET_PROVIDER_KT(packageName));
      fs.writeFileSync(path.join(ktDir, 'WidgetDataModule.kt'),       WIDGET_DATA_MODULE_KT(packageName));
      fs.writeFileSync(path.join(ktDir, 'WidgetDataPackage.kt'),       WIDGET_DATA_PACKAGE_KT(packageName));

      const layoutDir   = path.join(root, 'android', 'app', 'src', 'main', 'res', 'layout');
      const drawableDir = path.join(root, 'android', 'app', 'src', 'main', 'res', 'drawable');
      const xmlDir      = path.join(root, 'android', 'app', 'src', 'main', 'res', 'xml');

      [layoutDir, drawableDir, xmlDir].forEach((d) => fs.mkdirSync(d, { recursive: true }));
      fs.writeFileSync(path.join(layoutDir,   'birthday_widget.xml'),      WIDGET_LAYOUT_XML);
      fs.writeFileSync(path.join(drawableDir, 'widget_bg.xml'),            WIDGET_BG_XML);
      fs.writeFileSync(path.join(drawableDir, 'widget_row_bg.xml'),        WIDGET_ROW_BG_XML);
      fs.writeFileSync(path.join(xmlDir,      'birthday_widget_info.xml'), WIDGET_INFO_XML);

      return cfg;
    },
  ]);

  // 2. Déclare le receiver dans AndroidManifest.xml
  config = withAndroidManifest(config, (cfg) => {
    const app = cfg.modResults.manifest.application[0];
    if (!app.receiver) app.receiver = [];

    const exists = app.receiver.some((r) =>
      r.$?.['android:name']?.includes('BirthdayWidget'),
    );
    if (!exists) {
      app.receiver.push({
        $: {
          'android:name':     '.BirthdayWidgetProvider',
          'android:exported': 'true',
          'android:label':    'Prochain anniversaire',
        },
        'intent-filter': [{
          action: [{ $: { 'android:name': 'android.appwidget.action.APPWIDGET_UPDATE' } }],
        }],
        'meta-data': [{
          $: {
            'android:name':     'android.appwidget.provider',
            'android:resource': '@xml/birthday_widget_info',
          },
        }],
      });
    }
    return cfg;
  });

  // 3. Enregistre WidgetDataPackage dans MainApplication.kt
  config = withMainApplication(config, (cfg) => {
    let src = cfg.modResults.contents;
    if (!src.includes('WidgetDataPackage')) {
      // Ajoute packages.add(...) juste avant return packages
      src = src.replace(
        '// Packages that cannot be autolinked yet can be added manually here, for example:\n        // packages.add(MyReactNativePackage())\n        return packages',
        '// Packages that cannot be autolinked yet can be added manually here, for example:\n        // packages.add(MyReactNativePackage())\n        packages.add(WidgetDataPackage())\n        return packages',
      );
      // Fallback si le commentaire exact a été modifié par Expo
      if (!src.includes('WidgetDataPackage')) {
        src = src.replace(
          'return packages',
          'packages.add(WidgetDataPackage())\n        return packages',
        );
      }
    }
    cfg.modResults.contents = src;
    return cfg;
  });

  return config;
};
