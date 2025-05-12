import { Stack , Link  } from "expo-router";
import { View , StyleSheet } from "react-native";

export default function NotFoundScreen(){
    return(
        <>
            <Stack.Screen options = {{title:'Ooops not found'}}/>
            <View style={styles.container}>
                <Link style={styles.button} href='./'>Go back to the Home screen</Link>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#25292e',
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        fontSize: 20,
        textDecorationColor: 'underline',
        color: '#fff'

    }
})