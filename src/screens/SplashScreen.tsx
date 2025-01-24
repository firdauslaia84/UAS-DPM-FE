import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Animated,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ActivityIndicator,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/index";

const { width, height } = Dimensions.get("window");

type SplashScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Splash"
>;

type Props = {
  navigation: SplashScreenNavigationProp;
};

const slides = [
  {
    backgroundType: "image",
    backgroundImage: require("../../assets/images/bg.png"),
    title: "Unlimited viewing\nof movies, Series\nand more.",
    illustration: null,
  },
  {
    backgroundType: "color",
    backgroundColor: "#000000",
    title: "Watch your favourite\nmovies and Series anywhere\nyou go",
    illustration: require("../../assets/images/landing1.png"),
  },
  {
    backgroundType: "color",
    backgroundColor: "#000000",
    title: "Be notified when your\nfavourite titles comes to\nour platform",
    illustration: require("../../assets/images/landing2.png"),
  },
  {
    backgroundType: "color",
    backgroundColor: "#000000",
    title: "Share your access with\na family members",
    illustration: require("../../assets/images/landing3.png"),
  },
];

const SplashScreen = ({ navigation }: Props) => {
  const [isLoadingSignUp, setIsLoadingSignUp] = useState(false);
  const [isLoadingSignIn, setIsLoadingSignIn] = useState(false);
  const [error, setError] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;
  const scrollRef = useRef<ScrollView>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const scaleAnims = useRef(slides.map(() => new Animated.Value(0.8))).current;

  const logoSlideAnim = useRef(new Animated.Value(-100)).current;
  const logoFadeAnim = useRef(new Animated.Value(0)).current;
  const titleSlideAnim = useRef(new Animated.Value(100)).current;
  const titleFadeAnim = useRef(new Animated.Value(0)).current;

const handleSignUp = () => {
  setIsLoadingSignUp(true);
  setError("");
  try {
    navigation.navigate("Subscription");
  } catch (error) {
    setError("Failed to navigate to Sign Up page");
  } finally {
    setIsLoadingSignUp(false);
  }
};

const handleSignIn = () => {
  setIsLoadingSignIn(true);
  setError("");
  try {
    navigation.navigate("Login");
  } catch (error) {
    setError("Failed to navigate to Sign In page");
  } finally {
    setIsLoadingSignIn(false);
  }
};

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(logoFadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(logoSlideAnim, {
          toValue: 0,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(titleFadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(titleSlideAnim, {
          toValue: 0,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    Animated.spring(scaleAnims[currentPage], {
      toValue: 1,
      friction: 8,
      useNativeDriver: true,
    }).start();
    slides.forEach((_, index) => {
      if (index !== currentPage) {
        Animated.spring(scaleAnims[index], {
          toValue: 0.8,
          friction: 8,
          useNativeDriver: true,
        }).start();
      }
    });
  }, [currentPage]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const xOffset = event.nativeEvent.contentOffset.x;
    const pageNum = Math.round(xOffset / width);
    setCurrentPage(pageNum);
  };

  const renderSlideContent = (slide: any, index: number) => {
    if (index === 0) {
      return (
        <View style={[styles.content, styles.firstSlideContent]}>
          <Animated.Text
            style={[
              styles.logoText,
              styles.firstSlideLogo,
              {
                opacity: logoFadeAnim,
                transform: [{ translateY: logoSlideAnim }],
              },
            ]}
          >
            MUXX
          </Animated.Text>
          <Animated.Text
            style={[
              styles.title,
              styles.firstSlideTitle,
              {
                opacity: titleFadeAnim,
                transform: [{ translateY: titleSlideAnim }],
              },
            ]}
          >
            {slide.title}
          </Animated.Text>
        </View>
      );
    }
    if (index === 1) {
      return (
        <View style={[styles.content, styles.secondSlideContent]}>
          <Text style={[styles.logoText, styles.secondSlideLogo]}>MUXX</Text>
          {slide.illustration && (
            <Animated.Image
              source={slide.illustration}
              style={[
                styles.secondSlideIllustration,
                {
                  transform: [{ scale: scaleAnims[index] }],
                },
              ]}
            />
          )}
          <Text style={[styles.title, styles.secondSlideTitle]}>
            {slide.title}
          </Text>
          <Text style={styles.secondSlideSubtitle}>
            VOD stands for video on demand, and refers to a distribution
            platform.
          </Text>
        </View>
      );
    }
    if (index === 2) {
      return (
        <View style={[styles.content, styles.thirdSlideContent]}>
          <Text style={[styles.logoText, styles.thirdSlideLogo]}>MUXX</Text>
          {slide.illustration && (
            <Animated.Image
              source={slide.illustration}
              style={[
                styles.thirdSlideIllustration,
                {
                  transform: [{ scale: scaleAnims[index] }],
                },
              ]}
            />
          )}
          <Text style={[styles.title, styles.thirdSlideTitle]}>
            {slide.title}
          </Text>
          <Text style={styles.thirdSlideSubtitle}>
            VOD stands for video on demand, and refers to a distribution
            platform.
          </Text>
        </View>
      );
    }

    return (
      <View style={[styles.content, styles.otherSlideContent]}>
        <Text style={[styles.logoText, styles.otherSlideLogo]}>MUXX</Text>
        {slide.illustration && (
          <Animated.Image
            source={slide.illustration}
            style={[
              styles.illustration,
              {
                transform: [{ scale: scaleAnims[index] }],
              },
            ]}
          />
        )}
        <Text style={[styles.title, styles.otherSlideTitle]}>
          {slide.title}
        </Text>
        <Text style={styles.subtitle}>
          VOD stands for video on demand, and refers to a distribution platform.
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {slides.map((slide, index) => (
          <View key={index} style={styles.slide}>
            {slide.backgroundType === "image" ? (
              <ImageBackground
                source={slide.backgroundImage}
                style={styles.backgroundImage}
                resizeMode="cover"
              >
                <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
                  <SafeAreaView style={styles.safeArea}>
                    {renderSlideContent(slide, index)}
                  </SafeAreaView>
                </Animated.View>
              </ImageBackground>
            ) : (
              <View
                style={[
                  styles.slideContent,
                  { backgroundColor: slide.backgroundColor },
                ]}
              >
                <SafeAreaView style={styles.safeArea}>
                  {renderSlideContent(slide, index)}
                </SafeAreaView>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      <Animated.View
        style={[
          styles.footer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.progressBarContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressBar,
                {
                  backgroundColor:
                    currentPage === index
                      ? "#CCFF00"
                      : "rgba(255, 255, 255, 0.3)",
                  width: currentPage === index ? 22 : 3,
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.signUpButton,
              { transform: [{ scale: 1 }] },
              isLoadingSignUp && styles.disabledButton,
            ]}
            activeOpacity={0.8}
            disabled={isLoadingSignUp}
            onPress={handleSignUp}
          >
            {isLoadingSignUp ? (
              <ActivityIndicator color="black" size="small" />
            ) : (
              <Text style={styles.signUpText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.signInButton,
              { transform: [{ scale: 1 }] },
              isLoadingSignIn && styles.disabledButton,
            ]}
            activeOpacity={0.8}
            disabled={isLoadingSignIn}
            onPress={handleSignIn}
          >
            {isLoadingSignIn ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.signInText}>Sign In</Text>
            )}
          </TouchableOpacity>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width: width,
    height: height,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  slideContent: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  firstSlideContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: height * 0.2,
  },
  firstSlideLogo: {
    fontSize: width * 0.2,
    fontWeight: "900",
    marginBottom: height * 0.02,
    textAlign: "left",
  },
  logoText: {
    color: "white",
    letterSpacing: 1,
  },
  title: {
    color: "white",
    marginBottom: height * 0.015,
  },
  firstSlideTitle: {
    fontSize: width * 0.09,
    textAlign: "left",
    fontWeight: "800",
    marginBottom: height * 0.04,
    lineHeight: width * 0.11,
    letterSpacing: 0.5,
  },
  secondSlideContent: {
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: height * 0.01,
  },
  secondSlideLogo: {
    fontSize: width * 0.13,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: height * 0.06,
    letterSpacing: 1,
  },
  secondSlideIllustration: {
    width: width * 0.6,
    height: width * 0.6,
    resizeMode: "contain",
    marginVertical: height * 0.004,
  },
  secondSlideTitle: {
    fontSize: width * 0.08,
    textAlign: "center",
    fontWeight: "800",
    lineHeight: width * 0.1,
    marginTop: height * 0.02,
    letterSpacing: 0.5,
  },
  secondSlideSubtitle: {
    fontSize: width * 0.04,
    color: "rgba(255, 255, 255, 0.5)",
    textAlign: "center",
    marginTop: height * 0.02,
    fontWeight: "400",
    letterSpacing: 0.3,
  },
  thirdSlideContent: {
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: height * 0.01,
  },
  thirdSlideLogo: {
    fontSize: width * 0.13,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: height * 0.06,
    letterSpacing: 1,
  },
  thirdSlideIllustration: {
    width: width * 0.6,
    height: width * 0.6,
    resizeMode: "contain",
    marginVertical: height * 0.024,
  },
  thirdSlideTitle: {
    fontSize: width * 0.08,
    textAlign: "center",
    fontWeight: "800",
    lineHeight: width * 0.1,
    marginTop: height * 0.02,
    letterSpacing: 0.5,
  },
  thirdSlideSubtitle: {
    fontSize: width * 0.04,
    color: "rgba(255, 255, 255, 0.5)",
    textAlign: "center",
    marginTop: height * 0.02,
    fontWeight: "400",
    letterSpacing: 0.3,
  },
  otherSlideContent: {
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: height * 0.01,
  },
  otherSlideLogo: {
    fontSize: width * 0.13,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: height * 0.06,
    letterSpacing: 1,
  },
  illustration: {
    width: width * 0.7,
    height: width * 0.6,
    resizeMode: "contain",
    marginVertical: height * 0.02,
  },
  otherSlideTitle: {
    fontSize: width * 0.08,
    textAlign: "center",
    fontWeight: "800",
    lineHeight: width * 0.1,
    marginTop: height * 0.02,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: width * 0.04,
    color: "rgba(255, 255, 255, 0.5)",
    textAlign: "center",
    marginTop: height * 0.02,
    fontWeight: "400",
    letterSpacing: 0.3,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: height * 0.05,
  },
  progressBarContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.035,
  },
  progressBar: {
    height: 3,
    marginHorizontal: 2,
    borderRadius: 1.5,
  },
  buttonContainer: {
    width: "100%",
    paddingBottom: height * 0.025,
    gap: height * 0.012,
  },
  signUpButton: {
    backgroundColor: "#CCFF00",
    padding: height * 0.022,
    borderRadius: 100,
    alignItems: "center",
  },
  signUpText: {
    color: "black",
    fontSize: width * 0.045,
    fontWeight: "800",
  },
  signInButton: {
    backgroundColor: "#000000",
    padding: height * 0.022,
    borderRadius: 100,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  signInText: {
    color: "white",
    fontSize: width * 0.045,
    fontWeight: "800",
  },
  disabledButton: {
    opacity: 0.5,
  },
  errorText: {
    color: "#FF4444",
    textAlign: "center",
    marginTop: 8,
    fontSize: width * 0.035,
  },
});

export default SplashScreen;