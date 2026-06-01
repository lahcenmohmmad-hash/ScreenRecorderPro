package com.screenrecorder.pro.utils

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.*
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "recorder_settings")

data class RecorderSettings(
    val videoResolution: String = "1080p",
    val videoBitrate: String = "12Mbps",
    val frameRate: Int = 60,
    val audioSource: String = "internal",
    val showTouches: Boolean = true,
    val floatingControls: Boolean = true,
    val countdownSeconds: Int = 3,
    val saveToGallery: Boolean = true,
)

class PreferencesManager(private val context: Context) {

    companion object {
        val VIDEO_RESOLUTION = stringPreferencesKey("video_resolution")
        val VIDEO_BITRATE = stringPreferencesKey("video_bitrate")
        val FRAME_RATE = intPreferencesKey("frame_rate")
        val AUDIO_SOURCE = stringPreferencesKey("audio_source")
        val SHOW_TOUCHES = booleanPreferencesKey("show_touches")
        val FLOATING_CONTROLS = booleanPreferencesKey("floating_controls")
        val COUNTDOWN_SECONDS = intPreferencesKey("countdown_seconds")
        val SAVE_TO_GALLERY = booleanPreferencesKey("save_to_gallery")
    }

    val settingsFlow: Flow<RecorderSettings> = context.dataStore.data.map { prefs ->
        RecorderSettings(
            videoResolution = prefs[VIDEO_RESOLUTION] ?: "1080p",
            videoBitrate = prefs[VIDEO_BITRATE] ?: "12Mbps",
            frameRate = prefs[FRAME_RATE] ?: 60,
            audioSource = prefs[AUDIO_SOURCE] ?: "internal",
            showTouches = prefs[SHOW_TOUCHES] ?: true,
            floatingControls = prefs[FLOATING_CONTROLS] ?: true,
            countdownSeconds = prefs[COUNTDOWN_SECONDS] ?: 3,
            saveToGallery = prefs[SAVE_TO_GALLERY] ?: true,
        )
    }

    suspend fun updateResolution(value: String) {
        context.dataStore.edit { it[VIDEO_RESOLUTION] = value }
    }

    suspend fun updateBitrate(value: String) {
        context.dataStore.edit { it[VIDEO_BITRATE] = value }
    }

    suspend fun updateFrameRate(value: Int) {
        context.dataStore.edit { it[FRAME_RATE] = value }
    }

    suspend fun updateAudioSource(value: String) {
        context.dataStore.edit { it[AUDIO_SOURCE] = value }
    }

    suspend fun updateShowTouches(value: Boolean) {
        context.dataStore.edit { it[SHOW_TOUCHES] = value }
    }

    suspend fun updateFloatingControls(value: Boolean) {
        context.dataStore.edit { it[FLOATING_CONTROLS] = value }
    }

    suspend fun updateCountdown(value: Int) {
        context.dataStore.edit { it[COUNTDOWN_SECONDS] = value }
    }

    suspend fun updateSaveToGallery(value: Boolean) {
        context.dataStore.edit { it[SAVE_TO_GALLERY] = value }
    }
}
