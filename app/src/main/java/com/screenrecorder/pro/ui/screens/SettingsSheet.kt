package com.screenrecorder.pro.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.screenrecorder.pro.ui.theme.*
import com.screenrecorder.pro.utils.RecorderSettings

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsSheet(
    settings: RecorderSettings,
    onDismiss: () -> Unit,
    onUpdateResolution: (String) -> Unit,
    onUpdateBitrate: (String) -> Unit,
    onUpdateFrameRate: (Int) -> Unit,
    onUpdateAudioSource: (String) -> Unit,
    onUpdateShowTouches: (Boolean) -> Unit,
    onUpdateFloatingControls: (Boolean) -> Unit,
    onUpdateCountdown: (Int) -> Unit,
) {
    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(
            usePlatformDefaultWidth = false,
            dismissOnBackPress = true,
            dismissOnClickOutside = true
        )
    ) {
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
                    .padding(top = 48.dp, bottom = 32.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(onClick = onDismiss) {
                        Icon(Icons.Filled.Close, "Close", tint = TextPrimary)
                    }
                    Text(
                        text = "الإعدادات",
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary
                    )
                    Spacer(modifier = Modifier.width(48.dp))
                }

                Spacer(modifier = Modifier.height(30.dp))

                SectionTitle("الدقة")
                Spacer(modifier = Modifier.height(12.dp))
                ChipsRow(
                    options = listOf("720p", "1080p", "1440p", "4K"),
                    selected = settings.videoResolution,
                    onSelect = onUpdateResolution
                )

                Spacer(modifier = Modifier.height(24.dp))

                SectionTitle("جودة الفيديو (Bitrate)")
                Spacer(modifier = Modifier.height(12.dp))
                ChipsRow(
                    options = listOf("8Mbps", "12Mbps", "18Mbps", "24Mbps"),
                    selected = settings.videoBitrate,
                    onSelect = onUpdateBitrate
                )

                Spacer(modifier = Modifier.height(24.dp))

                SectionTitle("معدل الإطارات (FPS)")
                Spacer(modifier = Modifier.height(12.dp))
                ChipsRow(
                    options = listOf("30", "60", "90", "120"),
                    selected = "${settings.frameRate}",
                    onSelect = { onUpdateFrameRate(it.toInt()) }
                )

                Spacer(modifier = Modifier.height(24.dp))

                SectionTitle("مصدر الصوت")
                Spacer(modifier = Modifier.height(12.dp))
                ChipsRow(
                    options = listOf("internal", "mic", "mute"),
                    selected = settings.audioSource,
                    onSelect = onUpdateAudioSource,
                    labels = mapOf(
                        "internal" to "داخلي",
                        "mic" to "مايكروفون",
                        "mute" to "بدون صوت"
                    )
                )

                Spacer(modifier = Modifier.height(24.dp))

                SectionTitle("العد التنازلي")
                Spacer(modifier = Modifier.height(12.dp))
                ChipsRow(
                    options = listOf("0", "3", "5", "10"),
                    selected = "${settings.countdownSeconds}",
                    onSelect = { onUpdateCountdown(it.toInt()) },
                    labels = mapOf("0" to "بدون")
                )

                Spacer(modifier = Modifier.height(24.dp))

                SectionTitle("خيارات إضافية")
                Spacer(modifier = Modifier.height(12.dp))

                ToggleSetting(
                    icon = Icons.Filled.TouchApp,
                    title = "إظهار اللمسات",
                    subtitle = "إظهار نقاط اللمس في التسجيل",
                    checked = settings.showTouches,
                    onCheckedChange = onUpdateShowTouches
                )

                Spacer(modifier = Modifier.height(8.dp))

                ToggleSetting(
                    icon = Icons.Filled.PictureInPictureAlt,
                    title = "أزرار تحكم عائمة",
                    subtitle = "إظهار أزرار تحكم عائمة أثناء التسجيل",
                    checked = settings.floatingControls,
                    onCheckedChange = onUpdateFloatingControls
                )

                Spacer(modifier = Modifier.height(40.dp))
            }
        }
    }
}

@Composable
private fun SectionTitle(text: String) {
    Text(
        text = text,
        fontSize = 15.sp,
        fontWeight = FontWeight.SemiBold,
        color = TextPrimary,
        modifier = Modifier.padding(start = 4.dp)
    )
}

@Composable
private fun ChipsRow(
    options: List<String>,
    selected: String,
    onSelect: (String) -> Unit,
    labels: Map<String, String>? = null
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        options.forEach { option ->
            val isSelected = option == selected
            val displayLabel = labels?.get(option) ?: option

            val containerColor = if (isSelected) Primary.copy(alpha = 0.25f) else DarkCard
            val borderColor = if (isSelected) Primary else DarkCard
            val textColor = if (isSelected) TextPrimary else TextSecondary
            val fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal

            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(12.dp))
                    .background(containerColor)
                    .border(1.5.dp, borderColor, RoundedCornerShape(12.dp))
                    .clickable { onSelect(option) }
                    .padding(horizontal = 16.dp, vertical = 10.dp)
            ) {
                Text(
                    text = displayLabel,
                    fontSize = 14.sp,
                    fontWeight = fontWeight,
                    color = textColor
                )
            }
        }
    }
}

@Composable
private fun ToggleSetting(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    title: String,
    subtitle: String,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = DarkCard),
        shape = RoundedCornerShape(14.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(36.dp)
                    .clip(RoundedCornerShape(10.dp))
                    .background(Primary.copy(alpha = 0.15f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(icon, null, tint = Primary, modifier = Modifier.size(18.dp))
            }
            Spacer(modifier = Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(title, fontSize = 14.sp, fontWeight = FontWeight.Medium, color = TextPrimary)
                Text(subtitle, fontSize = 12.sp, color = TextSecondary)
            }
            Switch(
                checked = checked,
                onCheckedChange = onCheckedChange,
                colors = SwitchDefaults.colors(
                    checkedThumbColor = Primary,
                    checkedTrackColor = Primary.copy(alpha = 0.3f),
                    uncheckedThumbColor = TextTertiary,
                    uncheckedTrackColor = DarkSurface
                )
            )
        }
    }
}
