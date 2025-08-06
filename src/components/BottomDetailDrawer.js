import React, { useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Image,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import SnapUploads from "./SnapUploads";

const { height } = Dimensions.get("window");

export default function BottomDetailDrawer({
    isVisible,
    onClose,
    pantry,
}) {
    const translateY = useRef(new Animated.Value(height)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    // Animate when visibility changes
    useEffect(() => {
        if (isVisible) {
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: height * 0.2,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: height,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [isVisible]);

    if (!pantry) return null;

    return (
        <TouchableWithoutFeedback onPress={onClose}>
            <View style={StyleSheet.absoluteFillObject}>
                <Animated.View
                    style={[
                        styles.drawer,
                        {
                            transform: [{ translateY }],
                            opacity,
                        },
                    ]}
                >
                    {/* Header */}
                    <View style={styles.headerContainer}>
                        <Image
                            style={styles.entriesImage}
                            source={{
                                uri: "https://media.istockphoto.com/id/2150313780/vector/food-donation-outline-icon-box-with-food.jpg?s=612x612&w=0&k=20&c=wGzHLux3IWsArmzBQod9Jw9VAZklhofs_b4JlI8THDU=",
                            }}
                        />
                        <View style={styles.textContainer}>
                            <Text style={styles.header}>{pantry.title}</Text>
                            <Text style={styles.subheader}>{pantry.organizer}</Text>
                        </View>
                    </View>
                    <ScrollView contentContainerStyle={{ padding: 10 }}>

                        <View style={styles.textContainer}>
                            {/* <Text style={styles.description}>{pantry.description}</Text> */}
                            {pantry.website_url && (
                                <Text style={styles.website}>
                                    Website: {pantry.website_url}
                                </Text>
                            )}
                        </View>

                        <SnapUploads/>

                        <TouchableOpacity onPress={onClose} style={styles.backButton}>
                            <Text style={styles.backButtonText}>Back</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </Animated.View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    drawer: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: height * 0.6,
        backgroundColor: "rgba(255, 255, 255, 1)",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 10,
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 10,
    },
    entriesImage: {
        width: 50,
        height: 50,
        marginRight: 8,
        borderRadius: 25,
    },
    textContainer: {
        flexDirection: "column",
        justifyContent: "center",
    },
    header: {
        fontSize: 18,
        fontWeight: "600",
        marginTop: 2,
    },
    subheader: {
        fontSize: 14,
        color: "#666",
    },
    description: {
        fontSize: 14,
        marginTop: 10,
        color: "#333",
    },
    website: {
        fontSize: 14,
        marginTop: 5,
        color: "blue",
        textDecorationLine: "underline",
    },
    backButton: {
        marginTop: 20,
        alignSelf: 'flex-start',
        backgroundColor: "#eee",
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 10,
    },
    backButtonText: {
        fontSize: 14,
        fontWeight: "600",
    },
});
