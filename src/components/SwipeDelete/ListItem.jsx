import React from 'react'
import { View, StyleSheet, Text, Dimensions } from 'react-native'
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import {GestureHandlerRootView, GestureDetector, Gesture} from 'react-native-gesture-handler'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const LIST_ITEM_HEIGHT = 70
const TRANSLATE_X_THRESHOLD = -SCREEN_WIDTH * 0.25

export default function ListItem({task, onDelete, simultaneousHandlers}) {
    const translateX = useSharedValue(0)
    const itemHight = useSharedValue(LIST_ITEM_HEIGHT)
    const marginVertical = useSharedValue(10)
    const opacity = useSharedValue(1)

    const gesture = Gesture.Pan()
        .onStart(() => {

        })
        .onUpdate((event) => {
            translateX.value = event.translationX

        })
        .onEnd(() => {
            const shouldRemove = translateX.value <= TRANSLATE_X_THRESHOLD
            if(shouldRemove) {
                translateX.value = withTiming(-SCREEN_WIDTH)
                itemHight.value = withTiming(0)
                marginVertical.value = withTiming(0)
                opacity.value = withTiming(0, undefined, (isFinished) => {
                    if(isFinished && onDelete) {
                        runOnJS(onDelete)(task.id)
                    }
                
                })
            }else {
                translateX.value = withTiming(0)
            }

        })
    
        const rStyle = useAnimatedStyle(() => {
            return {
                transform: [
                    {translateX: translateX.value}
                ]
            }
        })

        const rIconContainerStyle = useAnimatedStyle(() => {
            const opacity = withTiming(translateX.value <= TRANSLATE_X_THRESHOLD ? 1 : 0)
            return { opacity}
        })

        const rTaskContainerStyle = useAnimatedStyle(() => {
            return {
                height: itemHight.value,
                marginVertical: marginVertical.value,
                opacity: opacity.value
            }
        })

return (
        <GestureHandlerRootView >
            <Animated.View style={[styles.taskContainer, rTaskContainerStyle]}>
              <Animated.View style={[styles.itemContainer, rIconContainerStyle]}>
                <MaterialIcons name="delete" size={LIST_ITEM_HEIGHT * 0.4} color="red" />
            </Animated.View>
            <GestureDetector gesture={gesture}>
                <Animated.View style={[styles.task, rStyle]}>
                    <Text style={styles.taskTitle}>{task.title}</Text>
                </Animated.View>
                
            </GestureDetector>
            </Animated.View>
          
        </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
    task: {
        width: '90%',
        height: LIST_ITEM_HEIGHT,
        backgroundColor: 'white',
        justifyContent: 'center',
        paddingLeft: 20,
        shadowOpacity: 0.07, 
        borderRadius: 10,
        shadowOffset: {
            width: 0,
            height: 20
        },
        shadowRadius: 10,
        elevation: 8,
    },
    taskContainer: {
        alignItems: 'center',
        width: '100%',
        marginVertical: 10,
    },
    taskTitle: {
        fontSize: 16, 

    },
    itemContainer: {
        height: LIST_ITEM_HEIGHT,
        width: LIST_ITEM_HEIGHT,
        position: 'absolute',
        right: '10%',
        justifyContent: 'center',
        alignItems: 'center'
    }
})