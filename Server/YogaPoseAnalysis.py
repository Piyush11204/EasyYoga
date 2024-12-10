import cv2
import mediapipe as mp
import numpy as np
import base64
import json
import sys
import traceback

class YogaPoseAnalysis:
    def __init__(self):
        # Suppress mediapipe logging
        mp.solutions.pose.logger.setLevel('ERROR')
        
        self.mp_drawing = mp.solutions.drawing_utils
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose(
            static_image_mode=True,
            min_detection_confidence=0.5, 
            min_tracking_confidence=0.5
        )

    def analyze_frame(self, frame):
        try:
            # Convert frame to RGB
            image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            image.flags.writeable = False
            
            # Process frame
            results = self.pose.process(image)
            image.flags.writeable = True
            image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

            # Draw landmarks if detected
            if results.pose_landmarks:
                self.mp_drawing.draw_landmarks(
                    image, 
                    results.pose_landmarks, 
                    self.mp_pose.POSE_CONNECTIONS
                )

            # Analyze pose
            pose_analysis = "No pose detected"
            if results.pose_landmarks:
                pose_analysis = self.analyze_pose(results.pose_landmarks)

            return image, pose_analysis

        except Exception as e:
            print(f"Error in analyze_frame: {str(e)}", file=sys.stderr)
            traceback.print_exc(file=sys.stderr)
            return frame, f"Analysis error: {str(e)}"

    def analyze_pose(self, landmarks):
        try:
            # Get relevant landmarks
            left_shoulder = landmarks.landmark[self.mp_pose.PoseLandmark.LEFT_SHOULDER]
            left_elbow = landmarks.landmark[self.mp_pose.PoseLandmark.LEFT_ELBOW]
            left_wrist = landmarks.landmark[self.mp_pose.PoseLandmark.LEFT_WRIST]
            left_hip = landmarks.landmark[self.mp_pose.PoseLandmark.LEFT_HIP]
            left_knee = landmarks.landmark[self.mp_pose.PoseLandmark.LEFT_KNEE]
            left_ankle = landmarks.landmark[self.mp_pose.PoseLandmark.LEFT_ANKLE]

            right_shoulder = landmarks.landmark[self.mp_pose.PoseLandmark.RIGHT_SHOULDER]
            right_elbow = landmarks.landmark[self.mp_pose.PoseLandmark.RIGHT_ELBOW]
            right_wrist = landmarks.landmark[self.mp_pose.PoseLandmark.RIGHT_WRIST]
            right_hip = landmarks.landmark[self.mp_pose.PoseLandmark.RIGHT_HIP]
            right_knee = landmarks.landmark[self.mp_pose.PoseLandmark.RIGHT_KNEE]
            right_ankle = landmarks.landmark[self.mp_pose.PoseLandmark.RIGHT_ANKLE]

            # Calculate angles
            left_elbow_angle = self.calculate_angle(left_shoulder, left_elbow, left_wrist)
            right_elbow_angle = self.calculate_angle(right_shoulder, right_elbow, right_wrist)
            left_shoulder_angle = self.calculate_angle(left_elbow, left_shoulder, left_hip)
            right_shoulder_angle = self.calculate_angle(right_elbow, right_shoulder, right_hip)
            left_hip_angle = self.calculate_angle(left_shoulder, left_hip, left_knee)
            right_hip_angle = self.calculate_angle(right_shoulder, right_hip, right_knee)
            left_knee_angle = self.calculate_angle(left_hip, left_knee, left_ankle)
            right_knee_angle = self.calculate_angle(right_hip, right_knee, right_ankle)

            # Detailed pose analysis logging
            print(f"Angles - Left Elbow: {left_elbow_angle}, Right Elbow: {right_elbow_angle}", file=sys.stderr)
            print(f"Left Shoulder: {left_shoulder_angle}, Right Shoulder: {right_shoulder_angle}", file=sys.stderr)
            print(f"Left Hip: {left_hip_angle}, Right Hip: {right_hip_angle}", file=sys.stderr)
            print(f"Left Knee: {left_knee_angle}, Right Knee: {right_knee_angle}", file=sys.stderr)

            # Analyze pose with more flexible criteria
            if self.is_mountain_pose(left_shoulder_angle, right_shoulder_angle, 
                                      left_hip_angle, right_hip_angle, 
                                      left_knee_angle, right_knee_angle):
                return "Mountain Pose (Tadasana)"
            elif self.is_tree_pose(left_knee_angle, right_knee_angle, 
                                    left_hip_angle, right_hip_angle):
                return "Tree Pose (Vrksasana)"
            elif self.is_warrior_pose(left_knee_angle, right_knee_angle, 
                                       left_hip_angle, right_hip_angle):
                return "Warrior Pose (Virabhadrasana)"
            else:
                return "Unknown Pose"

        except Exception as e:
            print(f"Error in analyze_pose: {str(e)}", file=sys.stderr)
            traceback.print_exc(file=sys.stderr)
            return f"Pose analysis error: {str(e)}"

    def calculate_angle(self, a, b, c):
        a = np.array([a.x, a.y])
        b = np.array([b.x, b.y])
        c = np.array([c.x, c.y])
        
        radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
        angle = np.abs(radians * 180.0 / np.pi)
        
        if angle > 180.0:
            angle = 360 - angle
        
        return angle

    def is_mountain_pose(self, left_shoulder_angle, right_shoulder_angle, 
                          left_hip_angle, right_hip_angle, 
                          left_knee_angle, right_knee_angle):
        return (150 < left_shoulder_angle < 210 and
                150 < right_shoulder_angle < 210 and
                150 < left_hip_angle < 210 and
                150 < right_hip_angle < 210 and
                150 < left_knee_angle < 210 and
                150 < right_knee_angle < 210)

    def is_tree_pose(self, left_knee_angle, right_knee_angle, 
                     left_hip_angle, right_hip_angle):
        return ((left_knee_angle < 110 and 150 < right_knee_angle < 210) or
                (right_knee_angle < 110 and 150 < left_knee_angle < 210)) and \
               (130 < left_hip_angle < 230 and 130 < right_hip_angle < 230)

    def is_warrior_pose(self, left_knee_angle, right_knee_angle, 
                        left_hip_angle, right_hip_angle):
        return ((80 < left_knee_angle < 130 and 140 < right_knee_angle < 220) or
                (80 < right_knee_angle < 130 and 140 < left_knee_angle < 220)) and \
               (80 < left_hip_angle < 160 and 80 < right_hip_angle < 160)

def process_frame(frame_data):
    try:
        # Decode base64 image
        img_data = base64.b64decode(frame_data)
        nparr = np.frombuffer(img_data, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if frame is None:
            raise ValueError("Failed to decode image")

        # Analyze frame
        yoga_analysis = YogaPoseAnalysis()
        processed_frame, pose_analysis = yoga_analysis.analyze_frame(frame)

        # Encode processed frame to base64
        _, buffer = cv2.imencode('.jpg', processed_frame)
        processed_frame_data = base64.b64encode(buffer).decode('utf-8')

        return processed_frame_data, pose_analysis

    except Exception as e:
        print(f"Comprehensive processing error: {str(e)}", file=sys.stderr)
        traceback.print_exc(file=sys.stderr)
        return None, f"Processing error: {str(e)}"

if __name__ == "__main__":
    try:
        # Read input from stdin
        input_data = json.loads(sys.stdin.read())
        frame_data = input_data.get('frame')

        if not frame_data:
            print(json.dumps({
                'error': 'No frame data provided',
                'processedFrame': None,
                'poseAnalysis': 'Error: Missing frame data'
            }), file=sys.stdout)
            sys.exit(1)

        # Process the frame
        processed_frame, pose_analysis = process_frame(frame_data)

        # Send the result back to Node.js
        result = json.dumps({
            'processedFrame': processed_frame,
            'poseAnalysis': pose_analysis
        })
        print(result)

    except Exception as e:
        print(json.dumps({
            'error': str(e),
            'processedFrame': None,
            'poseAnalysis': f'Unhandled error: {str(e)}'
        }), file=sys.stdout)
        traceback.print_exc(file=sys.stderr)
        sys.exit(1)