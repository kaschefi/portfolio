// src/data/figmaPagesData.ts
// Comprehensive architectural specifications and data models for Volume 2 (Sawyer Robot: Waving Task & Shell Game).
// Based on the Project Report: "Sawyer Robot - Implementation of Waving Task, Shell Game, and Tracking Methods"
// Submitted by Mohammad Kashefirad, Hochschule Campus Wien (Computer Science and Digital Communications).

export interface FigmaPageContent {
  pageNumber: string;         // "01", "02", "03", "04", "05"
  pageLabel: string;          // e.g. "GENESIS // SYSTEM ARCHITECTURE"
  title: string;              // Crisp, punchy title
  subtitle: string;           // Descriptive 1-2 sentence subtitle
  discipline?: string;        // e.g. "Robotics & Computer Vision"
  thesis?: string;            // Deep engineering thesis
  overview?: string;          // Concise 1-2 paragraph executive summary
  description?: string;       // In-depth technical breakdown
  codeSnippet?: string;       // Production code excerpt
  metadata?: {
    binding: string;
    format: string;
    theme: string;
    motif: string;
  };
  keyMetrics?: Array<{ label: string; value: string }>;
  highlights?: string[];
  image?: string;
  imageCaption?: string;
}

export const figmaPagesData: FigmaPageContent[] = [
  // =========================================================================================
  // PAGE 01: GENESIS & SYSTEM ARCHITECTURE
  // =========================================================================================
  {
    pageNumber: "01",
    pageLabel: "GENESIS // SYSTEM ARCHITECTURE",
    title: "Sawyer Robot Platform",
    subtitle: "7-DoF Cobot Architecture, WebSocket Teleoperation & Waving Task",
    discipline: "Collaborative Robotics & Distributed Systems",
    thesis: "Transforming industrial manipulators into environmentally aware collaborative partners requires a decoupled, distributed node architecture. The Sawyer Robot platform synthesizes WebSocket rosbridge teleoperation, deterministic Design Tree execution, and 7-DoF trajectory controllers to achieve safe, interactive human-robot collaboration.",
    overview:
      "Collaborative robots (cobots) like the Sawyer from Rethink Robotics play an increasingly vital role in modern automation, featuring series elastic actuators, integrated force sensing, and a high-resolution wrist camera (right_hand_camera). This project explores environmental awareness and cyber-physical interactivity through two distinct practical challenges: a remote Waving Task and a vision-driven Shell Game.\n\nThe system is built on an Ubuntu 20.04 LTS environment via Windows Subsystem for Linux (WSL 2) using ROS 1 Noetic Ninjemys. By modularizing the software into separate ROS nodes—camera streaming, vision processing, game state machines, and joint trajectory control—the system ensures that heavy computer vision computation never blocks high-frequency kinematic control loops.",
    description:
      "### Core Problem Statement & Collaborative Robotics\n" +
      "Traditional industrial robots operate blindly on pre-programmed, repetitive trajectories inside safety cages. Cobots like the 7-DoF Sawyer are designed to operate safely alongside humans, demanding real-time sensory perception, dynamic trajectory generation, and seamless remote interfaces.\n\n" +
      "### Baseline Teleoperation Pipeline (The Waving Task)\n" +
      "The Waving Task demonstrates low-latency teleoperation bridging a standard web browser with physical robotic hardware:\n\n" +
      "1. Web Interface & ROS Bridge: A Node.js backend serves a lightweight web application that communicates with the ROS network via WebSocket connections using `rosbridge_suite`. Commands dispatch asynchronously to dedicated sequence and logic nodes rather than piping raw joint coordinates directly.\n\n" +
      "2. Design Tree Motion Architecture: To guarantee safe, repeatable articulation without singular configurations, the waving motion is structured as a hierarchical Design Tree:\n" +
      "   • Default Position Frame: The arm safely interpolates to a centered baseline posture, establishing a known initial configuration.\n" +
      "   • Loop Container: A repeating sequence bracket executes exactly 5 continuous waving animation cycles without requiring recurring triggers.\n" +
      "   • Waypoint Controllers: Linearly translates the end-effector leftwards and rightwards across defined Cartesian boundaries via standard trajectory controllers before returning to an idle rest state.\n\n" +
      "### Distributed ROS Node Ecosystem\n" +
      "The architecture decouples responsibilities across 5 isolated processes: Gazebo simulation environment (`sawyer_world.launch`), hardware action server (`joint_trajectory_action_server.py`), MoveIt planning scene (`sawyer_moveit.launch`), custom game controller (`shuffle_cups.py`), and the master vision tracker (`sim_main.py`).",
    keyMetrics: [
      { label: "Manipulator DoF", value: "7 Revolute Joints" },
      { label: "ROS Middleware", value: "ROS 1 Noetic (WSL 2)" },
      { label: "Waving Execution", value: "5 Continuous Cycles" },
      { label: "Distributed Nodes", value: "5 Discrete Nodes" },
    ],
    highlights: [
      "7-Degree-of-Freedom Sawyer cobot platform with series elastic actuators and integrated wrist camera.",
      "Asynchronous WebSocket teleoperation via rosbridge_suite connecting Node.js web interfaces to ROS topics.",
      "Hierarchical Design Tree motion architecture ensuring predictable waving routines and singularity avoidance.",
      "Fully modular ROS node graph isolating computer vision pipelines from high-frequency trajectory control loops."
    ],
    metadata: {
      binding: "Obsidian cloth · crimson foil",
      format: "150 × 220 mm · FH Campus Wien Edition",
      theme: "Sawyer Robot · visual servoing & cobots",
      motif: "7-DoF Articulator",
    },
    codeSnippet:
`# Waving Task Logic Node & Design Tree Trajectory Execution (src/waving_task.py)
import rospy
from std_msgs.msg import String
from trajectory_msgs.msg import JointTrajectory, JointTrajectoryPoint
from intera_interface import Limb

class SawyerWavingNode:
    def __init__(self):
        rospy.init_node("sawyer_waving_controller", anonymous=True)
        self.limb = Limb("right")
        self.traj_pub = rospy.Publisher(
            "/robot/limb/right/joint_trajectory_controller/command",
            JointTrajectory,
            queue_size=10
        )
        rospy.Subscriber("/web_gui/trigger_wave", String, self.on_wave_triggered)
        rospy.loginfo("Sawyer Waving Node ready for WebSocket triggers.")

    def on_wave_triggered(self, msg):
        """Executes the Design Tree: Default Posture -> 5-Cycle Loop -> Neutral Idle."""
        rospy.loginfo("Wave command received. Interpolating to default posture...")
        self.limb.move_to_neutral()

        # Design Tree Loop Container: 5 cycles of linear left-right translation
        for cycle in range(5):
            self.execute_waypoint_sweep(direction="left", duration=0.8)
            self.execute_waypoint_sweep(direction="right", duration=0.8)

        self.limb.move_to_neutral()
        rospy.loginfo("Waving sequence completed successfully.")`
  },

  // =========================================================================================
  // PAGE 02: VISION SUBSYSTEM & OBJECT DETECTION
  // =========================================================================================
  {
    pageNumber: "02",
    pageLabel: "PERCEPTION // VISION & DETECTION SYSTEMS",
    title: "Object Detection & Vision Benchmark",
    subtitle: "Classical HSV Color Filtering vs. Deep Learning YOLOv8 & ArUco Markers",
    discipline: "Computer Vision & Real-Time Feature Extraction",
    thesis: "In high-speed visual servoing, millisecond inference latency outweighs theoretical feature invariance. While deep neural networks deliver superior static classification under dynamic ambient lighting, classical HSV thresholding provides zero-latency continuous streaming essential for tracking high-velocity shuffle trajectories.",
    overview:
      "To reliably execute the Shell Game, a highly robust computer vision pipeline is paramount. Before the system can follow the continuous movement of the target cup, it requires accurate, frame-by-frame identification of the objects on the workspace table. A strict project prerequisite was established: kinematic simulation and physical deployment could only begin once the underlying detection system demonstrated an accuracy strictly greater than 90%.\n\nThree distinct object detection paradigms were implemented and empirically benchmarked: Classical HSV Color Filtering with OpenCV Contour Detection, Deep Learning Object Detection using YOLOv8 (trained on Roboflow's 'Red Solo Cups' dataset), and Fiducial Marker-Based Detection (ArUco).",
    description:
      "### Evaluation of Object Detection Paradigms\n\n" +
      "1. Deep Learning Object Detection (YOLOv8):\n" +
      "   • Architecture: YOLOv8 convolutional neural network trained on open-source Roboflow plastic cup imagery.\n" +
      "   • Static Performance: Achieved an impressive 96% accuracy on static workspace frames, demonstrating high resilience against ambient lighting shifts and partial shadows.\n" +
      "   • Dynamic Bottleneck: During high-speed shuffling, the neural network introduced small inference latencies (~25-45ms per frame on CPU). In high-frequency visual servoing, this micro-delay caused the tracker to periodically drop bounding boxes mid-swap, yielding a successful shuffle tracking rate of only 6 out of 10 trials.\n\n" +
      "2. Classical Image Processing (HSV Color Filtering & OpenCV):\n" +
      "   • Mechanism: Standard HSV color space thresholding followed by morphological opening/closing and contour centroid extraction ($C_x = M_{10}/M_{00}, C_y = M_{01}/M_{00}$).\n" +
      "   • Performance: Achieved 100% detection accuracy within the controlled simulation workspace. Operating with near-zero latency, it supplied a continuous, high-frequency stream of center-point coordinates to the tracking algorithm, successfully tracking the winning cup in 9 out of 10 rapid shuffle trials.\n\n" +
      "3. Fiducial Marker-Based Detection (ArUco):\n" +
      "   • Evaluated to provide ground-truth 6D pose estimation and verify camera distortion calibration matrices.\n\n" +
      "### Engineering Trade-Off & Conclusion\n" +
      "While YOLOv8 provides superior generalizability in uncontrolled lighting, in controlled robotic workcells or Gazebo digital twins, classical color segmentation is the vastly superior paradigm due to its sub-millisecond execution and negligible resource footprint.",
    keyMetrics: [
      { label: "HSV Accuracy", value: "100% (Controlled)" },
      { label: "YOLOv8 Static", value: "96% Accuracy" },
      { label: "HSV Tracking Rate", value: "90% (9/10 Trials)" },
      { label: "YOLOv8 Tracking Rate", value: "60% (6/10 Trials)" },
    ],
    highlights: [
      "Rigorous comparative benchmark between deep learning (YOLOv8) and classical OpenCV image processing.",
      "Custom YOLOv8 model trained on Roboflow 'Red Solo Cups' dataset for feature-based detection.",
      "Near-zero latency HSV contour centroid pipeline operating at full camera frame rate.",
      "Empirical demonstration that inference latency in deep networks degrades high-speed dynamic tracking."
    ],
    codeSnippet:
`# High-Speed HSV Color Segmentation & Centroid Extraction (src/vision_detector.py)
import cv2
import numpy as np

def detect_cup_centroids_hsv(frame_bgr: np.ndarray) -> list[tuple[int, int]]:
    """Extracts (x, y) centroid coordinates of green cups in HSV color space."""
    hsv = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2HSV)
    # Green cup mask bounds
    lower_green = np.array([35, 80, 80])
    upper_green = np.array([85, 255, 255])
    mask = cv2.inRange(hsv, lower_green, upper_green)

    # Morphological noise removal
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)

    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    centroids = []
    for cnt in contours:
        if cv2.contourArea(cnt) > 400:
            M = cv2.moments(cnt)
            if M["m00"] != 0:
                cx = int(M["m10"] / M["m00"])
                cy = int(M["m01"] / M["m00"])
                centroids.append((cx, cy))
    return centroids`
  },

  // =========================================================================================
  // PAGE 03: MULTI-OBJECT TRACKING & OCCLUSION HANDLING
  // =========================================================================================
  {
    pageNumber: "03",
    pageLabel: "TRACKING // KALMAN & OCCLUSION TETHERING",
    title: "Kalman Multi-Object Tracking",
    subtitle: "Momentum State Vectors, Cosine Velocity Penalties & Dynamic Tethering",
    discipline: "State Estimation, Hungarian Assignment & Tracking-by-Detection",
    thesis: "Tracking identical objects through rapid, intersecting trajectories demands momentum continuity and occlusion memory. Augmenting Hungarian bipartite matching with cosine similarity velocity penalties and dynamic leader-follower tethering slashes Identity Switch rates from 50% to under 10%.",
    overview:
      "Detecting objects in individual frames is insufficient for the Shell Game; the system must maintain the identity of each cup over time as cups rapidly swap positions and cross paths. To solve this, a custom Multi-Object Tracking (MOT) pipeline was engineered from scratch based on the Tracking-by-Detection paradigm.\n\nThe system integrates three core mathematical and logical pillars: State Estimation via 4D Linear Kalman Filtering, Data Association with an Augmented Cost Matrix, and Dynamic Occlusion Tethering.",
    description:
      "### Mathematical Architecture of the Custom Tracker\n\n" +
      "1. State Estimation via Linear Kalman Filtering:\n" +
      "   • Each of the three cups is assigned an independent linear Kalman Filter with state vector $\\mathbf{x} = [x, y, dx, dy]^T$.\n" +
      "   • Allows the system to track both spatial position and momentum (velocity vector). If a detection drops for several frames, the Kalman Filter projects its trajectory.\n" +
      "   • If a cup remains lost, an exponential velocity decay factor (0.85) smoothly decelerates its predicted position, preventing erratic spatial jumps.\n\n" +
      "2. Data Association & Augmented Cost Matrix:\n" +
      "   • Current detections are matched with predicted cup positions using the Hungarian Algorithm (`scipy.optimize.linear_sum_assignment`).\n" +
      "   • Rather than relying purely on Euclidean distance, an Augmented Cost Function introduces a Velocity Penalty using Cosine Similarity:\n" +
      "     $$\\text{Cost}(i, j) = \\|\\mathbf{p}_i - \\mathbf{z}_j\\| + \\lambda \\left(1 - \\frac{\\mathbf{v}_i \\cdot (\\mathbf{z}_j - \\mathbf{p}_i)}{\\|\\mathbf{v}_i\\| \\|\\mathbf{z}_j - \\mathbf{p}_i\\| + \\epsilon}\\right)$$\n" +
      "   • Detections aligning with the cup's predicted momentum vector are strongly favored, preventing the tracker from assigning detections that would require physically impossible sudden 180° trajectory reversals.\n\n" +
      "3. Dynamic Occlusion Handling via 'Tethering':\n" +
      "   • When cups pass in close proximity (within an 80-pixel overlap threshold) or are occluded by the robotic arm, detection drops. The tracker flags the lost cup as 'tethered'.\n" +
      "   • The hidden cup temporarily rides along with the visible 'leader' cup, inheriting its position and velocity until separation occurs, whereupon it cleanly resumes its independent Kalman state.\n\n" +
      "### Ablation Study & Results\n" +
      "In baseline distance-only matching, crossing cups suffered an Identity Switch rate of ~50%. The integration of momentum estimation and occlusion tethering reduced the Identity Switch rate to under 10%.",
    keyMetrics: [
      { label: "State Vector", value: "[x, y, dx, dy] 4D Vector" },
      { label: "Velocity Decay", value: "0.85 Deceleration" },
      { label: "Tether Threshold", value: "80px Proximity" },
      { label: "ID Switch Rate", value: "< 10% (vs 50% Base)" },
    ],
    highlights: [
      "Custom Kalman Filter tracking 2D Cartesian coordinates and instantaneous momentum vectors simultaneously.",
      "Cosine similarity velocity penalty heavily penalizing physically impossible trajectory reversals during swaps.",
      "Dynamic leader-follower occlusion tethering preserving target cup identity during complete visual overlap.",
      "Ablation study verified: Identity Switch rate reduced by over 80% under high-speed S-curve shuffles."
    ],
    codeSnippet:
`# Augmented Hungarian Cost Matrix with Cosine Velocity Penalty (src/tracker.py)
import numpy as np
from scipy.optimize import linear_sum_assignment

def associate_detections_to_trackers(trackers, detections, lambda_vel=40.0):
    """Bipartite matching combining Euclidean distance and momentum alignment."""
    num_t, num_d = len(trackers), len(detections)
    if num_t == 0 or num_d == 0:
        return [], list(range(num_d)), list(range(num_t))

    cost_matrix = np.zeros((num_t, num_d), dtype=np.float32)
    for i, trk in enumerate(trackers):
        pred_pos = trk.get_predicted_pos()  # [x, y]
        pred_vel = trk.get_velocity()       # [dx, dy]
        vel_norm = np.linalg.norm(pred_vel)

        for j, det in enumerate(detections):
            dist = np.linalg.norm(pred_pos - det)
            # Cosine similarity velocity alignment penalty
            displacement = det - pred_pos
            disp_norm = np.linalg.norm(displacement)
            if vel_norm > 1.0 and disp_norm > 1.0:
                cos_sim = np.dot(pred_vel, displacement) / (vel_norm * disp_norm)
                vel_penalty = lambda_vel * (1.0 - cos_sim)
            else:
                vel_penalty = 0.0

            cost_matrix[i, j] = dist + vel_penalty

    row_ind, col_ind = linear_sum_assignment(cost_matrix)
    return list(zip(row_ind, col_ind))`
  },

  // =========================================================================================
  // PAGE 04: SIMULATION & MOVEIT MOTION PLANNING
  // =========================================================================================
  {
    pageNumber: "04",
    pageLabel: "KINEMATICS // GAZEBO & MOVEIT PLANNING",
    title: "MoveIt Motion Planning & Digital Twin",
    subtitle: "Gazebo S-Curve Shuffling, RRT-Connect Trajectories & Quaternion Stabilization",
    discipline: "Kinematic Motion Planning, Collision Avoidance & Simulation",
    thesis: "Executing visual servoing without anticipatory collision avoidance risks self-collision and joint singularities. Integrating MoveIt's RRT-Connect planner with live Intera SDK quaternion extraction enables fluid, downward-stabilized Cartesian descents with sub-second trajectory solve times.",
    overview:
      "To safely validate the computer vision pipeline and robot kinematics without hardware wear, a complete digital twin of the Shell Game was constructed in ROS 1 Noetic and Gazebo 11. The bridge between the 2D visual tracking system and the physical Sawyer manipulator is managed through a customized MoveIt motion planning interface.\n\nThe system converts pixel-space coordinates into 3D Cartesian workspace goals, calculating fluid, collision-free trajectories via RRT-Connect and stabilizing the 7-DoF end-effector orientation.",
    description:
      "### Simulation Mechanics & Kinematic Control\n\n" +
      "1. Gazebo Game Controller Node (`shuffle_cups.py`):\n" +
      "   • Directly manipulates 3D meshes (three green cups and an orange ball) within Gazebo via the `/gazebo/set_model_state` service.\n" +
      "   • Hide Animation: Executes a 120-frame choreographed animation sliding the orange ball beneath the target cup.\n" +
      "   • S-Curve Shuffling Dynamics: Trajectory calculations utilize a dynamic S-curve velocity profile $v(t) = \\frac{1.0 - \\cos(progress \\cdot \\pi)}{2.0}$, paired with a radial sine arc offset pushing crossing cups outward by 0.16m to prevent mesh collisions during high-speed swaps.\n\n" +
      "2. Coordinate Transformation Matrix:\n" +
      "   • Maps the $500 \\times 500$ pixel bird's-eye view from the OpenCV feed into a $0.5\\text{m} \\times 0.5\\text{m}$ Cartesian workspace anchored to Sawyer's base coordinate frame origin (e.g. mapping pixel target $(380, 210)$ to $X = 0.55\\text{m}, Y = -0.12\\text{m}$).\n\n" +
      "3. MoveIt Commander & RRT-Connect Path Planning:\n" +
      "   • The original raw joint controller was refactored to utilize the `moveit_commander` API.\n" +
      "   • Path planning is executed by the RRT-Connect (`RRTConnectkConfigDefault`) sampling-based planner within OMPL, generating collision-free trajectories to hover height ($Z = \\text{table\\_z} + 0.04\\text{m}$) in an average computation time of ~1.0 second.\n\n" +
      "4. End-Effector Quaternion Pose Stabilization:\n" +
      "   • To prevent the 7-DoF arm from attempting inefficient wrist rotations during descent, the controller interfaces with the native Intera SDK (`Limb` class) to extract live gripper orientation quaternions and injects them directly into the target `Pose` goal, guaranteeing a stable downward-facing gripper orientation.\n\n" +
      "5. Central State Machine (`SimShellGameNode`):\n" +
      "   • Coordinates state flow: `LOCKED` (ball identified) $\\to$ `TRACKING` (Gazebo shuffle) $\\to$ `REVEALING` (MoveIt hover command).",
    keyMetrics: [
      { label: "Planning Engine", value: "MoveIt 1 / OMPL" },
      { label: "Algorithm", value: "RRT-Connect Planner" },
      { label: "Computation Time", value: "~1.0s Solve Time" },
      { label: "Target Hover Z", value: "table_z + 0.04m" },
    ],
    highlights: [
      "Gazebo digital twin with S-curve velocity profiles and 0.16m radial arc separation mimicking human shuffling.",
      "Affine transformation matrix mapping 2D pixel coordinates (500x500) to 3D Cartesian coordinates (0.5x0.5m).",
      "RRT-Connect bi-directional motion planner generating strictly collision-free trajectories in ~1.0s.",
      "Live Intera SDK quaternion injection stabilizing end-effector downward orientation without joint singularities."
    ],
    codeSnippet:
`# MoveIt Cartesian Transformation & Pose Goal Planning (src/moveit_controller.py)
import rospy, moveit_commander
from geometry_msgs.msg import PoseStamped
from intera_interface import Limb

class SawyerShellGameCommander:
    def __init__(self):
        self.limb = Limb("right")
        self.group = moveit_commander.MoveGroupCommander("right_arm")
        self.group.set_planner_id("RRTConnectkConfigDefault")
        self.group.set_planning_time(2.0)

    def pixel_to_world_coords(self, u: int, v: int) -> tuple[float, float]:
        """Maps 500x500 pixel camera space to 0.5m x 0.5m base coordinate frame."""
        x = 0.35 + (v / 500.0) * 0.40  # Base X translation
        y = -0.25 + (u / 500.0) * 0.50 # Base Y translation
        return x, y

    def execute_hover_over_cup(self, target_u: int, target_v: int, table_z=0.10):
        target_x, target_y = self.pixel_to_world_coords(target_u, target_v)
        current_pose = self.limb.endpoint_pose() # Extract live quaternions

        pose_goal = PoseStamped()
        pose_goal.header.frame_id = "base"
        pose_goal.pose.position.x = target_x
        pose_goal.pose.position.y = target_y
        pose_goal.pose.position.z = table_z + 0.04 # Hover 4cm above cup
        pose_goal.pose.orientation = current_pose['orientation'] # Injected quaternion

        self.group.set_pose_target(pose_goal)
        plan = self.group.plan()
        self.group.execute(plan, wait=True)`
  },

  // =========================================================================================
  // PAGE 05: SYSTEM DEPLOYMENT & RESULTS
  // =========================================================================================
  {
    pageNumber: "05",
    pageLabel: "DEPLOYMENT // BENCHMARKS & WORKSPACE OUTLOOK",
    title: "Deployment Pipeline & Field Results",
    subtitle: "WSL 2 Multi-Node Orchestration, Empirical Results & Reachability Filters",
    discipline: "Robotics DevOps, Kinematic Verification & Human-Robot Collaboration",
    thesis: "Deploying complex robotic pipelines demands disciplined IPC orchestration, robust IP routing, and proactive kinematic feasibility validation. By orchestrating a 5-terminal ROS lifecycle and establishing reachability boundary filters, the system delivers dependable autonomous visual servoing.",
    overview:
      "The entire visual servoing architecture was evaluated across both the interactive Waving Task and the multi-phased Shell Game simulation. Running natively on Windows Subsystem for Linux (WSL 2) on Ubuntu 20.04 Focal Fossa, the multi-node ROS pipeline operates with high determinism and sub-second reaction times.\n\nThis section outlines the 5-terminal deployment runbook, synthesizes empirical performance metrics, and presents future outlook enhancements including edge-accelerated inference and MoveIt Reachability Filters.",
    description:
      "### Multi-Terminal Deployment Runbook (WSL 2)\n\n" +
      "To launch the entire visual servoing pipeline, five synchronized terminal sessions are initialized:\n" +
      "1. Terminal 1 (Gazebo Simulation Environment):\n" +
      "   `roslaunch sawyer_gazebo sawyer_world.launch`\n\n" +
      "2. Terminal 2 (Hardware Action Server):\n" +
      "   `rosparam set /use_sim_time true && rosrun intera_interface joint_trajectory_action_server.py`\n\n" +
      "3. Terminal 3 (MoveIt Motion Planner):\n" +
      "   `roslaunch sawyer_moveit_config sawyer_moveit.launch electric_gripper:=false`\n\n" +
      "4. Terminal 4 (Game Controller Node):\n" +
      "   `python3 src/shuffle_cups.py` (Orchestrates Gazebo hide & S-curve swapping animation)\n\n" +
      "5. Terminal 5 (Master Script & Vision Node):\n" +
      "   Export WSL 2 network IPs (`ROS_IP`, `ROS_MASTER_URI`) to prevent localhost drops, then execute `python3 sim_main.py`.\n\n" +
      "### Summary of Experimental Results\n" +
      "• Waving Task: 100% execution reliability across 5 continuous wave cycles with zero UI latency.\n" +
      "• Perception: HSV Color Filtering achieved 90% tracking success (9/10 trials) outperforming YOLOv8 (60%) due to zero inference latency in dynamic movement.\n" +
      "• MOT Tracker: Augmented Hungarian cost matrix and occlusion tethering reduced Identity Switches to <10%.\n" +
      "• MoveIt Execution: RRT-Connect generated collision-free trajectories in ~1.0s average computation time with 100% downward gripper stabilization.\n\n" +
      "### Future Outlook & Reachability Filters\n" +
      "Future work will implement a **Dynamic Reachability Filter** within the MoveIt interface. Because camera visibility does not strictly guarantee physical reachability within the robot's constrained workspace, this filter proactively calculates workspace bounds and alerts human operators if cups are placed outside the executable zone prior to motion dispatch, preventing Inverse Kinematic (IK) solver failures.",
    keyMetrics: [
      { label: "WSL 2 Runtime", value: "Ubuntu 20.04 LTS" },
      { label: "ROS Terminals", value: "5 Active Sessions" },
      { label: "Waving Reliability", value: "100% (5 Cycles)" },
      { label: "Overall Win Rate", value: "90% (9/10 Trials)" },
    ],
    highlights: [
      "Disciplined 5-terminal ROS deployment sequence on WSL 2 with explicit IP networking configuration.",
      "Empirical demonstration of 90% win rate in rapid shell game trials with sub-second MoveIt trajectory solving.",
      "Python 3 compatibility layer resolving legacy exit code 127 crashes on modern Ubuntu environments.",
      "Proposed MoveIt dynamic reachability filter proactively preventing Inverse Kinematics solver failures."
    ],
    codeSnippet:
`# Terminal 5 Deployment Sequence & Reachability Boundary Filter (sim_main.py)
# 1. WSL 2 Environment & Network Configuration
export ROS_IP=$(hostname -I | awk '{print $1}')
export ROS_HOSTNAME=$ROS_IP
export ROS_MASTER_URI=http://$ROS_IP:11311

# 2. Dynamic Workspace Reachability Filter (src/reachability_filter.py)
def validate_workspace_reachability(target_x: float, target_y: float) -> bool:
    """Pre-validates that target coordinates lie within Sawyer's kinematic envelope."""
    radial_distance = (target_x**2 + target_y**2)**0.5
    X_MIN, X_MAX = 0.30, 0.85 # Sawyer operational reach boundaries (meters)
    Y_MIN, Y_MAX = -0.45, 0.45

    if not (X_MIN <= target_x <= X_MAX and Y_MIN <= target_y <= Y_MAX):
        rospy.logwarn(f"Target ({target_x:.2f}, {target_y:.2f}) outside reachable envelope!")
        return False
    if radial_distance > 0.90:
        rospy.logwarn("Target exceeds maximum arm extension limit (0.90m).")
        return False
    return True`
  }
];

// Map lookup dictionary for easy index access (page01 .. page05)
export const FIGMA_PAGES_DATA: Record<string, FigmaPageContent> = figmaPagesData.reduce(
  (acc, page) => {
    acc[`page${page.pageNumber}`] = page;
    return acc;
  },
  {} as Record<string, FigmaPageContent>
);
