import { View, Text } from 'react-native'
import React, {useState} from 'react'
import { ScrollView, TouchableOpacity } from 'react-native'
import ItemInList from './ItemInList'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'


export default function AddItems() {
    const [notes, setNotes] = useState([])
    const addNote = () => {
        const date = Date.now().toLocaleString()
        const newNote = {id: date, title: `Note ${date}`}
        setNotes([newNote, ...notes])
    }
    const deleteNote = (id) => {
        const newNotes = notes.filter(note => note.id !== id)
        setNotes(newNotes)
    }
  return (
    <View className="flex-1 bg-white">
        <Text className="text-sky-900 text-6xl text-center mt-5">List Items</Text>
        <ScrollView className="flex-1 ">
            {
                notes.map((item, index) => (
                    <ItemInList key={item.id} task={item} index={index} delete={deleteNote} />
                ))
            }
        </ScrollView>
        <TouchableOpacity className="absolute bottom-5 right-5 rounded-full h-20 w-20 bg-black items-center justify-center"  onPress={addNote}>
            <MaterialIcons name="add" size={40} color="white"/>
        </TouchableOpacity>
    </View>
  )
}