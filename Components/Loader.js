// Components/Loader.js
import React, { useEffect, useMemo, useRef } from 'react';
import {
  View,
  Image,
  ImageBackground,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');

/* ── assets ──────────────────────────────────────────────────────────── */
// поменяй пути, если у тебя другие имена файлов
const BG_IMG   = require('../assets/bg.webp');      // полноэкранный фон
const LOGO_IMG = require('../assets/logo.webp');    // квадратный логотип

export default function Loader({
  delay = 3000,   // сколько держать заставку (мс)
  fadeMs = 300,   // длительность затухания (мс)
  onFinish,       // колбэк после исчезновения
}) {
  const opacity = useRef(new Animated.Value(1)).current;

  // HTML для WebView: «глитч»-текст Loading…
  const glitchHTML = useMemo(
    () => `<!doctype html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
<style>
  html,body{margin:0;padding:0;background:transparent;overflow:hidden;}
  .wrap{display:flex;align-items:center;justify-content:center;width:100%;height:100%;}
  /* From Uiverse.io by andrew-demchenk0 */
  .glitch{position:relative;font-size:25px;font-weight:700;line-height:1.2;color:#fff;letter-spacing:5px;z-index:1;animation:shift 1s ease-in-out infinite alternate;}
  .glitch:before,.glitch:after{display:block;content:attr(data-glitch);position:absolute;top:0;left:0;opacity:.8}
  .glitch:before{animation:glitch .4s cubic-bezier(.25,.46,.45,.94) both infinite;color:#8b00ff;z-index:-1}
  .glitch:after{animation:glitch .4s cubic-bezier(.25,.46,.45,.94) reverse both infinite;color:#00e571;z-index:-2}
  @keyframes glitch{0%{transform:translate(0)}20%{transform:translate(-3px,3px)}40%{transform:translate(-3px,-3px)}60%{transform:translate(3px,3px)}80%{transform:translate(3px,-3px)}100%{transform:translate(0)}}
  @keyframes shift{
    0%,40%,44%,58%,61%,65%,69%,73%,100%{transform:skewX(0deg)}
    41%{transform:skewX(10deg)}42%{transform:skewX(-10deg)}
    59%{transform:skewX(40deg) skewY(10deg)}60%{transform:skewX(-40deg) skewY(-10deg)}
    63%{transform:skewX(10deg) skewY(-5deg)}70%{transform:skewX(-50deg) skewY(-20deg)}
    71%{transform:skewX(10deg) skewY(-10deg)}
  }
</style>
</head>
<body>
  <div class="wrap">
    <div data-glitch="Loading..." class="glitch">Loading...</div>
  </div>
</body>
</html>`,
    []
  );

  useEffect(() => {
    const t = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: fadeMs,
        useNativeDriver: true,
      }).start(() => {
        onFinish && onFinish();
      });
    }, delay);
    return () => clearTimeout(t);
  }, [delay, fadeMs, onFinish, opacity]);

  return (
    <Animated.View style={[styles.root, { opacity }]} pointerEvents="none">
      <ImageBackground
        source={BG_IMG}
        style={styles.bg}
        imageStyle={styles.bgImage}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safe}>
          {/* логотип по центру */}
          <View style={styles.logoWrap}>
            <Image source={LOGO_IMG} style={styles.logo} resizeMode="contain" />
          </View>

          {/* «Loading…» на чёрной плашке у низа */}
          <View style={styles.loadBar}>
            <WebView
              originWhitelist={['*']}
              source={{ html: glitchHTML }}
              style={styles.webview}
              containerStyle={styles.webviewContainer}
              automaticallyAdjustContentInsets={false}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              bounces={false}
              javaScriptEnabled
              domStorageEnabled
              androidHardwareAccelerationDisabled={false}
            />
          </View>
        </SafeAreaView>
      </ImageBackground>
    </Animated.View>
  );
}

/* ── styles ───────────────────────────────────────────────────────────── */
const BAR_W = Math.min(0.72 * width, 360);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  bg: { flex: 1 },
  bgImage: { transform: [{ scale: 1.02 }] },
  safe: { flex: 1, justifyContent: 'space-between' },

  logoWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 24,
  },
  logo: {
    width: width * 0.72,
    height: width * 0.72,
    borderRadius: 32,
  },

  loadBar: {
    alignSelf: 'center',
    width: BAR_W,
    height: 72,
    marginBottom: Platform.select({ ios: 36, android: 28 }),
    backgroundColor: '#000',
    borderRadius: 10,
    overflow: 'hidden',
    // лёгкая тень, как на скрине:
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },

  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  webviewContainer: {
    backgroundColor: 'transparent',
  },
});
