package com.screenrecorder.pro

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.screenrecorder.pro.ui.screens.MainScreen
import com.screenrecorder.pro.ui.theme.ScreenRecorderProTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            ScreenRecorderProTheme {
                MainScreen()
            }
        }
    }
}
