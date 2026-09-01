package com.anonymous.voxsentrymobile

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.graphics.Color
import android.graphics.PixelFormat
import android.media.AudioManager
import android.os.Build
import android.os.IBinder
import android.os.VibrationEffect
import android.os.Vibrator
import android.view.Gravity
import android.view.LayoutInflater
import android.view.View
import android.view.WindowManager
import android.widget.TextView
import androidx.core.app.NotificationCompat

class ProtectionService : Service(), CallSessionManager.CallStateListener, AudioCaptureManager.AudioCaptureListener, InferenceEngine.InferenceListener {

    private lateinit var windowManager: WindowManager
    private var overlayView: View? = null
    private var textView: TextView? = null
    
    private val CHANNEL_ID = "VoxSentryProtectionChannel"

    private lateinit var audioManager: AudioManager
    private lateinit var vibrator: Vibrator
    
    private val audioCaptureManager = AudioCaptureManager()
    private lateinit var inferenceEngine: InferenceEngine

    private var isCallCurrentlyActive = false
    private var isSpeakerOn = false

    enum class OverlayState {
        WAITING, ANALYZING, SAFE, THREAT
    }

    private var currentState = OverlayState.WAITING

    private val audioRouteReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            if (intent?.action == AudioManager.ACTION_HEADSET_PLUG || intent?.action == AudioManager.ACTION_SPEAKERPHONE_STATE_CHANGED) {
                checkSpeakerState()
            }
        }
    }

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager
        audioManager = getSystemService(Context.AUDIO_SERVICE) as AudioManager
        vibrator = getSystemService(Context.VIBRATOR_SERVICE) as Vibrator

        inferenceEngine = InferenceEngine(this)
        inferenceEngine.setListener(this)
        audioCaptureManager.setListener(this)

        CallSessionManager.startNativeMonitoring(this)
        CallSessionManager.setListener(this)

        val filter = IntentFilter()
        filter.addAction(AudioManager.ACTION_HEADSET_PLUG)
        filter.addAction(AudioManager.ACTION_SPEAKERPHONE_STATE_CHANGED)
        registerReceiver(audioRouteReceiver, filter)
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val notification: Notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("VoxSentry Active")
            .setContentText("Monitoring calls for synthetic voices...")
            .setSmallIcon(R.mipmap.ic_launcher)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build()

        startForeground(1, notification)
        return START_STICKY
    }

    override fun onCallStateChanged(isActive: Boolean) {
        isCallCurrentlyActive = isActive
        if (isActive) {
            showOverlay()
            checkSpeakerState()
        } else {
            hideOverlay()
            audioCaptureManager.stopCapture()
            inferenceEngine.reset()
        }
    }

    private fun checkSpeakerState() {
        if (!isCallCurrentlyActive) return

        isSpeakerOn = audioManager.isSpeakerphoneOn

        if (isSpeakerOn) {
            updateOverlayState(OverlayState.ANALYZING)
            audioCaptureManager.startCapture()
            broadcastEvent("onCaptureStarted", null)
        } else {
            updateOverlayState(OverlayState.WAITING)
            audioCaptureManager.stopCapture()
            broadcastEvent("onSpeakerRequired", null)
        }
    }

    override fun onAudioWindowReady(audioData: ShortArray) {
        inferenceEngine.processAudioWindow(audioData)
    }

    override fun onCaptureError(error: String) {
        // Drop to a failure state if capture interrupted
        updateOverlayState(OverlayState.WAITING)
        textView?.text = "Capture interrupted"
        broadcastEvent("onCaptureStopped", error)
    }

    override fun onDetectionResult(isThreat: Boolean, confidence: Float) {
        val newState = if (isThreat) OverlayState.THREAT else OverlayState.SAFE
        updateOverlayState(newState)
        
        val result = "${if (isThreat) "threat" else "safe"}:$confidence"
        broadcastEvent("onDetectionUpdate", result)
    }

    private fun updateOverlayState(state: OverlayState) {
        if (overlayView == null) return

        val bgDrawable = overlayView?.background as? android.graphics.drawable.GradientDrawable ?: return

        when (state) {
            OverlayState.WAITING -> {
                bgDrawable.setStroke(2, Color.parseColor("#9CA3AF")) // Gray
                textView?.text = "Tap to enable speaker for protection"
                textView?.setTextColor(Color.parseColor("#9CA3AF"))
                
                overlayView?.setOnClickListener {
                    audioManager.isSpeakerphoneOn = true
                    checkSpeakerState()
                }
            }
            OverlayState.ANALYZING -> {
                bgDrawable.setStroke(2, Color.parseColor("#2DD4E8")) // Teal
                textView?.text = "Analyzing Audio..."
                textView?.setTextColor(Color.parseColor("#2DD4E8"))
                overlayView?.setOnClickListener(null)
            }
            OverlayState.SAFE -> {
                bgDrawable.setStroke(2, Color.parseColor("#10B981")) // Green
                textView?.text = "Safe: Human Voice"
                textView?.setTextColor(Color.parseColor("#10B981"))
                overlayView?.setOnClickListener(null)
            }
            OverlayState.THREAT -> {
                if (currentState != OverlayState.THREAT) {
                    if (Build.VERSION.SDK_INT >= Build.VERSION.O) {
                        vibrator.vibrate(VibrationEffect.createOneShot(500, VibrationEffect.DEFAULT_AMPLITUDE))
                    } else {
                        vibrator.vibrate(500)
                    }
                }
                bgDrawable.setStroke(2, Color.parseColor("#EF4444")) // Red
                textView?.text = "THREAT DETECTED"
                textView?.setTextColor(Color.parseColor("#EF4444"))
                overlayView?.setOnClickListener(null)
            }
        }
        currentState = state
    }

    private fun showOverlay() {
        if (overlayView != null) return

        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            if (Build.VERSION.SDK_INT >= Build.VERSION.O)
                WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
            else
                WindowManager.LayoutParams.TYPE_PHONE,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL,
            PixelFormat.TRANSLUCENT
        )

        params.gravity = Gravity.TOP or Gravity.CENTER_HORIZONTAL
        params.y = 100

        val view = android.widget.LinearLayout(this)
        view.orientation = android.widget.LinearLayout.HORIZONTAL
        view.setBackgroundColor(Color.parseColor("#151B2B"))
        view.setPadding(40, 30, 40, 30)
        
        textView = TextView(this)
        textView?.textSize = 14f
        textView?.gravity = Gravity.CENTER
        
        view.addView(textView)
        
        val cornerRadius = android.graphics.drawable.GradientDrawable()
        cornerRadius.setColor(Color.parseColor("#151B2B"))
        cornerRadius.cornerRadius = 30f
        view.background = cornerRadius

        overlayView = view
        try {
            windowManager.addView(overlayView, params)
        } catch (e: Exception) {
            e.printStackTrace()
        }

        updateOverlayState(OverlayState.WAITING)
    }

    private fun hideOverlay() {
        if (overlayView != null) {
            try {
                windowManager.removeView(overlayView)
                overlayView = null
                textView = null
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    private fun broadcastEvent(event: String, payload: String?) {
        val intent = Intent("com.anonymous.voxsentrymobile.DETECTION_EVENT")
        intent.putExtra("event", event)
        if (payload != null) {
            intent.putExtra("payload", payload)
        }
        sendBroadcast(intent)
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION.O) {
            val serviceChannel = NotificationChannel(
                CHANNEL_ID,
                "VoxSentry Protection Service",
                NotificationManager.IMPORTANCE_LOW
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(serviceChannel)
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        hideOverlay()
        audioCaptureManager.stopCapture()
        CallSessionManager.stopNativeMonitoring()
        CallSessionManager.setListener(null)
        unregisterReceiver(audioRouteReceiver)
    }
}
