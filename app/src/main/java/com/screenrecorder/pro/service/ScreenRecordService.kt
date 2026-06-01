package com.screenrecorder.pro.service

import android.app.*
import android.content.Context
import android.content.Intent
import android.hardware.display.DisplayManager
import android.hardware.display.VirtualDisplay
import android.media.MediaRecorder
import android.media.projection.MediaProjection
import android.media.projection.MediaProjectionManager
import android.os.*
import android.util.DisplayMetrics
import android.view.WindowManager
import android.widget.Toast
import androidx.core.app.NotificationCompat
import java.io.File
import java.text.SimpleDateFormat
import java.util.*

class ScreenRecordService : Service() {

    companion object {
        const val CHANNEL_ID = "screen_recording_channel"
        const val NOTIFICATION_ID = 999
        const val ACTION_STOP = "com.screenrecorder.pro.STOP"
        const val ACTION_PAUSE = "com.screenrecorder.pro.PAUSE"
        const val EXTRA_RESULT_CODE = "result_code"
        const val EXTRA_DATA = "data"
        const val EXTRA_WIDTH = "width"
        const val EXTRA_HEIGHT = "height"
        const val EXTRA_DPI = "dpi"
        const val EXTRA_BITRATE = "bitrate"
        const val EXTRA_FPS = "fps"
        const val EXTRA_AUDIO = "audio"

        var isRecording = false
        var isPaused = false
        var onStatusChanged: ((Boolean, Boolean) -> Unit)? = null
    }

    private var mediaProjection: MediaProjection? = null
    private var mediaRecorder: MediaRecorder? = null
    private var virtualDisplay: VirtualDisplay? = null
    private var outputFile: File? = null
    private var screenWidth = 1080
    private var screenHeight = 1920
    private var screenDpi = 320
    private var videoBitrate = 12000000
    private var frameRate = 60
    private var recordAudio = true
    private var wakeLock: PowerManager.WakeLock? = null

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_STOP -> stopRecording()
            ACTION_PAUSE -> togglePause()
            else -> {
                intent?.let {
                    val resultCode = it.getIntExtra(EXTRA_RESULT_CODE, -1)
                    val data = it.getParcelableExtra<Intent>(EXTRA_DATA)
                    screenWidth = it.getIntExtra(EXTRA_WIDTH, 1080)
                    screenHeight = it.getIntExtra(EXTRA_HEIGHT, 1920)
                    screenDpi = it.getIntExtra(EXTRA_DPI, 320)
                    videoBitrate = it.getIntExtra(EXTRA_BITRATE, 12000000)
                    frameRate = it.getIntExtra(EXTRA_FPS, 60)
                    recordAudio = it.getBooleanExtra(EXTRA_AUDIO, true)

                    if (resultCode != -1 && data != null) {
                        startRecording(resultCode, data)
                    }
                }
            }
        }
        return START_STICKY
    }

    override fun onBind(intent: Intent?): IBinder? = null

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Screen Recording",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Screen recording notification"
                setShowBadge(false)
            }
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }
    }

    private fun startRecording(resultCode: Int, data: Intent) {
        val projectionManager = getSystemService(MEDIA_PROJECTION_SERVICE) as MediaProjectionManager
        mediaProjection = projectionManager.getMediaProjection(resultCode, data)

        val timestamp = SimpleDateFormat("yyyyMMdd_HHmmss", Locale.getDefault()).format(Date())
        val outputDir = File(
            Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_MOVIES),
            "ScreenRecorderPro"
        )
        if (!outputDir.exists()) outputDir.mkdirs()
        outputFile = File(outputDir, "REC_$timestamp.mp4")

        mediaRecorder = MediaRecorder().apply {
            setVideoSource(MediaRecorder.VideoSource.SURFACE)
            setOutputFormat(MediaRecorder.OutputFormat.MPEG_4)
            setVideoEncoder(MediaRecorder.VideoEncoder.H264)
            setVideoSize(screenWidth, screenHeight)
            setVideoFrameRate(frameRate)
            setVideoEncodingBitRate(videoBitrate)

            if (recordAudio) {
                try {
                    setAudioSource(MediaRecorder.AudioSource.MIC)
                    setAudioEncoder(MediaRecorder.AudioEncoder.AAC)
                    setAudioSamplingRate(44100)
                    setAudioEncodingBitRate(192000)
                } catch (e: Exception) {
                    // Audio not available
                }
            }

            setOutputFile(outputFile?.absolutePath)
            prepare()

            virtualDisplay = mediaProjection?.createVirtualDisplay(
                "ScreenRecorderPro",
                screenWidth, screenHeight, screenDpi,
                DisplayManager.VIRTUAL_DISPLAY_FLAG_AUTO_MIRROR,
                surface, null, null
            )

            start()
        }

        val powerManager = getSystemService(POWER_SERVICE) as PowerManager
        wakeLock = powerManager.newWakeLock(
            PowerManager.PARTIAL_WAKE_LOCK,
            "ScreenRecorderPro:WakeLock"
        ).apply { acquire(10 * 60 * 1000L) }

        isRecording = true
        isPaused = false
        onStatusChanged?.invoke(true, false)

        startForeground(NOTIFICATION_ID, createNotification())
        Toast.makeText(this, "Recording started", Toast.LENGTH_SHORT).show()
    }

    private fun stopRecording() {
        try {
            isRecording = false
            isPaused = false
            onStatusChanged?.invoke(false, false)

            mediaRecorder?.apply {
                try { stop() } catch (_: Exception) {}
                try { reset() } catch (_: Exception) {}
                try { release() } catch (_: Exception) {}
            }
            mediaRecorder = null

            virtualDisplay?.apply {
                try { release() } catch (_: Exception) {}
            }
            virtualDisplay = null

            mediaProjection?.apply {
                try { stop() } catch (_: Exception) {}
            }
            mediaProjection = null

            wakeLock?.apply {
                if (isHeld) release()
            }
            wakeLock = null

            stopForeground(STOP_FOREGROUND_REMOVE)
            stopSelf()

            outputFile?.let { file ->
                val values = android.content.ContentValues().apply {
                    put(android.provider.MediaStore.Video.Media.DATA, file.absolutePath)
                    put(android.provider.MediaStore.Video.Media.MIME_TYPE, "video/mp4")
                    put(android.provider.MediaStore.Video.Media.DISPLAY_NAME, file.name)
                }
                try {
                    contentResolver.insert(
                        android.provider.MediaStore.Video.Media.EXTERNAL_CONTENT_URI,
                        values
                    )
                } catch (_: Exception) {}
            }

            Toast.makeText(this, "Recording saved", Toast.LENGTH_SHORT).show()
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private fun togglePause() {
        if (isRecording && !isPaused) {
            try { mediaRecorder?.pause() } catch (_: Exception) {}
            isPaused = true
            onStatusChanged?.invoke(true, true)
        } else if (isRecording && isPaused) {
            try { mediaRecorder?.resume() } catch (_: Exception) {}
            isPaused = false
            onStatusChanged?.invoke(true, false)
        }
    }

    private fun createNotification(): Notification {
        val pauseIntent = Intent(this, ScreenRecordService::class.java).apply {
            action = ACTION_PAUSE
        }
        val pausePending = PendingIntent.getService(
            this, 1, pauseIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val stopIntent = Intent(this, ScreenRecordService::class.java).apply {
            action = ACTION_STOP
        }
        val stopPending = PendingIntent.getService(
            this, 2, stopIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle(if (isPaused) "Recording Paused" else "Screen Recording")
            .setContentText("Screen Recorder Pro")
            .setSmallIcon(android.R.drawable.ic_menu_camera)
            .setOngoing(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .addAction(
                android.R.drawable.ic_media_pause,
                if (isPaused) "Resume" else "Pause",
                pausePending
            )
            .addAction(
                android.R.drawable.ic_media_play,
                "Stop",
                stopPending
            )
            .build()
    }

    override fun onDestroy() {
        if (isRecording) stopRecording()
        super.onDestroy()
    }
}
