import React from "react";
import * as ImagePicker from 'expo-image-picker';
import { supabase } from "../utils/hooks/supabase";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    Touchable,
} from "react-native";

export default function SnapUploads({ pantry }) {

    
    return (
        <View>
            <TouchableOpacity style={styles.uploadButton} onPress={()=> console.log("Upload button pressed")}>
                <Text style={styles.uploadButtonText}>Upload</Text>
            </TouchableOpacity>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.snapsContainer}
            >
                <TouchableOpacity onPress={() =>console.log("Snap pressed")}>
                    <View style={[styles.snap, { backgroundColor: "rgba(82, 0, 233, 1)" }]}>
                        <Text>Snap 1</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => console.log("Snap pressed")}>
                    <View style={[styles.snap, { backgroundColor: "rgb(0,255,0)" }]}>
                        <Text>Snap 2</Text>
                    </View>

                </TouchableOpacity>
                <TouchableOpacity onPress={() => console.log("Snap pressed")}>

                    <View style={[styles.snap, { backgroundColor: "rgba(255, 59, 248, 1)" }]}>
                        <Text>Snap 3</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    uploadButton: {
        marginTop: 20,
        alignSelf: 'flex-start',
        backgroundColor: "#eee",
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 10,
    },
    uploadButtonText: {
        fontSize: 14,
        fontWeight: "600",
    },
    snapsContainer: {
        flexDirection: "row",
        padding: 10,
        backgroundColor: "#dcdcdcff",
        gap: 10,
        marginTop: 10,
    },
    snap: {
        width: 60,
        height: 90,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
