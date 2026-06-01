package com.screenrecorder.pro.ui.screens

import android.Manifest
import android.content.Intent
import android.media.projection.MediaProjectionManager
import android.os.Build
import android.util.DisplayMetrics
import android.view.WindowManager
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.google.accompanist.permissions.ExperimentalPermissionsApi
import com.google.accompanist.permissions.rememberPermissionState
import com.screenrecorder.pro.service.ScreenRecordService
import com.screenrecorder.pro.ui.components.*
import com.screenrecorder.pro.ui.theme.*
import com.screenrecorder.pro.utils.PreferencesManager
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@OptIn(ExperimentalPermissionsApi::class)
@Composable
fun MainScreen() {
    val context = LocalContext.current
    val preferencesManager = remember { PreferencesManager(context) }
    val settings by preferencesManager.settingsFlow.collectAsState(
        initial = com.screenrecorder.pro.utils.RecorderSettings()
    )
    val coroutineScope = rememberCoroutineScope()

    var isRecording by remember { mutableStateOf(false) }
    var isPaused by remember { mutableStateOf(false) }
    var showCountdown by remember { mutableStateOf(false) }
    var showSettings by remember { mutableStateOf(false) }
    var recordingDuration by remember { mutableLongStateOf(0L) }

    val audioPermission = rememberPermissionState(Manifest.permission.RECORD_AUDIO)

    // Listen for service status
    LaunchedEffect(Unit) {
        ScreenRecordService.onStatusChanged = { recording, paused ->
            isRecording = recording
            isPaused = paused
        }
        isRecording = ScreenRecordService.isRecording
        isPaused = ScreenRecordService.isPaused
    }

    // Recording timer
    LaunchedEffect(isRecording, isPaused) {
        if (isRecording && !isPaused) {
            val startTime = System.currentTimeMillis() - recordingDuration
            while (isRecording) {
                recordingDuration = System.currentTimeMillis() - startTime
                delay(1000)
            }
        }
    }

    val projectionManager = context.getSystemService(MediaProjectionManager::class.java)

    // screenCaptureLauncher MUST be before launchMediaProjection
    val screenCaptureLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == android.app.Activity.RESULT_OK && result.data != null) {
            val metrics = DisplayMetrics()
            val wm = context.getSystemService(WindowManager::class.java)
            wm.defaultDisplay.getRealMetrics(metrics)

            val intent = Intent(context, ScreenRecordService::class.java).apply {
                putExtra(ScreenRecordService.EXTRA_RESULT_CODE, result.resultCode)
                putExtra(ScreenRecordService.EXTRA_DATA, result.data)
                putExtra(ScreenRecordService.EXTRA_WIDTH, metrics.widthPixels)
                putExtra(ScreenRecordService.EXTRA_HEIGHT, metrics.heightPixels)
                putExtra(ScreenRecordService.EXTRA_DPI, metrics.densityDpi)
                putExtra(
                    ScreenRecordService.EXTRA_BITRATE,
                    when (settings.videoBitrate) {
                        "24Mbps" -> 24000000
                        "18Mbps" -> 18000000
                        "12Mbps" -> 12000000
                        "8Mbps" -> 8000000
                        else -> 12000000
                    }
                )
                putExtra(ScreenRecordService.EXTRA_FPS, settings.frameRate)
                putExtra(ScreenRecordService.EXTRA_AUDIO, settings.audioSource != "mute")
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                context.startForegroundService(intent)
            } else {
                context.startService(intent)
            }
            isRecording = true
            recordingDuration = 0L
        }
    }

    fun launchMediaProjection() {
        val intent = projectionManager.createScreenCaptureIntent()
        screenCaptureLauncher.launch(intent)
    }

    fun startRecordingFlow() {
        if (settings.countdownSeconds > 0) {
            showCountdown = true
        } else {
            launchMediaProjection()
        }
    }

    fun stopRecording() {
        val intent = Intent(context, ScreenRecordService::class.java).apply {
            action = ScreenRecordService.ACTION_STOP
        }
        context.startService(intent)
        isRecording = false
        isPaused = false
        recordingDuration = 0L
    }

    fun togglePause() {
        val intent = Intent(context, ScreenRecordService::class.java).apply {
            action = ScreenRecordService.ACTION_PAUSE
        }
        context.startService(intent)
    }

    // Countdown overlay
    if (showCountdown) {
        CountdownOverlay(seconds = settings.countdownSeconds) {
            showCountdown = false
            launchMediaProjection()
        }
    }

    // Settings sheet
    if (showSettings) {
        SettingsSheet(
            settings = settings,
            onDismiss = { showSettings = false },
            onUpdateResolution = { coroutineScope.launch { preferencesManager.updateResolution(it) } },
            onUpdateBitrate = { coroutineScope.launch { preferencesManager.updateBitrate(it) } },
            onUpdateFrameRate = { coroutineScope.launch { preferencesManager.updateFrameRate(it) } },
            onUpdateAudioSource = { coroutineScope.launch { preferencesManager.updateAudioSource(it) } },
            onUpdateShowTouches = { coroutineScope.launch { preferencesManager.updateShowTouches(it) } },
            onUpdateFloatingControls = { coroutineScope.launch { preferencesManager.updateFloatingControls(it) } },
            onUpdateCountdown = { coroutineScope.launch { preferencesManager.updateCountdown(it) } },
        )
    }

    // Main UI
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBackground)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 20.dp)
                .padding(top = 48.dp, bottom = 32.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Screen Recorder",
                        fontSize = 28.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary
                    )
                    Text(
                        text = "Pro",
                        fontSize = 28.sp,
                        fontWeight = FontWeight.Light,
                        color = Secondary
                    )
                }
                IconButton(
                    onClick = { showSettings = true },
                    modifier = Modifier
                        .clip(RoundedCornerShape(14.dp))
                        .background(DarkCard)
                ) {
                    Icon(
                        imageVector = Icons.Filled.Settings,
                        contentDescription = "Settings",
                        tint = TextSecondary
                    )
                }
            }

            Spacer(modifier = Modifier.height(40.dp))

            // Main card
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(containerColor = DarkSurface),
                elevation = CardDefaults.cardElevation(defaultElevation = 0.dp)
            ) {
                Column(
                    modifier = Modifier.fillMaxWidth().padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    AnimatedContent(
                        targetState = isRecording,
                        transitionSpec = {
                            fadeIn(tween(400)) togetherWith fadeOut(tween(300))
                        },
                        label = "statusAnim"
                    ) { recording ->
                        if (recording) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.padding(bottom = 24.dp)
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(10.dp)
                                        .clip(CircleShape)
                                        .background(if (isPaused) AccentOrange else RecordRed)
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = if (isPaused) "متوقف مؤقتاً" else "جاري التسجيل...",
                                    color = if (isPaused) AccentOrange else RecordRed,
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Medium
                                )
                            }
                            Text(
                                text = formatDuration(recordingDuration),
                                fontSize = 48.sp,
                                fontWeight = FontWeight.Bold,
                                color = TextPrimary
                            )
                            Spacer(modifier = Modifier.height(24.dp))
                        } else {
                            Text(
                                text = "جاهز للتسجيل",
                                fontSize = 18.sp,
                                color = TextSecondary,
                                modifier = Modifier.padding(bottom = 24.dp)
                            )
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceEvenly
                            ) {
                                SettingChip(icon = Icons.Filled.HighQuality, label = settings.videoResolution)
                                SettingChip(icon = Icons.Filled.Speed, label = "${settings.frameRate} FPS")
                                SettingChip(
                                    icon = when (settings.audioSource) {
                                        "mic" -> Icons.Filled.Mic
                                        "mute" -> Icons.Filled.MicOff
                                        else -> Icons.Filled.VolumeUp
                                    },
                                    label = when (settings.audioSource) {
                                        "mic" -> "مايك"
                                        "mute" -> "بدون صوت"
                                        else -> "داخلي"
                                    }
                                )
                            }
                            Spacer(modifier = Modifier.height(24.dp))
                        }
                    }

                    // Action buttons
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.Center,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        if (isRecording) {
                            IconButton(
                                onClick = { togglePause() },
                                modifier = Modifier
                                    .size(56.dp)
                                    .clip(RoundedCornerShape(16.dp))
                                    .background(DarkCard)
                            ) {
                                Icon(
                                    imageVector = if (isPaused) Icons.Filled.PlayArrow else Icons.Filled.Pause,
                                    contentDescription = null,
                                    tint = if (isPaused) AccentGreen else AccentOrange,
                                    modifier = Modifier.size(28.dp)
                                )
                            }
                            Spacer(modifier = Modifier.width(32.dp))
                            IconButton(
                                onClick = { stopRecording() },
                                modifier = Modifier
                                    .size(56.dp)
                                    .clip(RoundedCornerShape(16.dp))
                                    .background(RecordRed.copy(alpha = 0.15f))
                            ) {
                                Icon(
                                    imageVector = Icons.Filled.Stop,
                                    contentDescription = "Stop",
                                    tint = RecordRed,
                                    modifier = Modifier.size(28.dp)
                                )
                            }
                        } else {
                            PulsatingRecordButton(
                                isRecording = false,
                                isPaused = false,
                                onClick = { startRecordingFlow() }
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            Text(
                text = "إعدادات سريعة",
                fontSize = 16.sp,
                fontWeight = FontWeight.SemiBold,
                color = TextPrimary,
                modifier = Modifier.fillMaxWidth().padding(bottom = 12.dp)
            )

            SettingsCard(
                icon = { Icon(Icons.Filled.Videocam, null, tint = Primary, modifier = Modifier.size(22.dp)) },
                title = "الدقة",
                subtitle = settings.videoResolution,
                onClick = { showSettings = true }
            )
            Spacer(modifier = Modifier.height(10.dp))

            SettingsCard(
                icon = { Icon(Icons.Filled.Speed, null, tint = Secondary, modifier = Modifier.size(22.dp)) },
                title = "معدل الإطارات",
                subtitle = "${settings.frameRate} FPS",
                onClick = { showSettings = true }
            )
            Spacer(modifier = Modifier.height(10.dp))

            SettingsCard(
                icon = { Icon(Icons.Filled.GraphicEq, null, tint = AccentOrange, modifier = Modifier.size(22.dp)) },
                title = "جودة الفيديو",
                subtitle = settings.videoBitrate,
                onClick = { showSettings = true }
            )
            Spacer(modifier = Modifier.height(10.dp))

            SettingsCard(
                icon = { Icon(Icons.Filled.Mic, null, tint = AccentPink, modifier = Modifier.size(22.dp)) },
                title = "مصدر الصوت",
                subtitle = when (settings.audioSource) {
                    "mic" -> "مايكروفون"
                    "mute" -> "بدون صوت"
                    else -> "صوت داخلي"
                },
                onClick = { showSettings = true }
            )
            Spacer(modifier = Modifier.height(24.dp))

            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = DarkCard.copy(alpha = 0.5f)),
                shape = RoundedCornerShape(16.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth().padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(Icons.Filled.Info, null, tint = Secondary, modifier = Modifier.size(20.dp))
                    Spacer(modifier = Modifier.width(10.dp))
                    Text(
                        text = "سيتم حفظ التسجيلات في مجلد ScreenRecorderPro",
                        fontSize = 13.sp,
                        color = TextSecondary
                    )
                }
            }
        }
    }
}

@Composable
private fun SettingChip(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    label: String
) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Icon(icon, null, tint = TextSecondary, modifier = Modifier.size(18.dp))
        Spacer(modifier = Modifier.height(4.dp))
        Text(text = label, fontSize = 12.sp, color = TextSecondary)
    }
}

fun formatDuration(millis: Long): String {
    val totalSeconds = millis / 1000
    val hours = totalSeconds / 3600
    val minutes = (totalSeconds % 3600) / 60
    val seconds = totalSeconds % 60
    return if (hours > 0) {
        String.format("%02d:%02d:%02d", hours, minutes, seconds)
    } else {
        String.format("%02d:%02d", minutes, seconds)
    }
}
