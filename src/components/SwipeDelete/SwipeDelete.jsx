import React, { useState, useRef } from 'react'
import { View, Text, StyleSheet,ScrollView } from 'react-native'
import {  GestureHandlerRootView } from 'react-native-gesture-handler'
import ListItem from './ListItem'
const TITLES = [
  {id: 1, title: 'Task 1'},
  {id: 2, title: 'Task 2'},
  {id: 3, title: 'Task 3'},
  {id: 4, title: 'Task 4'},
  {id: 5, title: 'Task 5'},
  {id: 6, title: 'Task 6'},
  {id: 7, title: 'Task 7'},
  {id: 8, title: 'Task 8'},
  {id: 9, title: 'Task 9'},
  {id: 10, title: 'Task 10'},
]

const BACKGROUND_COLOR = '#FAFBFF'

export default function SwipeDelete() {

  const [tasks,setTask]= useState(TITLES)
  const scrollRef = useRef(null)
  const onDelete = (id) => {
    const nuevoArray = tasks.filter((task) => task.id !== id)
    setTask(nuevoArray)
  }
  return (
    <View style={styles.container}>
        <Text style={styles.title}>Hello</Text>
        <ScrollView ref={scrollRef} style={{flex: 1}} >
          {
            tasks.map((item,index)=>(
              <ListItem simultaneousHandlers={scrollRef} key={item.id} task={item} onDelete={onDelete}/> 
            ))
          }
        </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,

  },
  title: {
    fontSize: 60,
    marginVertical: 20, 
    paddingLeft: '5%'
  }
})