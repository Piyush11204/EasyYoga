const { spawn } = require('child_process');
const path = require('path');

const poseController = {
  analyzePose: async (req, res) => {
    try {
      const { frame, timeout = 30000 } = req.body;
      
      // Validate input
      if (!frame) {
        return res.status(400).json({ 
          error: 'No frame data provided for analysis',
          details: 'The request must include a base64 encoded frame' 
        });
      }

      const pythonScriptPath = path.join(__dirname, 'YogaPoseAnalysis.py');
      
      // Use a more robust promise-based approach
      const runPythonScript = () => {
        return new Promise((resolve, reject) => {
          const pythonProcess = spawn('python', [pythonScriptPath]);
          
          let outputData = '';
          let errorOutput = '';
          
          const timer = setTimeout(() => {
            pythonProcess.kill('SIGTERM');
            reject(new Error(`Python process timeout after ${timeout}ms`));
          }, timeout);

          pythonProcess.stdout.on('data', (data) => {
            outputData += data.toString();
          });

          pythonProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
          });

          pythonProcess.on('close', (exitCode) => {
            clearTimeout(timer);
            
            if (exitCode !== 0) {
              reject(new Error(`Python process exited with code ${exitCode}\nError: ${errorOutput}`));
              return;
            }

            resolve(outputData);
          });

          pythonProcess.on('error', (error) => {
            clearTimeout(timer);
            reject(new Error(`Failed to start Python process: ${error.message}`));
          });

          // Write input to Python script
          pythonProcess.stdin.write(JSON.stringify({ frame }));
          pythonProcess.stdin.end();
        });
      };

      // Execute Python script
      const result = await runPythonScript();

      // Parse and validate result
      try {
        const parsedResult = JSON.parse(result);
        
        // Validate parsed result structure
        if (!parsedResult.processedFrame || !parsedResult.poseAnalysis) {
          throw new Error('Invalid response structure from Python script');
        }

        res.json({
          processedFrame: parsedResult.processedFrame,
          poseAnalysis: parsedResult.poseAnalysis
        });
      } catch (parsingError) {
        throw new Error(`Failed to parse Python output: ${parsingError.message}\nRaw Output: ${result}`);
      }
    } catch (error) {
      console.error('Pose analysis error:', error);
      
      // Provide more detailed error response
      return res.status(500).json({ 
        error: 'Pose analysis failed', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
};

module.exports = poseController;