import { View, Text, Pressable } from 'react-native'
import Animated, { FadeIn, FadeOut, SequencedTransition,LinearTransition, StretchInX, StretchOutY } from 'react-native-reanimated'
import React from 'react'

export default function ItemInList({task, index, delete: onDelete}) {

  return (
    <Animated.View 
        className="items-center mb-3 mx-4"
        entering={StretchInX}
        onTouchEnd={() => onDelete(task.id)}
        exiting={FadeOut}
        layout={SequencedTransition.delay(50)}

    >
        <Pressable className="bg-sky-600 w-full rounded-xl p-8" >
            <Text className="text-white text-xl font-bold">{task.title}</Text>
        </Pressable>
    </Animated.View>
  )
}