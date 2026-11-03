/*
  PROJECT DATA: the only file you edit to add or update work.
  ------------------------------------------------------------
  The page reads this file and builds the cards itself, so you never touch
  the HTML or CSS to add a project.

  To add a project: copy one { ... } block inside `projects`, paste it at the
  top of the list (newest first), change the text, save, commit, push.

  Fields:
    id        short name, no spaces. Used for links like  #project-isaac-kuka
    title     project name
    context   where / for whom it was done
    period    dates as text, e.g. "02/2020 – 03/2020" or "2026 – present"
    status    "in-progress" or "done"
    progress  optional short note shown next to the status, e.g. "Step 3 of 9"
    summary   the problem and the idea, in 1–2 sentences
    did       "My part": list of things YOU did (each one must be defendable in an interview).
              An item can be plain text, or { label: "Design", text: "..." } for a bold lead-in.
    didTitle  optional heading for `did` on team projects, e.g. "What the team built"
    result    one line: the outcome so far (a number if you have one)
    next      optional list of planned steps (only for in-progress work)
    tools     list of tools and methods
    images    list of { src, alt, caption, fit }  (put image files in assets/img/)
              fit: "contain" shows the whole image on the card (good for CAD renders)
    links     list of { label, url }
    note      optional grey note, e.g. confidentiality
    tagline   one short line shown on the card
    highlight optional big text shown on the card when there is no image,
              e.g. a key result like "−17 s per engine"

  Rule: if it isn't true, it doesn't go in.
*/

window.SITE_DATA = {
  projects: [
    {
      id: "so101-arm",
      title: "SO-101 robot arm: build, commissioning and pick-and-place",
      context: "Personal project · open-source SO-101 design (LeRobot)",
      period: "10/2026",
      status: "done",
      progress: "Working pick-and-place",
      tagline: "6-DOF arm · hardware integration · teach-in · Python",
      summary:
        "The SO-101 is an open-source 6-DOF arm built for robot-learning research. I printed and assembled the follower arm, commissioned it with Hugging Face's LeRobot framework, and programmed a pick-and-place task from taught waypoints with interpolated motion.",
      did: [
        { label: "Build and hardware integration", text: "Printed the structural parts myself on my Creality Ender 3 S1 in PLA and PETG, assembled the six Feetech STS3215 serial bus servo actuators, set the motor IDs (1 to 6, base to gripper), and routed the cabling with the driver board at the base so the bus cable does not travel with the arm." },
        { label: "Commissioning and calibration", text: "Brought the arm up on Windows over the serial bus and calibrated all six joints with LeRobot, including joint zero positions and encoder ranges (4096 ticks per revolution)." },
        { label: "Motion programming", text: "Taught the pick-and-place positions by reading joint positions with my own Python script, stored them as waypoints, and interpolated between them for smooth motion. The arm moves from upright to home, picks up a screwdriver and returns." },
        { label: "Troubleshooting and root-cause analysis", text: "Traced a motor timeout to a loose connector between servos 2 and 3; found that wrist flex stops at about 2300 of 4096 ticks because of the printed geometry, not the software; added a keep-alive loop after finding that the arm lost holding torque whenever a script ended." },
        { label: "Documentation", text: "Documented the build, calibration, scripts and every fault I fixed in the GitHub README, together with the print files and a demo video." }
      ],
      result: "A commissioned 6-DOF arm performing pick-and-place of a screwdriver from taught waypoints, shown in the demo video.",
      next: [
        "Wiring diagram",
        "Teleoperation with a leader arm",
        "ROS 2 integration"
      ],
      tools: ["Python 3.12", "LeRobot v0.6.2", "Feetech STS3215 servos", "Serial bus", "Hardware integration", "Commissioning", "Joint calibration", "Teach-in / waypoints", "Trajectory interpolation", "Root-cause analysis", "FDM 3D printing (PLA, PETG)", "Git"],
      images: [
        {
          src: "assets/img/so101-arm.jpg",
          alt: "White 3D-printed SO-101 robot arm on a desk, gripper angled down towards the table",
          caption: "The arm I printed and built, approaching the pick position."
        }
      ],
      links: [
        { label: "Demo video on YouTube", url: "https://youtu.be/baFJPxRAoQY" },
        { label: "Code, print files and build notes on GitHub", url: "https://github.com/aravindajithkumar02/so101-follower-arm" }
      ]
    },

    {
      id: "isaac-kuka",
      title: "KUKA KR210 palletizing cell in NVIDIA Isaac Sim",
      context: "Personal project",
      tagline: "Standalone Python · Isaac Sim 6.1",
      period: "2026 – present",
      status: "in-progress",
      progress: "Cell built · motion control next",
      summary:
        "Industrial robot cells are planned in simulation before any hardware moves. I'm building a palletizing cell in NVIDIA Isaac Sim, scripted in standalone Python: a KUKA KR210 that will pick boxes from an infeed table and stack them on a Euro pallet.",
      did: [
        "Scripted the simulation start-up and loaded the KR210, confirming its six joints (A1 to A6).",
        "Laid out an L-shaped cell inside the robot's reach: pick table at 0.8 m working height, Euro pallet (1200 × 800 mm), floor and lighting.",
        "Applied the robot's material in code, because the bundled asset ships without one.",
        "Used Isaac Sim 6.1's new isaacsim.core.experimental API, since the classic Core API is deprecated."
      ],
      next: [
        "End-effector motion control (cuMotion / RMPflow)",
        "Vacuum gripper and single-box pick-and-place",
        "Pallet pattern generator and palletizing state machine",
        "Validation runs with measured results"
      ],
      result: "A to-scale palletizing cell scripted entirely in standalone Python: robot loaded and verified, table, pallet, floor and lighting in place. Each stage is a separate, runnable script on GitHub.",
      tools: ["NVIDIA Isaac Sim 6.1", "Python", "USD", "PhysX", "Git", "Linux"],
      images: [
        {
          src: "assets/img/isaac-step3-cell.jpg",
          alt: "Orange KUKA KR210 robot in Isaac Sim next to a pick table and a pallet on a grid floor",
          caption: "Cell layout at step 3: robot, pick table and Euro pallet."
        }
      ],
      links: [
        { label: "Code and progress on GitHub", url: "https://github.com/aravindajithkumar02/isaac-kuka-palletizing" }
      ]
    },

    {
      id: "winding-tool",
      title: "PID-controlled lightweight winding tool for a UR10 robot",
      context: "Project thesis, FAPS Institute, FAU Erlangen-Nürnberg",
      tagline: "Tension control · CAD · 3D printing",
      period: "04/2026 – present",
      status: "in-progress",
      progress: "Electronics integration",
      summary:
        "Winding tape onto a curved coil with a robot only works if the tape tension stays constant while the robot's speed keeps changing. I'm developing a lightweight tool for a UR10 robot that feeds the tape and controls its tension.",
      did: [
        "Designed the tool in Fusion 360 and SolidWorks and produced its parts by FDM 3D printing.",
        "Chose the tension sensing: a spring-loaded dancer roller read by a time-of-flight sensor. The spring keeps the reading independent of tool orientation; a potentiometer was rejected because its contact friction disturbs the measurement.",
        "Selected the drive and control hardware: stepper motor, driver and ESP32 microcontroller.",
        "Designing a PID-based tension controller with feedforward from the robot speed, and writing the firmware in C++."
      ],
      next: [
        "Controller tuning on the test setup",
        "Validation on the UR10 robot"
      ],
      highlight: "Images after clearance",
      result: "Tool designed and printed, components selected and delivered. Electronics integration is under way; controller tuning and tests on the robot follow.",
      tools: ["Fusion 360", "SolidWorks", "FDM 3D printing", "ESP32", "C++", "PID control", "LaTeX"],
      images: [],
      links: [],
      note: "University project. Further details and images will follow once cleared with my supervisor."
    },

    {
      id: "toyota-kaizen",
      title: "Kaizen design for cycle-time reduction",
      context: "Engineering internship, Toyota Industries Engine India, Bengaluru",
      tagline: "−17 s per engine · three kaizens · SolidWorks",
      period: "02/2020 – 03/2020",
      status: "done",
      progress: "Implemented on the line",
      highlight: "−17 s per engine",
      summary:
        "On an engine assembly line, every second of cycle time is multiplied by every engine built. I observed assembly stations with standardized work sheets, found waiting and unnecessary motion, and designed mechanical fixes for them.",
      did: [
        { label: "Head pallet chuter", text: "The operator had to press the chuter down by hand for several seconds until the next head pallet aligned. I designed a spring-loaded automated clamping lock that holds it, removing both the push and the wait. Saves 6–8 s of a 10 s step." },
        { label: "QR reader", text: "I redesigned the reader body with an integrated marker holder, so the operator picks up one tool instead of two. Saves 2–3 s." },
        { label: "Head guide", text: "Co-designed with a fellow intern: a two-stage auto-lock that stops cylinder heads from queuing between lines." }
      ],
      result: "Implemented on the line. Together the three kaizens cut cycle time by 17 s per engine, which the plant estimated at about 20 additional engines per shift.",
      tools: ["SolidWorks", "Standardized work", "Muda analysis", "Kaizen", "Toyota Production System"],
      images: [
        {
          src: "assets/img/toyota-head-pallet-chuter.jpg",
          fit: "contain",
          alt: "CAD model of the head pallet chuter: an inclined frame with rollers and clamping lock mechanisms at the lower end",
          caption: "Head pallet chuter with the automated clamping lock mechanisms (my CAD model)."
        }
      ],
      links: []
    },
    {
      id: "aqua-filter",
      title: "Aqua-header tank circulator-filter",
      context: "Project with my professor · co-inventor, team of six",
      period: "2019",
      status: "done",
      progress: "Working prototype · patent application",
      tagline: "Biological filter that also oxygenates and circulates",
      summary:
        "Most aquarium filters clean the water but add little oxygen. This one does both: a pump lifts water into a perforated PVC header, and the water falls back like rain, picking up oxygen from the air on the way down.",
      did: [
        "Came up with the rain-header concept in response to my professor's brief to raise dissolved oxygen.",
        "Gave the holes different sizes, larger towards the ends, so more water falls there and the whole tank keeps circulating.",
        "Built the working prototype at home and tested it in a pond I made from a tarpaulin sheet.",
        "Co-inventor on Indian patent application 201941015063 (2019)."
      ],
      result: "A working prototype and a published patent application.",
      tools: ["Concept design", "CAD", "PVC prototyping", "Testing"],
      images: [
        {
          src: "assets/img/aqua-prototype.jpg",
          alt: "Working prototype: a white PVC header pipe with a submersible pump, water drizzling from holes into a blue test pond",
          caption: "My prototype running in the tarpaulin test pond I built."
        },
        {
          src: "assets/img/aqua-cad-tank.jpg",
          alt: "CAD drawing of the header pipe mounted above an aquarium, with the submersible pump at the bottom",
          caption: "CAD layout: header above the water, pump at the bottom of the tank."
        },
        {
          src: "assets/img/aqua-cad-header.jpg",
          alt: "CAD model of the T-shaped header pipe with holes increasing in size towards the ends",
          caption: "Header with holes increasing in size towards the ends."
        }
      ],
      links: [],
      note: "Patent status: application filed and published. Grant status being confirmed."
    }
  ],

  /* Older or smaller work: shown as short text entries without images. */
  earlierWork: [
    {
      id: "led-tube",
      title: "Repairable LED tube light",
      context: "Personal project · solo · working prototype",
      period: "2017",
      summary:
        "When a few LEDs in a conventional tube light fail, the whole tube is usually thrown away. I built a tube light in which each LED plugs into its own socket in the base, so a failed LED can be pulled out and replaced while the rest keeps working. I designed the socket mechanism and wired the LEDs to a power circuit I built myself."
    }
  ],

  /* 3D-printing gallery. The section stays hidden while this list is empty.
     Example entry:
     { src: "assets/img/print-bracket.jpg", alt: "...", title: "Sensor bracket",
       note: "Designed and printed · PETG · heat-set inserts" }            */
  gallery: [
    {
      src: "assets/img/print-prusa-xl.jpg",
      alt: "Prusa XL 3D printer with a five-head tool changer, laying down the first layer of a print",
      title: "Prusa XL with five-tool changer",
      note: "First layer of a print · FAPS institute lab"
    }
  ]
};
