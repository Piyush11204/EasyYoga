import cv2
import mediapipe as mp
import numpy as np
import base64
import json
import sys

class YogaPoseAnalysis:
    def __init__(self):
        self.mp_drawing = mp.solutions.drawing_utils
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)

    def analyze_frame(self, frame):
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        image.flags.writeable = False
        results = self.pose.process(image)
        image.flags.writeable = True
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

        self.mp_drawing.draw_landmarks(
            image, results.pose_landmarks, self.mp_pose.POSE_CONNECTIONS)

        pose_analysis = "No pose detected"
        if results.pose_landmarks:
            pose_analysis = self.analyze_pose(results.pose_landmarks)

        return image, pose_analysis

    def analyze_pose(self, landmarks):
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

        # Analyze pose
        if self.is_mountain_pose(left_shoulder_angle, right_shoulder_angle, left_hip_angle, right_hip_angle, left_knee_angle, right_knee_angle):
            return "Mountain Pose (Tadasana)"
        elif self.is_tree_pose(left_knee_angle, right_knee_angle, left_hip_angle, right_hip_angle):
            return "Tree Pose (Vrksasana)"
        elif self.is_warrior_pose(left_knee_angle, right_knee_angle, left_hip_angle, right_hip_angle):
            return "Warrior Pose (Virabhadrasana)"
        else:
            return "Unknown Pose"

    def calculate_angle(self, a, b, c):
        a = np.array([a.x, a.y])
        b = np.array([b.x, b.y])
        c = np.array([c.x, c.y])
        
        radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
        angle = np.abs(radians * 180.0 / np.pi)
        
        if angle > 180.0:
            angle = 360 - angle
        
        return angle

    def is_mountain_pose(self, left_shoulder_angle, right_shoulder_angle, left_hip_angle, right_hip_angle, left_knee_angle, right_knee_angle):
        return (160 < left_shoulder_angle < 200 and
                160 < right_shoulder_angle < 200 and
                160 < left_hip_angle < 200 and
                160 < right_hip_angle < 200 and
                160 < left_knee_angle < 200 and
                160 < right_knee_angle < 200)

    def is_tree_pose(self, left_knee_angle, right_knee_angle, left_hip_angle, right_hip_angle):
        return ((left_knee_angle < 100 and 160 < right_knee_angle < 200) or
                (right_knee_angle < 100 and 160 < left_knee_angle < 200)) and (140 < left_hip_angle < 220 and 140 < right_hip_angle < 220)

    def is_warrior_pose(self, left_knee_angle, right_knee_angle, left_hip_angle, right_hip_angle):
        return ((90 < left_knee_angle < 120 and 150 < right_knee_angle < 210) or
                (90 < right_knee_angle < 120 and 150 < left_knee_angle < 210)) and   (90 < left_hip_angle < 150 and 90 < right_hip_angle < 150)

def process_frame(frame_data):
    yoga_analysis = YogaPoseAnalysis()

    # Decode base64 image
    img_data = base64.b64decode(frame_data)
    nparr = np.frombuffer(img_data, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Analyze frame
    processed_frame, pose_analysis = yoga_analysis.analyze_frame(frame)

    # Encode processed frame to base64
    _, buffer = cv2.imencode('.jpg', processed_frame)
    processed_frame_data = base64.b64encode(buffer).decode('utf-8')

    return processed_frame_data, pose_analysis

if __name__ == "__main__":
    # Read input from stdin
    input_data = json.loads(sys.stdin.read())
    frame_data = input_data['frame']

    # Process the frame
    processed_frame, pose_analysis = process_frame(frame_data)

    # Send the result back to Node.js
    result = json.dumps({
        'processedFrame': processed_frame,
        'poseAnalysis': pose_analysis
    })
    print(result)