package com.vineetm1204m.voxsentrymobile

import android.content.Context
import android.util.Log
import org.tensorflow.lite.Interpreter
import java.io.FileInputStream
import java.nio.MappedByteBuffer
import java.nio.channels.FileChannel
import java.util.LinkedList

class InferenceEngine(private val context: Context) {

    interface InferenceListener {
        fun onDetectionResult(isThreat: Boolean, confidence: Float)
    }

    private var listener: InferenceListener? = null
    private var interpreter: Interpreter? = null

    // Smoothing: Rolling buffer for majority vote over the last 3 windows
    private val resultBuffer = LinkedList<Boolean>()
    private val bufferSize = 3

    // Configurable threshold for threat detection
    // TODO: Update this threshold based on model evaluation metrics
    private val THREAT_THRESHOLD = 0.5f

    init {
        try {
            val modelBuffer = loadModelFile(context, "voice_clone_detector_hindi.tflite")
            val options = Interpreter.Options()
            options.setNumThreads(4) // Use 4 threads for faster CPU inference
            interpreter = Interpreter(modelBuffer, options)
            Log.i("InferenceEngine", "TFLite model loaded successfully.")
        } catch (e: Exception) {
            Log.e("InferenceEngine", "Error loading TFLite model", e)
        }
    }

    private fun loadModelFile(context: Context, modelName: String): MappedByteBuffer {
        val fileDescriptor = context.assets.openFd(modelName)
        val inputStream = FileInputStream(fileDescriptor.fileDescriptor)
        val fileChannel = inputStream.channel
        val startOffset = fileDescriptor.startOffset
        val declaredLength = fileDescriptor.declaredLength
        return fileChannel.map(FileChannel.MapMode.READ_ONLY, startOffset, declaredLength)
    }

    fun setListener(newListener: InferenceListener?) {
        listener = newListener
    }

    fun processAudioWindow(audioData: ShortArray) {
        if (interpreter == null) {
            Log.e("InferenceEngine", "Interpreter not initialized. Cannot run inference.")
            return
        }

        // 1. Extract Features
        // The model expects shape [1, 64, 188, 1] (Float32)
        val features = extractFeatures(audioData)
        if (features == null) {
            Log.e("InferenceEngine", "Feature extraction returned null.")
            return
        }

        // 2. Run Inference
        val output = Array(1) { FloatArray(1) }
        try {
            interpreter?.run(features, output)
        } catch (e: Exception) {
            Log.e("InferenceEngine", "Inference failed", e)
            return
        }

        val rawConfidence = output[0][0]
        val isThreat = rawConfidence > THREAT_THRESHOLD

        Log.d("InferenceEngine", "Raw confidence: $rawConfidence, isThreat: $isThreat")

        // 3. Apply Smoothing (Majority Vote)
        resultBuffer.addLast(isThreat)
        if (resultBuffer.size > bufferSize) {
            resultBuffer.removeFirst()
        }

        val threatCount = resultBuffer.count { it }
        val smoothedIsThreat = threatCount > (resultBuffer.size / 2)

        // Dispatch smoothed result and raw confidence to UI
        listener?.onDetectionResult(smoothedIsThreat, rawConfidence)
    }

    /**
     * EXTRACT FEATURES
     * WARNING: This needs numeric validation against the Python reference!
     * We need the exact parameters (n_fft, hop_length, n_mels) to produce
     * the exact 64x188 matrix the model expects.
     * 
     * Currently implementing a stub that returns a zeroed 1x64x188x1 tensor
     * so the pipeline compiles and doesn't crash, but it WILL NOT detect anything
     * accurately until the math is verified.
     */
    private fun extractFeatures(audioData: ShortArray): Array<Array<Array<FloatArray>>>? {
        val numMels = 64
        val numFrames = 188
        
        // Output shape required: [1, 64, 188, 1]
        val outputFeatures = Array(1) { 
            Array(numMels) { 
                Array(numFrames) { 
                    FloatArray(1) 
                } 
            } 
        }

        // TODO: Implement actual DSP (STFT, Mel filterbank, Log scaling) here
        // using the exact parameters from the training notebook.
        
        return outputFeatures
    }

    fun reset() {
        resultBuffer.clear()
    }
    
    fun close() {
        interpreter?.close()
        interpreter = null
    }
}
