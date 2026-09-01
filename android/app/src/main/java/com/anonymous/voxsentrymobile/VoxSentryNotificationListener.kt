package com.anonymous.voxsentrymobile

import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log

class VoxSentryNotificationListener : NotificationListenerService() {

    // Package names for common VoIP apps
    private val voipApps = setOf(
        "com.whatsapp",
        "org.telegram.messenger",
        "com.facebook.orca", // Messenger
        "com.viber.voip",
        "com.google.android.apps.tachyon", // Google Meet/Duo
        "com.skype.raider"
    )

    override fun onNotificationPosted(sbn: StatusBarNotification) {
        checkNotifications()
    }

    override fun onNotificationRemoved(sbn: StatusBarNotification) {
        checkNotifications()
    }

    override fun onListenerConnected() {
        super.onListenerConnected()
        checkNotifications()
    }

    private fun checkNotifications() {
        try {
            val activeNotifications = activeNotifications
            if (activeNotifications == null) {
                CallSessionManager.setVoipCallActive(false)
                return
            }

            var voipActive = false

            for (sbn in activeNotifications) {
                if (voipApps.contains(sbn.packageName)) {
                    // Check if it's an ongoing call notification
                    val notification = sbn.notification
                    
                    // Ongoing notifications (like calls) typically have FLAG_ONGOING_EVENT
                    val isOngoing = (notification.flags and android.app.Notification.FLAG_ONGOING_EVENT) != 0
                    
                    // Checking category helps identify calls
                    val isCallCategory = notification.category == android.app.Notification.CATEGORY_CALL

                    if (isOngoing && isCallCategory) {
                        voipActive = true
                        break
                    }
                }
            }
            
            CallSessionManager.setVoipCallActive(voipActive)
        } catch (e: Exception) {
            Log.e("VoxSentryNotification", "Error checking notifications", e)
        }
    }
}
