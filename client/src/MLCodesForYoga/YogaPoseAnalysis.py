import cv2
import mediapipe as mp
import numpy as np
import base64

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

        if results.pose_landmarks:
            self.analyze_pose(results.pose_landmarks)

        return image

    def analyze_pose(self, landmarks):
        # Your pose analysis logic here
        # For example:
        left_shoulder = landmarks.landmark[self.mp_pose.PoseLandmark.LEFT_SHOULDER]
        left_elbow = landmarks.landmark[self.mp_pose.PoseLandmark.LEFT_ELBOW]
        left_wrist = landmarks.landmark[self.mp_pose.PoseLandmark.LEFT_WRIST]

        right_shoulder = landmarks.landmark[self.mp_pose.PoseLandmark.RIGHT_SHOULDER]
        right_elbow = landmarks.landmark[self.mp_pose.PoseLandmark.RIGHT_ELBOW]
        right_wrist = landmarks.landmark[self.mp_pose.PoseLandmark.RIGHT_WRIST]

        if (left_wrist.y < left_shoulder.y and right_wrist.y < right_shoulder.y):
            return "Arms are raised!"
        else:
            return "Arms are not raised."

def process_frame(frame_data):
    yoga_analysis = YogaPoseAnalysis()
    
    # Decode base64 image
    img_data = base64.b64decode(frame_data)
    nparr = np.frombuffer(img_data, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Analyze frame
    processed_frame = yoga_analysis.analyze_frame(frame)

    # Encode processed frame to base64
    _, buffer = cv2.imencode('.jpg', processed_frame)
    processed_frame_data = base64.b64encode(buffer).decode('utf-8')

    return processed_frame_data

if __name__ == "__main__":
    # This block is for testing purposes
    cap = cv2.VideoCapture(0)
    yoga_analysis = YogaPoseAnalysis()

    while cap.isOpened():
        success, frame = cap.read()
        if not success:
            print("Ignoring empty camera frame.")
            continue

        processed_frame = yoga_analysis.analyze_frame(frame)
        cv2.imshow('Yoga Pose Analysis', processed_frame)

        if cv2.waitKey(5) & 0xFF == 27:
            break

    cap.release()
    cv2.destroyAllWindows()