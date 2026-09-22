#!/bin/sh
set -eu
root_dir=$(cd "$(dirname "$0")/.." && pwd)
output_dir=$(mktemp -d "${TMPDIR:-/tmp}/castalert-test.XXXXXX")
config_file=$(mktemp "${TMPDIR:-/tmp}/castalert-test-tsconfig.XXXXXX.json")
stub_dir=$(mktemp -d "${TMPDIR:-/tmp}/castalert-test-stubs.XXXXXX")
trap 'rm -rf "$output_dir" "$config_file" "$stub_dir"' EXIT HUP INT TERM

# services/push.ts imports several Expo/React Native modules that only exist
# for a bundler + device runtime (Metro), not plain Node -- Node 22 refuses to
# even load some of their internal .ts files directly. The three functions
# this suite tests (buildCastingNotification, matchesPreferences,
# groupNotifications) are pure and never touch those modules; only the
# untested device-registration/storage functions in this same file do. These
# throwaway stubs exist purely so requiring the file doesn't crash -- they are
# never asserted against.
mkdir -p "$stub_dir/node_modules/expo-notifications"
echo 'module.exports = { setNotificationHandler: () => {} };' > "$stub_dir/node_modules/expo-notifications/index.js"
mkdir -p "$stub_dir/node_modules/expo-device"
echo 'module.exports = {};' > "$stub_dir/node_modules/expo-device/index.js"
mkdir -p "$stub_dir/node_modules/expo-constants"
echo 'module.exports = {};' > "$stub_dir/node_modules/expo-constants/index.js"
mkdir -p "$stub_dir/node_modules/react-native"
echo 'module.exports = { Platform: { OS: "ios" } };' > "$stub_dir/node_modules/react-native/index.js"
mkdir -p "$stub_dir/node_modules/@react-native-async-storage/async-storage"
echo 'module.exports = {};' > "$stub_dir/node_modules/@react-native-async-storage/async-storage/index.js"

cat > "$config_file" <<EOF
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "jsx": "react",
    "baseUrl": "$root_dir",
    "paths": { "@/*": ["$root_dir/*"] },
    "typeRoots": ["$root_dir/node_modules/@types"],
    "outDir": "$output_dir"
  },
  "files": ["$root_dir/services/push.ts", "$root_dir/services/push.test.ts"]
}
EOF

./node_modules/.bin/tsc -p "$config_file"
NODE_PATH="$stub_dir/node_modules:$root_dir/node_modules" node --test "$output_dir/services/push.test.js"
