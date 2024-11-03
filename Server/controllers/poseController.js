const { spawn } = require('child_process');
const path = require('path');

const poseController = {
    analyzePose: async (req, res) => {
        try {
            const { frame, timeout = 10000 } = req.body;
            if (!frame) return res.status(400).json({ error: 'No frame data provided for analysis' });

            const pythonScriptPath = path.join(__dirname, 'YogaPoseAnalysis.py');
            const pythonProcess = spawn('python', [pythonScriptPath]);
            let outputData = '';
            let errorOutput = '';
            let timeoutTriggered = false;

            const processComplete = new Promise((resolve, reject) => {
                const timer = setTimeout(() => {
                    timeoutTriggered = true;
                    pythonProcess.kill('SIGTERM');
                    reject(new Error(`Python process timeout after ${timeout}ms`));
                }, timeout);

                pythonProcess.stdout.on('data', (data) => (outputData += data.toString()));
                pythonProcess.stderr.on('data', (data) => (errorOutput += data.toString()));

                pythonProcess.on('close', (exitCode) => {
                    clearTimeout(timer);
                    if (timeoutTriggered) return;
                    if (exitCode !== 0) {
                        reject(new Error(`Python process exited with code ${exitCode}\nError: ${errorOutput}`));
                        return;
                    }
                    resolve(outputData);
                });

                pythonProcess.on('error', (error) => reject(new Error(`Failed to start Python process: ${error.message}`)));
            });

            pythonProcess.stdin.write(JSON.stringify({ frame }));
            pythonProcess.stdin.end();

            const result = await processComplete;

            try {
                const parsedResult = JSON.parse(result);
                res.json({
                    processedFrame: parsedResult.processedFrame,
                    poseAnalysis: parsedResult.poseAnalysis
                });
            } catch (parsingError) {
                throw new Error(`Failed to parse Python output: ${parsingError.message}\nRaw Output: ${result}`);
            }
        } catch (error) {
            console.error('Pose analysis error:', error);
            return res.status(500).json({ error: 'Pose analysis failed', details: error.message });
        }
    }
};

module.exports = poseController;
