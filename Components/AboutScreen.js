// Components/AboutScreen.js
import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  Pressable,
  Share,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

/* assets (пути подставь под свои файлы) */
const BG_IMG    = require('../assets/bg.webp');
const LOGO_SM   = require('../assets/logo.webp');           // маленькая иконка слева в шапке
const LOGO_BIG  = require('../assets/logo.webp');           // большая картинка в центре (можно отдельный файл)
const FRAME_IMG = require('../assets/frame_candy.webp');    // рамка-«конфета»

export default function AboutScreen({ navigation }) {
  const goHome = () => navigation.replace('Home');

  const onShare = useCallback(async () => {
    try {
      await Share.share({
        title: 'Air Moments Diary',
        message:
          'Air Moments Diary — a cozy place to store your memories. Add photos, notes and organize them into balloon-themed categories!',
      });
    } catch {}
  }, []);

  return (
    <ImageBackground source={BG_IMG} style={{ flex: 1 }} resizeMode="cover">
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={goHome} hitSlop={10} style={styles.logoBtn}>
            <Image source={LOGO_SM} style={styles.logo} />
          </Pressable>
          <Text style={styles.headerTitle}>About</Text>

          {/* нижняя часть квадрата со скруглением 25 */}
          <View pointerEvents="none" style={styles.headerCap} />
        </View>

        {/* Big logo */}
        <View style={{ alignItems: 'center', marginTop: 16 }}>
          <Image
            source={LOGO_BIG}
            style={{ width: width * 0.66, height: width * 0.66, borderRadius: 28 }}
            resizeMode="contain"
          />
        </View>

        {/* Text in candy-frame */}
        <View style={styles.panelWrap}>
          <View style={styles.panelOuter}>
            <Image
              source={FRAME_IMG}
              style={styles.frameImg}
              resizeMode="contain"
              pointerEvents="none"
            />
            <View style={styles.panel}>
              <Text style={styles.text}>
                <Text style={styles.bold}>Air Moments Diary</Text> is a great place to
                store your memories. Add photos, notes, and organize them into
                balloon-themed categories so you can relive your happiest moments
                anytime.
              </Text>
            </View>
          </View>
        </View>

        {/* Share button */}
        <Pressable onPress={onShare} style={styles.shareBtn}>
          <Text style={styles.shareTxt}>Share</Text>
        </Pressable>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'relative',
    marginHorizontal: -5,
    marginTop: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    overflow: 'visible',
  },

  /* тот самый «срезанный квадрат» */
  headerCap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -1,          // чуть увести, чтобы линия хедера сливалась
    height: 34,          // это «нижняя часть квадрата»
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderColor: '#FF6B35',
    borderWidth: 3,
    borderTopWidth: 0,   // срезаем верх – остаются боковые+низ
    backgroundColor: 'transparent',
  },

  logoBtn: { padding: 6 },
  logo: { width: 98, height: 98, borderRadius: 10 },
  headerTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: '#FF0000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  panelWrap: { marginTop: 18, marginHorizontal: 16, alignItems: 'center' },
  panelOuter: {
    position: 'relative',
    width: '100%',
    minHeight: 200,
    justifyContent: 'center',
  },
  frameImg: {
    position: 'absolute',
    width: '100%',
    height: 230,
    top: -20,
    left: 0,
    resizeMode: 'contain',
  },
  panel: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  text: { 
    fontSize: 18, 
    lineHeight: 26, 
    color: '#FF8A35',
    textShadowColor: '#FF3B2E',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  bold: { 
    fontWeight: '800', 
    color: '#FF8A35',
    textShadowColor: '#FF3B2E',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  shareBtn: { marginTop: 22, alignSelf: 'center', paddingVertical: 8, paddingHorizontal: 12 },
  shareTxt: {
    fontSize: 40,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: '#B02B2B',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
});
