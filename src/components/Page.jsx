import {View, Dimensions, StyleSheet, Text} from 'react-native'

import React from 'react'
import Animated, { interpolate, useAnimatedStyle, Extrapolate, StretchInX } from 'react-native-reanimated'

const {height, width} = Dimensions.get('window')
const SIZE = width * 0.7 

export default function Page({index, title, translateX}) {
    const inputRange = [(index-1) * width, index*width, (index+1)*width]
    const rStyle = useAnimatedStyle(() => {

        const scale = interpolate(
            translateX.value, 
            inputRange, 
            [0,1,0],
            Extrapolate.CLAMP
        );

        const borderRadius = interpolate(translateX.value, 
            inputRange, 
            [0,SIZE/2,0],
            Extrapolate.CLAMP
        )

        return {
            borderRadius,
            transform: [
                {
                    scale
                }
            ]
        }
    })

    const rTextStyle = useAnimatedStyle(() => {
        const translateY = interpolate(translateX.value, 
            inputRange, 
            [height/2,0,-height/2],
            Extrapolate.CLAMP
        )

        const opacity= interpolate(translateX.value, inputRange, [-2, 1, -2])

        return {
            opacity,
            transform: [
                {
                    translateY
                }
            ]
        }
    })
  return (
    <View style={[styles.container, {backgroundColor: `rgba(0,0,256, 0.${index + 2})`}]}>
    <Animated.View style={[styles.square, rStyle]}/>
       <Animated.View style={[{position: 'absolute'}, rTextStyle]}> 
            <Text style={styles.text}>{title}</Text>
       </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        height,
        width,
        justifyContent: 'center',
        alignItems: 'center',
    },

    square: {
        height: SIZE,
        width: SIZE,
        backgroundColor: 'rgba(0,0,256, 0.4)',
    },
    text: {
        fontSize: 70,
        color: 'white',
        textTransform: 'uppercase',
        fontWeight: '700',
        textAlign: 'center',
    }

})