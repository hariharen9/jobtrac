import { Variants } from 'framer-motion';

// Enhanced animation variants
export const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: { duration: 0.2 }
  }
};

export const fadeInDown: Variants = {
  hidden: { 
    opacity: 0, 
    y: -20,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

export const slideInLeft: Variants = {
  hidden: { 
    opacity: 0, 
    x: -30,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    x: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

export const slideInRight: Variants = {
  hidden: { 
    opacity: 0, 
    x: 30,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    x: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

export const scaleIn: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    rotate: -5
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.5,
      ease: [0.34, 1.56, 0.64, 1]
    }
  }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const staggerItem: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.9
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

// Button animation variants
export const buttonHover = {
  scale: 1.02,
  y: -2,
  transition: {
    duration: 0.2,
    ease: [0.25, 0.46, 0.45, 0.94]
  }
};

export const buttonTap = {
  scale: 0.98,
  y: 0,
  transition: {
    duration: 0.1,
    ease: [0.25, 0.46, 0.45, 0.94]
  }
};

export const buttonPress = {
  scale: 0.95,
  transition: {
    duration: 0.05,
    ease: "easeOut"
  }
};

// Form field animations
export const fieldFocus = {
  scale: 1.02,
  borderColor: "rgb(99 102 241)",
  boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)",
  transition: {
    duration: 0.2,
    ease: [0.25, 0.46, 0.45, 0.94]
  }
};

export const fieldBlur = {
  scale: 1,
  borderColor: "rgb(203 213 225)",
  boxShadow: "0 0 0 0px rgba(99, 102, 241, 0)",
  transition: {
    duration: 0.2,
    ease: [0.25, 0.46, 0.45, 0.94]
  }
};

// Card animations
export const cardHover = {
  y: -8,
  scale: 1.02,
  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  transition: {
    duration: 0.3,
    ease: [0.25, 0.46, 0.45, 0.94]
  }
};

export const cardTap = {
  scale: 0.98,
  transition: {
    duration: 0.1,
    ease: "easeOut"
  }
};

// Loading animations
export const pulseAnimation = {
  scale: [1, 1.05, 1],
  opacity: [0.7, 1, 0.7],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

export const spinAnimation = {
  rotate: 360,
  transition: {
    duration: 1,
    repeat: Infinity,
    ease: "linear"
  }
};

// Success/Error animations
export const successPulse = {
  scale: [1, 1.2, 1],
  transition: {
    duration: 0.6,
    ease: [0.34, 1.56, 0.64, 1]
  }
};

export const errorShake = {
  x: [0, -10, 10, -10, 10, 0],
  transition: {
    duration: 0.5,
    ease: "easeInOut"
  }
};

// Modal animations
export const modalBackdrop: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

export const modalContent: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    y: 50
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.34, 1.56, 0.64, 1]
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    y: 50,
    transition: { duration: 0.2 }
  }
};

// Navigation animations
export const tabIndicator = {
  layoutId: "activeTab",
  transition: {
    type: "spring",
    stiffness: 500,
    damping: 30
  }
};

// Utility functions
export const getRandomDelay = (max: number = 0.5) => Math.random() * max;

export const createStaggeredAnimation = (itemCount: number, staggerDelay: number = 0.1) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: 0.1,
      when: "beforeChildren"
    }
  }
});

// Easing functions
export const easings = {
  easeOutCubic: [0.33, 1, 0.68, 1],
  easeInOutCubic: [0.65, 0, 0.35, 1],
  easeOutQuart: [0.25, 1, 0.5, 1],
  easeInOutQuart: [0.76, 0, 0.24, 1],
  easeOutBack: [0.34, 1.56, 0.64, 1],
  easeInOutBack: [0.68, -0.6, 0.32, 1.6]
} as const;