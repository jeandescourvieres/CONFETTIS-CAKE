/**
 * Expo Config Plugin — Widget iOS ConfettiCake
 *
 * Ajoute une extension WidgetKit qui affiche :
 *   🎁 Prochain anniversaire (nom + jours restants)
 *   🌸 Prochaine fête prénom  (nom + jours restants)
 *
 * Données partagées via App Groups UserDefaults "group.com.confettiscake.app".
 * La mise à jour depuis React Native est assurée par WidgetDataBridge (Swift + ObjC).
 *
 * Requiert : EAS Build (pas Expo Go) + Apple Developer Account.
 */

const {
  withXcodeProject,
  withEntitlementsPlist,
  withDangerousMod,
} = require('@expo/config-plugins');
const path = require('path');
const fs   = require('fs');

const BUNDLE_ID        = 'com.confettiscake.app';
const WIDGET_NAME      = 'ConfettiCakeWidget';
const WIDGET_BUNDLE_ID = `${BUNDLE_ID}.widget`;
const APP_GROUP        = `group.${BUNDLE_ID}`;

// ── Swift — Extension WidgetKit ────────────────────────────────────────────────

const WIDGET_SWIFT = `
import WidgetKit
import SwiftUI

// ─── Modèle de données ────────────────────────────────────────────────────────

struct CCWidgetEvent: Codable {
    let type: String
    let name: String
    let days: Int

    var dayLabel: String {
        switch days {
        case 0:  return "Aujourd'hui !"
        case 1:  return "Demain !"
        default: return "Dans \\(days) jours"
        }
    }
}

struct CCEntry: TimelineEntry {
    let date:     Date
    let birthday: CCWidgetEvent?
    let nameday:  CCWidgetEvent?
}

// ─── Lecture App Groups UserDefaults ──────────────────────────────────────────

private func loadEvents() -> (birthday: CCWidgetEvent?, nameday: CCWidgetEvent?) {
    guard
        let json  = UserDefaults(suiteName: "${APP_GROUP}")?.string(forKey: "upcomingEvents"),
        let data  = json.data(using: .utf8),
        let items = try? JSONDecoder().decode([CCWidgetEvent].self, from: data)
    else { return (nil, nil) }
    return (
        items.first { $0.type == "birthday" },
        items.first { $0.type == "nameday"  }
    )
}

// ─── Timeline provider ────────────────────────────────────────────────────────

struct CCProvider: TimelineProvider {
    func placeholder(in context: Context) -> CCEntry {
        CCEntry(date: Date(),
                birthday: CCWidgetEvent(type: "birthday", name: "Marie", days: 3),
                nameday:  nil)
    }
    func getSnapshot(in context: Context, completion: @escaping (CCEntry) -> Void) {
        let (bd, nd) = loadEvents()
        completion(CCEntry(date: Date(), birthday: bd, nameday: nd))
    }
    func getTimeline(in context: Context, completion: @escaping (Timeline<CCEntry>) -> Void) {
        let (bd, nd) = loadEvents()
        let entry    = CCEntry(date: Date(), birthday: bd, nameday: nd)
        let next     = Calendar.current.date(byAdding: .minute, value: 30, to: Date())!
        completion(Timeline(entries: [entry], policy: .after(next)))
    }
}

// ─── Gradient partagé ─────────────────────────────────────────────────────────

private var ccGradient: LinearGradient {
    LinearGradient(
        gradient: Gradient(colors: [
            Color(red: 0.61, green: 0.42, blue: 0.71),
            Color(red: 0.47, green: 0.30, blue: 0.60),
        ]),
        startPoint: .topLeading,
        endPoint:   .bottomTrailing
    )
}

// ─── Ligne événement ──────────────────────────────────────────────────────────

struct CCEventRow: View {
    let icon:     String
    let name:     String?
    let label:    String?
    let fallback: String

    var body: some View {
        VStack(alignment: .leading, spacing: 3) {
            Text(name.map { "\\(icon) \\($0)" } ?? "\\(icon) \\(fallback)")
                .font(.system(size: 13, weight: .bold))
                .foregroundColor(.white)
                .lineLimit(1)
            Text(name != nil ? (label ?? "") : "dans les 30 prochains jours")
                .font(.system(size: 11))
                .foregroundColor(Color(red: 0.87, green: 0.82, blue: 0.93))
        }
        .padding(8)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color.white.opacity(0.15))
        .cornerRadius(10)
    }
}

// ─── Vue principale ───────────────────────────────────────────────────────────

struct CCWidgetView: View {
    var entry: CCProvider.Entry

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text("🎂 ConfettiCake")
                .font(.system(size: 10, weight: .bold))
                .foregroundColor(.white.opacity(0.7))
            CCEventRow(
                icon:     "🎁",
                name:     entry.birthday?.name,
                label:    entry.birthday?.dayLabel,
                fallback: "Aucun anniversaire proche"
            )
            CCEventRow(
                icon:     "🌸",
                name:     entry.nameday?.name,
                label:    entry.nameday?.dayLabel,
                fallback: "Aucune fête proche"
            )
        }
        .padding(12)
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    }
}

// ─── Point d'entrée ───────────────────────────────────────────────────────────

@main
struct ConfettiCakeWidget: Widget {
    let kind = "${WIDGET_NAME}"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: CCProvider()) { entry in
            if #available(iOSApplicationExtension 17.0, *) {
                CCWidgetView(entry: entry)
                    .containerBackground(ccGradient, for: .widget)
            } else {
                ZStack {
                    ccGradient.ignoresSafeArea()
                    CCWidgetView(entry: entry)
                }
            }
        }
        .configurationDisplayName("ConfettiCake")
        .description("Prochain anniversaire et fête du prénom")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}
`.trim();

// ── Swift — NativeModule bridge (main app) ────────────────────────────────────

const BRIDGE_SWIFT = `
import Foundation
import WidgetKit

/// NativeModule React Native → App Groups UserDefaults → WidgetKit reload
@objc(WidgetDataBridge)
class WidgetDataBridge: NSObject {

    @objc(setUpcomingEvents:resolver:rejecter:)
    func setUpcomingEvents(
        _ events: NSArray,
        resolve: @escaping RCTPromiseResolveBlock,
        reject:  @escaping RCTPromiseRejectBlock
    ) {
        do {
            let arr: [[String: Any]] = events.compactMap { item -> [String: Any]? in
                guard let d = item as? [String: Any] else { return nil }
                return [
                    "type": d["type"] as? String ?? "",
                    "name": d["name"] as? String ?? "",
                    "days": d["days"] as? Int    ?? 0,
                ]
            }
            let data = try JSONSerialization.data(withJSONObject: arr)
            let json = String(data: data, encoding: .utf8) ?? "[]"

            UserDefaults(suiteName: "${APP_GROUP}")?.set(json, forKey: "upcomingEvents")

            if #available(iOS 14.0, *) {
                WidgetCenter.shared.reloadAllTimelines()
            }
            resolve(nil)
        } catch {
            reject("WIDGET_ERROR", error.localizedDescription, error)
        }
    }

    @objc static func requiresMainQueueSetup() -> Bool { false }
}
`.trim();

// ── ObjC — Bridge header (main app) ───────────────────────────────────────────

const BRIDGE_M = `
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(WidgetDataBridge, NSObject)

RCT_EXTERN_METHOD(setUpcomingEvents:(NSArray *)events
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
`.trim();

// ── Info.plist — Extension ────────────────────────────────────────────────────

const WIDGET_PLIST = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDevelopmentRegion</key>
    <string>fr</string>
    <key>CFBundleDisplayName</key>
    <string>ConfettiCake</string>
    <key>CFBundleExecutable</key>
    <string>$(EXECUTABLE_NAME)</string>
    <key>CFBundleIdentifier</key>
    <string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundleName</key>
    <string>$(PRODUCT_NAME)</string>
    <key>CFBundlePackageType</key>
    <string>XPC!</string>
    <key>CFBundleShortVersionString</key>
    <string>$(MARKETING_VERSION)</string>
    <key>CFBundleVersion</key>
    <string>$(CURRENT_PROJECT_VERSION)</string>
    <key>NSExtension</key>
    <dict>
        <key>NSExtensionPointIdentifier</key>
        <string>com.apple.widgetkit-extension</string>
    </dict>
</dict>
</plist>`;

// ── Entitlements — Extension ──────────────────────────────────────────────────

const WIDGET_ENTITLEMENTS = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.security.application-groups</key>
    <array>
        <string>${APP_GROUP}</string>
    </array>
</dict>
</plist>`;

// ── Plugin ─────────────────────────────────────────────────────────────────────

/** @type {(config: import('@expo/config-plugins').ExpoConfig) => import('@expo/config-plugins').ExpoConfig} */
module.exports = function withIOSWidget(config) {

  // 1. Écriture des fichiers source Swift/ObjC/Plist
  config = withDangerousMod(config, [
    'ios',
    async (cfg) => {
      const root     = cfg.modRequest.projectRoot;
      const projName = cfg.modRequest.projectName;
      const iosDir   = path.join(root, 'ios');

      // Extension directory
      const widgetDir = path.join(iosDir, WIDGET_NAME);
      fs.mkdirSync(widgetDir, { recursive: true });
      fs.writeFileSync(path.join(widgetDir, `${WIDGET_NAME}.swift`),         WIDGET_SWIFT);
      fs.writeFileSync(path.join(widgetDir, 'Info.plist'),                   WIDGET_PLIST);
      fs.writeFileSync(path.join(widgetDir, `${WIDGET_NAME}.entitlements`),  WIDGET_ENTITLEMENTS);

      // NativeModule bridge dans l'app principale
      const appDir = path.join(iosDir, projName);
      if (fs.existsSync(appDir)) {
        fs.writeFileSync(path.join(appDir, 'WidgetDataBridge.swift'), BRIDGE_SWIFT);
        fs.writeFileSync(path.join(appDir, 'WidgetDataBridge.m'),     BRIDGE_M);
      }

      return cfg;
    },
  ]);

  // 2. App Groups sur l'app principale
  config = withEntitlementsPlist(config, (cfg) => {
    const groups = cfg.modResults['com.apple.security.application-groups'] ?? [];
    if (!groups.includes(APP_GROUP)) {
      cfg.modResults['com.apple.security.application-groups'] = [...groups, APP_GROUP];
    }
    return cfg;
  });

  // 3. Modification du projet Xcode
  config = withXcodeProject(config, (cfg) => {
    const project = cfg.modResults;

    // Idempotent : skip si la target existe déjà
    const nativeTargets = project.pbxNativeTargetSection();
    const alreadyAdded  = Object.values(nativeTargets).some(
      (t) => t && t.name === WIDGET_NAME,
    );
    if (alreadyAdded) return cfg;

    try {
      // ── Création de la target extension ──────────────────────────────────
      const extTarget  = project.addTarget(
        WIDGET_NAME,
        'app_extension',
        WIDGET_NAME,
        WIDGET_BUNDLE_ID,
      );
      if (!extTarget) return cfg;

      const extUuid = extTarget.uuid;

      // ── Groupe de fichiers ────────────────────────────────────────────────
      const groupKey = project.pbxCreateGroup(WIDGET_NAME, WIDGET_NAME);

      // ── Ajout du fichier Swift à la target ───────────────────────────────
      project.addSourceFile(
        `${WIDGET_NAME}/${WIDGET_NAME}.swift`,
        { target: extUuid },
        groupKey,
      );

      // ── Ajout Info.plist comme resource ──────────────────────────────────
      project.addResourceFile(
        `${WIDGET_NAME}/Info.plist`,
        { target: extUuid },
        groupKey,
      );

      // ── Frameworks ───────────────────────────────────────────────────────
      project.addFramework('WidgetKit.framework', { target: extUuid, link: true });
      project.addFramework('SwiftUI.framework',   { target: extUuid, link: true });

      // WidgetKit pour le bridge dans l'app principale
      const mainUuid = project.getFirstTarget().uuid;
      project.addFramework('WidgetKit.framework', { target: mainUuid, link: true, weak: true });

      // ── Build settings de l'extension ────────────────────────────────────
      const configs = project.pbxXCBuildConfigurationSection();
      for (const [key, bc] of Object.entries(configs)) {
        if (key.endsWith('_comment') || !bc.buildSettings) continue;
        const name = bc.buildSettings.PRODUCT_NAME;
        if (name !== `"${WIDGET_NAME}"` && name !== WIDGET_NAME) continue;

        Object.assign(bc.buildSettings, {
          SWIFT_VERSION:                   '5.0',
          CLANG_ENABLE_MODULES:            'YES',
          TARGETED_DEVICE_FAMILY:          '"1,2"',
          IPHONEOS_DEPLOYMENT_TARGET:      '16.0',
          CODE_SIGN_STYLE:                 'Automatic',
          PRODUCT_BUNDLE_IDENTIFIER:       `"${WIDGET_BUNDLE_ID}"`,
          SKIP_INSTALL:                    'YES',
          CODE_SIGN_ENTITLEMENTS:          `"${WIDGET_NAME}/${WIDGET_NAME}.entitlements"`,
          MARKETING_VERSION:               '1.0',
          CURRENT_PROJECT_VERSION:         '1',
          ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES: 'NO',
        });
      }

      // ── "Embed Foundation Extensions" sur la target principale ───────────
      // Cherche la file reference du .appex produit
      const fileRefs = project.pbxFileReferenceSection();
      const appexEntry = Object.entries(fileRefs).find(
        ([k, v]) =>
          !k.endsWith('_comment') &&
          v &&
          (v.path === `"${WIDGET_NAME}.appex"` || v.path === `${WIDGET_NAME}.appex`),
      );

      if (appexEntry) {
        const appexFileRefKey = appexEntry[0];
        const embedPhaseKey   = project.generateUuid();
        const buildFileKey    = project.generateUuid();
        const comment         = `${WIDGET_NAME}.appex in Embed Foundation Extensions`;

        // Build file (avec ATTRIBUTES: RemoveHeadersOnCopy)
        project.hash.project.objects['PBXBuildFile'] =
          project.hash.project.objects['PBXBuildFile'] || {};
        project.hash.project.objects['PBXBuildFile'][buildFileKey] = {
          isa:      'PBXBuildFile',
          fileRef:  appexFileRefKey,
          settings: { ATTRIBUTES: ['RemoveHeadersOnCopy'] },
        };
        project.hash.project.objects['PBXBuildFile'][`${buildFileKey}_comment`] = comment;

        // CopyFiles build phase
        project.hash.project.objects['PBXCopyFilesBuildPhase'] =
          project.hash.project.objects['PBXCopyFilesBuildPhase'] || {};
        project.hash.project.objects['PBXCopyFilesBuildPhase'][embedPhaseKey] = {
          isa:                           'PBXCopyFilesBuildPhase',
          buildActionMask:               2147483647,
          dstPath:                       '""',
          dstSubfolderSpec:              13, // PlugIns / App Extensions
          files:                         [{ value: buildFileKey, comment }],
          name:                          '"Embed Foundation Extensions"',
          runOnlyForDeploymentPostprocessing: 0,
        };
        project.hash.project.objects['PBXCopyFilesBuildPhase'][`${embedPhaseKey}_comment`] =
          'Embed Foundation Extensions';

        // Ajout de la phase à la target principale
        const mainTarget = project.pbxNativeTargetSection()[mainUuid];
        if (mainTarget && Array.isArray(mainTarget.buildPhases)) {
          mainTarget.buildPhases.push({
            value:   embedPhaseKey,
            comment: 'Embed Foundation Extensions',
          });
        }
      }

    } catch (e) {
      console.warn('[withIOSWidget] Xcode modification error (non-fatal):', e.message);
    }

    return cfg;
  });

  return config;
};
