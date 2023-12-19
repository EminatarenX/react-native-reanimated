import React, {useEffect} from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {View, ScrollView, Text, Switch, Dimensions} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withReanimated,
  withRepeat,
  useAnimatedScrollHandler,
  interpolateColor,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Tab.Screen
          name="Drag"
          component={Settings}
          options={{
            tabBarIcon: ({color, size}) => (
              <MaterialIcons name="settings" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Initial"
          component={Home}
          options={{
            tabBarIcon: ({color, size}) => (
              <MaterialIcons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Animated"
          component={AnimatedPageTransition}
          options={{
            tabBarIcon: ({color, size}) => (
              <MaterialIcons name="animation" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="DarkMode"
          component={DarkMode}
          options={{
            tabBarIcon: ({color, size}) => (
              <MaterialIcons name="dark-mode" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const Colors = {
  dark: {
    background: '#1E1E1E',
    circle: '#252525',
    text: '#F8F8F8',
  },
  light: {
    background: '#F8F8F8',
    circle: '#FFF',
    text: '#1E1E1E',
  },
};

const SWITCH_TRACK_COLOR = {
  true: 'rgba(255, 0, 255, 0.2)',
  false: 'rgba(0, 0, 0, 0.1)',
};

const SIZE = Dimensions.get('window').width * 0.7;
const stylesCircle = {
  width: SIZE,
  height: SIZE,
  borderRadius: SIZE / 2,
  shadowOffset: {width: 0, height: 20},
  shadowRadius: 10,
  shadowOpacity: 0.1,
  elevation: 8,
};

const stylestext = {
  textTransform: 'uppercase',
  fontSize: 70,
  fontWeight: '800',
  letterSpacing: 14,
  marginBottom: 34,
}

function DarkMode() {
  const [theme, setTheme] = React.useState('dark');
  // const progress = useSharedValue(0)
  const progress = useDerivedValue(() => {
    return theme === 'dark' ? withTiming(1) : withTiming(0);
  }, [theme]);

  const rStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [Colors.light.background, Colors.dark.background],
    );
    return {
      backgroundColor,
    };
  });

  const rCircleStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [Colors.light.circle, Colors.dark.circle],
    );
    return {
      backgroundColor,
    };
  });

  const rTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      progress.value,
      [0, 1],
      [Colors.light.text, Colors.dark.text],
    );
    return {
      color,
    };
  });
  return (
    <Animated.View
      className="flex-1 items-center justify-center"
      style={[rStyle]}>
        <Animated.Text style={[stylestext, rTextStyle]}>Theme</Animated.Text>
      <Animated.View
        className="items-center justify-center bg-white"
        style={[rCircleStyle, stylesCircle]}>
        <Switch
          value={theme === 'dark'}
          onValueChange={toggled => {
            setTheme(toggled ? 'dark' : 'light');
          }}
          trackColor={SWITCH_TRACK_COLOR}
          thumbColor={'violet'}
        />
      </Animated.View>
    </Animated.View>
  );
}

const WORDS = ["Saken 🥶", 'el 🤯', 'fortnite 😳', 'papus 🥵'];

import Page from './src/components/Page';

function AnimatedPageTransition() {
  const translateX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateX.value = event.contentOffset.x;
  });
  return (
    <Animated.ScrollView
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      pagingEnabled
      style={{flex: 1}}
      horizontal>
      {WORDS.map((word, index) => (
        <Page
          key={index.toString()}
          title={word}
          index={index}
          translateX={translateX}
        />
      ))}
    </Animated.ScrollView>
  );
}

const handle = progress => {
  'worklet';
  return `${progress.value * 2 * Math.PI}rad`;
};

const size = 100.0;
function Home() {
  const progress = useSharedValue(0);
  const scale = useSharedValue(2);

  const reanimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
      borderRadius: (progress.value * size) / 2,
      transform: [{scale: scale.value}, {rotate: handle(progress)}],
    };
  }, []);

  useEffect(() => {
    progress.value = withRepeat(withSpring(1), 3, true);
    scale.value = withRepeat(withSpring(1), 3, true);
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-rose-600">
      <Animated.View
        style={[
          {height: size, width: size, backgroundColor: 'white'},
          reanimatedStyle,
        ]}></Animated.View>
    </View>
  );
}
const circleRadius = 200;
function Settings() {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const gestureContext = useSharedValue({x: 0, y: 0});

  const gesture = Gesture.Pan()
    .onStart(() => {
      gestureContext.value = {x: translateX.value, y: translateY.value};
    })
    .onUpdate(event => {
      translateX.value = event.translationX + gestureContext.value.x;
      translateY.value = event.translationY + gestureContext.value.y;
    })
    .onEnd(() => {
      const distance = Math.sqrt(translateX.value ** 2 + translateY.value ** 2);

      if (distance < circleRadius + size / 2) {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
      ],
    };
  });

  return (
    <GestureHandlerRootView className="flex-1 justify-center items-center bg-sky-600">
      <GestureDetector gesture={gesture}>
        <View
          className="justify-center items-center border-2 border-white"
          style={[
            {
              width: circleRadius * 2,
              height: circleRadius * 2,
              borderRadius: circleRadius,
            },
          ]}>
          <Animated.View
            className="h-20 w-20 rounded-2xl bg-white"
            style={[rStyle]}
          />
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}
