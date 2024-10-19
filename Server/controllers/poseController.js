const { spawn } = require('child_process');

const poseController = {
    analyzePose: (req, res) => {
        const { frame } = req.body;
        const pythonProcess = spawn('python', ['YogaPoseAnalysis.py']);
        
        let result = '';
        
        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
        });
        
        pythonProcess.stderr.on('data', (data) => {
            console.error(`Python script error: ${data}`);
        });
        
        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                return res.status(500).json({ error: 'Python script exited with error' });
            }
            try {
                const parsedResult = JSON.parse(result);
                res.json({
                    processedFrame: parsedResult.processedFrame,
                    poseDetails: parsedResult.poseDetails
                });
            } catch (error) {
                console.error('Failed to parse Python script output:', error);
                console.error('Python script output:', result);
                res.status(500).json({ error: 'Failed to parse Python script output' });
            }
        });
        
        pythonProcess.stdin.write(JSON.stringify({ frame }));
        pythonProcess.stdin.end();
    }
};

module.exports = poseController;