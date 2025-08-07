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
        const image = result.assets[0];
        const filename = `${Date.now()}.jpg`;
        const path = `${pantry.id}/${filename}`;

        try {
            // Convert image URI to a File object via FormData
            const formData = new FormData();
            formData.append('file', {
                uri: image.uri,
                name: filename,
                type: 'image/jpeg',
            });

            const { data, error } = await supabase.storage
                .from(BUCKET_NAME)
                .createSignedUploadUrl(path);

            if (error) {
                console.error("Signed URL error:", error);
                Alert.alert("Signed upload failed", error.message);
                return;
            }

            const uploadRes = await fetch(data.signedUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'image/jpeg',
                },
                body: formData._parts[0][1], // just the file
            });

            if (!uploadRes.ok) {
                const errText = await uploadRes.text();
                throw new Error(`Upload failed: ${errText}`);
            }

            console.log("Upload successful!");
            getSnaps(); // Refresh view
        } catch (err) {
            console.error("Upload failed:", err);
            Alert.alert("Upload failed", err.message);
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
