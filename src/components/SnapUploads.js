import React, { useState, useEffect } from "react";
import * as ImagePicker from 'expo-image-picker';
import { supabase } from "../utils/hooks/supabase";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Alert,
} from "react-native";

export default function SnapUploads({ pantry }) {
    const [snaps, setSnaps] = useState([]);

    const BUCKET_NAME = "snaps";
    const SUPABASE_URL = "https://httkhtqkarrfmxpssjph.supabase.co";

    
    async function uploadSnap() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const imageUri = result.assets[0].uri;

            try {
                const response = await fetch(imageUri);
                const blob = await response.blob();
                const filename = `${Date.now()}.jpg`;
                const path = `${pantry.id}/${filename}`;

                const { data, error } = await supabase
                    .storage
                    .from(BUCKET_NAME)
                    .upload(path, blob, {
                        contentType: 'image/jpeg',
                        upsert: true,
                    });



                console.log("Upload response:", data); // data returns null in console

                if (error) {
                    console.error("Upload error:", error);  // Make sure this prints something
                    Alert.alert("Upload failed", error.message);

                } else {
                    console.log("Uploaded:", data);
                    getSnaps(); // refresh view
                }
            } catch (err) {
                console.error("Upload failed:", err);
            }
        }
    }

    async function getSnaps() {
        const { data, error } = await supabase
            .storage
            .from(BUCKET_NAME)
            .list(`${pantry.id}/`, {
                limit: 20,
                offset: 0,
                sortBy: { column: 'created_at', order: 'desc' },
            });

        if (error) {
            console.error("Fetch error:", error);
            return;
        }

        const urls = data.map(file => ({
            name: file.name,
            url: `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${pantry.id}/${file.name}`,
        }));

        setSnaps(urls);
    }

    useEffect(() => {
        getSnaps();
    }, []);

    return (
        <View>
            <TouchableOpacity style={styles.uploadButton} onPress={uploadSnap}>
                <Text style={styles.uploadButtonText}>Upload</Text>
            </TouchableOpacity>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.snapsContainer}
            >
                {snaps.map((media) => (
                    <TouchableOpacity key={media.name} onPress={() => console.log("Media: ", media)}>
                        <View style={styles.snap}>
                            <Image
                                source={{ uri: media.url }}
                                style={{ width: 60, height: 90, borderRadius: 10 }}
                            />
                        </View>
                    </TouchableOpacity>
                ))}
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
        backgroundColor: "#dcdcdc",
        gap: 10,
        marginTop: 10,
    },
    snap: {
        width: 60,
        height: 90,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
});
