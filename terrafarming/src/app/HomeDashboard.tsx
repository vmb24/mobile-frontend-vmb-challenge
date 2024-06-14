import { useEffect } from 'react'
import { Button, Text, View } from 'react-native'

import { Amplify } from 'aws-amplify'
import awsmobile from '../../aws-exports'

import * as Notifications from 'expo-notifications'
import * as Permissions from 'expo-permissions'

Amplify.configure(awsmobile)

export function HomeDashboard() {
    useEffect(() => {
        registerForPushNotificationsAsync()

        const notificationListener = Notifications.addNotificationReceivedListener(notification => {
            console.log(notification)
        })

        const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response)
        })

        return () => {
            Notifications.removeNotificationSubscription(notificationListener)
            Notifications.removeNotificationSubscription(responseListener)
        }
    }, [])
    
    const registerForPushNotificationsAsync = async () => {
        const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS)
        if (status !== 'granted') {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
            if (status !== 'granted') {
            alert('Failed to get push token for push notification!')
            return
            }
        }
        const token = (await Notifications.getExpoPushTokenAsync()).data
        console.log(token)
        // Enviar o token para seu backend ou AWS Pinpoint
    }

    return (
        <View className="flex-1 justify-center items-center">
            <Text>Home Dashboard TerraFarming</Text>
            <Button title="Register for Notifications" onPress={registerForPushNotificationsAsync} />
        </View>
    )
}