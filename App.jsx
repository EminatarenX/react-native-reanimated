import React, {useEffect} from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {
  View,
  ScrollView,
  Text,
  Switch,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
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
  useAnimatedProps,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import SwipeDelete from './src/components/SwipeDelete/SwipeDelete';
import AddItems from './src/components/AddAndDeleteTransition/AddItems';

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
          name="circleBar"
          component={CirclePage}
          options={{
            tabBarIcon: ({color, size}) => (
              <MaterialIcons name="circle" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen 
          name="SwipeDelete"
          component={SwipeDelete}
          options={{
            tabBarIcon: ({color, size}) => (
              <MaterialIcons name="delete" color={color} size={size} />
            ),
          }}
          />
        <Tab.Screen
          name="AddItems"
          component={AddItems}
          options={{
            tabBarIcon: ({color, size}) => (
              <MaterialIcons name="add" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// Dark Mode


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
};

// Dark Mode


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

// DarkMode End

// Animated Page Transition

const WORDS = ['Saken 🥶', 'el 🤯', 'fortnite 😳', 'papus 🥵'];

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

// End of Animated Page Transition

const handle = progress => {
  'worklet';
  return `${progress.value * 2 * Math.PI}rad`;
};


// Home circlue transition transform

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

// End of Home circle transition transform

// Drag and Drop Gesture Handler

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

// End of Drag and Drop Gesture Handler

// Circle bar animation 

const BACKGROUD_COLOR_CIRCLE = '#444B6F';
const BACKGROUND_STROKE_COLOR = '#303858';
const STROKE_COLOR = '#A6E1FA';
const CIRCLE_LENGTH = 1000; // 2PI* RADIUS
const R = CIRCLE_LENGTH / (2 * Math.PI);

const {width, height} = Dimensions.get('window');

import {Svg, Circle} from 'react-native-svg';
import { ReText } from 'react-native-redash';
function CirclePage() {
  const progress = useSharedValue(0)
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: CIRCLE_LENGTH * (1- progress.value)
    }
  })


  const progressText = useDerivedValue(() => {
    return `${Math.floor(progress.value * 100)}`
  })

  const onPress = () => {
    progress.value = withTiming(progress.value > 0 ? 0: 1, {duration: 2000})
  }
  return (
    <View style={circleSection.container}>

      <ReText style={{fontSize: 80, color: 'rgba(256, 256, 256, 0.7)', width:200, textAlign: 'center'}} text={progressText} />
      <Svg style={{position: 'absolute'}}>
        <Circle
          cx={width / 2}
          cy={height / 2}
          r={R}
          fill={'none'}
          stroke={BACKGROUND_STROKE_COLOR}
          strokeWidth={30}
        />

        <AnimatedCircle
          cx={width / 2}
          cy={height / 2}
          r={R}
          fill={'none'}
          stroke={STROKE_COLOR}
          strokeWidth={15}
          strokeDasharray={CIRCLE_LENGTH}
          animatedProps={animatedProps}
          strokeLinecap={'round'}
        />
      </Svg>
      <TouchableOpacity style={circleSection.touchableStyle} onPress={onPress}>
        <Text style={{fontSize: 20, color: 'white', textAlign: 'center'}}>Press me</Text>
      </TouchableOpacity>
    </View>
  );
}

const circleSection = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUD_COLOR_CIRCLE,
    alignItems: 'center',
    justifyContent: 'center',
    
    
  },
  touchableStyle: {
    position: 'absolute',
    bottom: 50,
    width: width * 0.7,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25, 
    backgroundColor: BACKGROUND_STROKE_COLOR
  }
});


// End of Circle bar animation