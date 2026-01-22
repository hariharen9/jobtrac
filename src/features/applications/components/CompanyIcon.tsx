import React from 'react';
// Import popular company icons from react-icons - only using confirmed available icons
import { 
  FaGoogle, FaMicrosoft, FaApple, FaAmazon, FaFacebook, FaTwitter, FaLinkedin, 
  FaGithub, FaGitlab, FaBitbucket, FaSlack, FaDiscord, FaTwitch, FaYoutube, 
  FaSpotify, FaUber, FaAirbnb, FaSalesforce, FaAws, FaDigitalOcean, FaDropbox, 
  FaPaypal, FaStripe, FaSquare, FaShopify, FaEtsy, FaWordpress, FaDrupal, FaReact, 
  FaVuejs, FaAngular, FaNode, FaPython, FaJava, FaPhp, FaLaravel, FaSymfony, 
  FaDocker, FaJira, FaTrello, FaSkype, FaAtlassian, FaFigma, FaSketch, FaInvision, 
  FaSass, FaLess, FaNpm, FaYarn, FaBootstrap, FaJenkins, FaCircle, FaBuilding
} from 'react-icons/fa';
import { 
  SiTesla, SiNvidia, SiOpenai, SiAnthropic, SiMeta, SiCoinbase, SiSnapchat, 
  SiTiktok, SiOracle, SiIntel, SiKubernetes, SiAsana, SiNotion, SiZoom, 
  SiAdobe, SiTravisci, SiNetflix, SiAccenture, SiMcdonalds,
  SiSamsung, SiSony, SiWipro, SiInfosys, SiHcl, SiZomato,
  SiPaytm, SiFlipkart, SiSwiggy, SiPhonepe
} from 'react-icons/si';

interface CompanyIconProps {
  companyName: string;
  size?: number;
  className?: string;
}

// Enhanced fuzzy matching function to handle spelling mistakes with better scoring
const fuzzyMatch = (input: string, target: string): { match: boolean; score: number } => {
  const inputClean = input.toLowerCase().replace(/[^a-z0-9]/g, '');
  const targetClean = target.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Exact match - highest score
  if (inputClean === targetClean) return { match: true, score: 1 };
  
  // Check if target is substring of input or vice versa - high score
  if (inputClean.includes(targetClean) || targetClean.includes(inputClean)) {
    const maxLength = Math.max(inputClean.length, targetClean.length);
    const matchLength = Math.min(inputClean.length, targetClean.length);
    return { match: true, score: matchLength / maxLength };
  }
  
  // Calculate Levenshtein distance for typo tolerance
  const distance = levenshteinDistance(inputClean, targetClean);
  const maxLength = Math.max(inputClean.length, targetClean.length);
  
  // Score based on similarity (1 - normalized distance)
  const similarity = 1 - (distance / maxLength);
  
  // Consider a match if similarity is above threshold (0.7 = 70% similar)
  return { match: similarity > 0.7, score: similarity };
};

// Calculate Levenshtein distance between two strings
const levenshteinDistance = (a: string, b: string): number => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  
  const matrix = [];
  
  // Initialize matrix
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  // Fill matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
};

// Custom SVG icons for companies not available in react-icons
const CustomIcons = {
  // Indian Companies
  tcs: (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24">
      <rect width="24" height="24" fill="#FF6B00"/>
      <path d="M12 4L4 12L12 20L20 12L12 4Z" fill="white"/>
      <path d="M12 8L8 12L12 16L16 12L12 8Z" fill="#FF6B00"/>
    </svg>
  ),
  reliance: (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24">
      <rect width="24" height="24" fill="#D1AB66"/>
      <circle cx="12" cy="12" r="8" fill="white"/>
      <circle cx="12" cy="12" r="4" fill="#D1AB66"/>
    </svg>
  ),
  hdfc: (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24">
      <rect width="24" height="24" fill="#004B8D"/>
      <path d="M6 6H18V18H6V6Z" fill="white"/>
      <path d="M10 10H14V14H10V10Z" fill="#004B8D"/>
    </svg>
  ),
  icici: (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24">
      <rect width="24" height="24" fill="#AE282E"/>
      <circle cx="12" cy="12" r="6" fill="white"/>
      <circle cx="12" cy="12" r="3" fill="#AE282E"/>
    </svg>
  ),
  axis: (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24">
      <rect width="24" height="24" fill="#1976D2"/>
      <path d="M6 6H18V18H6V6Z" fill="white"/>
      <path d="M8 8H16V16H8V8Z" fill="#1976D2"/>
    </svg>
  ),
  sbi: (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24">
      <rect width="24" height="24" fill="black"/>
      <circle cx="12" cy="12" r="8" fill="white"/>
      <text x="12" y="16" textAnchor="middle" fill="black" fontSize="10" fontWeight="bold">SBI</text>
    </svg>
  ),
  tata: (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24">
      <rect width="24" height="24" fill="black"/>
      <circle cx="12" cy="12" r="8" fill="white"/>
      <circle cx="12" cy="12" r="4" fill="black"/>
    </svg>
  ),
  bajaj: (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24">
      <rect width="24" height="24" fill="#000000"/>
      <path d="M6 6H18V18H6V6Z" fill="white"/>
      <path d="M8 8H16V16H8V8Z" fill="#000000"/>
    </svg>
  ),
};

import LogoDevImage from './LogoDevImage';

// Mapping of company names to their icons and brand colors
const companyIconMap: Record<string, { 
  icon: React.ComponentType<{ size?: number, className?: string } | React.SVGProps<SVGSVGElement>>, 
  color: string,
  darkColor?: string,
  isCustom?: boolean
}> = {
  // Tech giants
  'google': { icon: FaGoogle, color: '#4285F4', darkColor: '#4285F4' },
  'microsoft': { icon: FaMicrosoft, color: '#0078D4', darkColor: '#0078D4' },
  'apple': { icon: FaApple, color: '#000000', darkColor: '#FFFFFF' },
  'amazon': { icon: FaAmazon, color: '#FF9900', darkColor: '#FF9900' },
  'meta': { icon: SiMeta, color: '#0866FF', darkColor: '#0866FF' },
  'facebook': { icon: FaFacebook, color: '#1877F2', darkColor: '#1877F2' },
  'twitter': { icon: FaTwitter, color: '#1DA1F2', darkColor: '#1DA1F2' },
  'x': { icon: FaTwitter, color: '#000000', darkColor: '#FFFFFF' },
  'linkedin': { icon: FaLinkedin, color: '#0A66C2', darkColor: '#0A66C2' },
  'tesla': { icon: SiTesla, color: '#CC0000', darkColor: '#CC0000' },
  'nvidia': { icon: SiNvidia, color: '#76B900', darkColor: '#76B900' },
  'openai': { icon: SiOpenai, color: '#412991', darkColor: '#412991' },
  'anthropic': { icon: SiAnthropic, color: '#191919', darkColor: '#DFF0F0' },
  
  // Social media & entertainment
  'netflix': { icon: SiNetflix, color: '#E50914', darkColor: '#E50914' },
  'spotify': { icon: FaSpotify, color: '#1DB954', darkColor: '#1DB954' },
  'youtube': { icon: FaYoutube, color: '#FF0000', darkColor: '#FF0000' },
  'twitch': { icon: FaTwitch, color: '#9146FF', darkColor: '#9146FF' },
  'snapchat': { icon: SiSnapchat, color: '#FFFC00', darkColor: '#FFFC00' },
  'tiktok': { icon: SiTiktok, color: '#000000', darkColor: '#FFFFFF' },
  
  // Ride sharing & hospitality
  'uber': { icon: FaUber, color: '#000000', darkColor: '#FFFFFF' },
  'airbnb': { icon: FaAirbnb, color: '#FF5A5F', darkColor: '#FF5A5F' },
  
  // Cloud & enterprise
  'aws': { icon: FaAws, color: '#FF9900', darkColor: '#FF9900' },
  'amazon web services': { icon: FaAws, color: '#FF9900', darkColor: '#FF9900' },
  'salesforce': { icon: FaSalesforce, color: '#00A1E0', darkColor: '#00A1E0' },
  'oracle': { icon: SiOracle, color: '#F80000', darkColor: '#F80000' },
  'intel': { icon: SiIntel, color: '#0071C5', darkColor: '#0071C5' },
  'digitalocean': { icon: FaDigitalOcean, color: '#0080FF', darkColor: '#0080FF' },
  
  // Financial services
  'paypal': { icon: FaPaypal, color: '#003087', darkColor: '#003087' },
  'stripe': { icon: FaStripe, color: '#008CDD', darkColor: '#008CDD' },
  'square': { icon: FaSquare, color: '#3E4348', darkColor: '#3E4348' },
  'coinbase': { icon: SiCoinbase, color: '#0052FF', darkColor: '#0052FF' },
  
  // E-commerce
  'shopify': { icon: FaShopify, color: '#7AB55C', darkColor: '#7AB55C' },
  'etsy': { icon: FaEtsy, color: '#F16521', darkColor: '#F16521' },
  
  // Development tools
  'github': { icon: FaGithub, color: '#181717', darkColor: '#FFFFFF' },
  'gitlab': { icon: FaGitlab, color: '#FC6D26', darkColor: '#FC6D26' },
  'bitbucket': { icon: FaBitbucket, color: '#0052CC', darkColor: '#0052CC' },
  'slack': { icon: FaSlack, color: '#4A154B', darkColor: '#4A154B' },
  'discord': { icon: FaDiscord, color: '#5865F2', darkColor: '#5865F2' },
  'docker': { icon: FaDocker, color: '#2496ED', darkColor: '#2496ED' },
  'kubernetes': { icon: SiKubernetes, color: '#326CE5', darkColor: '#326CE5' },
  'npm': { icon: FaNpm, color: '#CB3837', darkColor: '#CB3837' },
  'yarn': { icon: FaYarn, color: '#2C8EBB', darkColor: '#2C8EBB' },
  'jenkins': { icon: FaJenkins, color: '#D24939', darkColor: '#D24939' },
  'travis': { icon: SiTravisci, color: '#3EAAAF', darkColor: '#3EAAAF' },
  'travisci': { icon: SiTravisci, color: '#3EAAAF', darkColor: '#3EAAAF' },
  
  // Project management
  'jira': { icon: FaJira, color: '#0052CC', darkColor: '#0052CC' },
  'trello': { icon: FaTrello, color: '#0052CC', darkColor: '#0052CC' },
  'asana': { icon: SiAsana, color: '#F06A6A', darkColor: '#F06A6A' },
  'notion': { icon: SiNotion, color: '#000000', darkColor: '#FFFFFF' },
  
  // Communication
  'zoom': { icon: SiZoom, color: '#2D8CFF', darkColor: '#2D8CFF' },
  'skype': { icon: FaSkype, color: '#0078D7', darkColor: '#0078D7' },
  
  // Design & creative
  'adobe': { icon: SiAdobe, color: '#FF0000', darkColor: '#FF0000' },
  'figma': { icon: FaFigma, color: '#F24E1E', darkColor: '#F24E1E' },
  'sketch': { icon: FaSketch, color: '#F7B500', darkColor: '#F7B500' },
  'invision': { icon: FaInvision, color: '#FF3366', darkColor: '#FF3366' },
  
  // Web technologies
  'react': { icon: FaReact, color: '#61DAFB', darkColor: '#61DAFB' },
  'vue': { icon: FaVuejs, color: '#4FC08D', darkColor: '#4FC08D' },
  'vue.js': { icon: FaVuejs, color: '#4FC08D', darkColor: '#4FC08D' },
  'angular': { icon: FaAngular, color: '#DD0031', darkColor: '#DD0031' },
  'node': { icon: FaNode, color: '#339933', darkColor: '#339933' },
  'node.js': { icon: FaNode, color: '#339933', darkColor: '#339933' },
  'python': { icon: FaPython, color: '#3776AB', darkColor: '#3776AB' },
  'java': { icon: FaJava, color: '#007396', darkColor: '#007396' },
  'php': { icon: FaPhp, color: '#777BB4', darkColor: '#777BB4' },
  'laravel': { icon: FaLaravel, color: '#FF2D20', darkColor: '#FF2D20' },
  'symfony': { icon: FaSymfony, color: '#000000', darkColor: '#FFFFFF' },
  'wordpress': { icon: FaWordpress, color: '#21759B', darkColor: '#21759B' },
  'drupal': { icon: FaDrupal, color: '#0678BE', darkColor: '#0678BE' },
  'sass': { icon: FaSass, color: '#CC6699', darkColor: '#CC6699' },
  'less': { icon: FaLess, color: '#1D365D', darkColor: '#1D365D' },
  'bootstrap': { icon: FaBootstrap, color: '#7952B3', darkColor: '#7952B3' },
  
  // Consulting & Services
  'accenture': { icon: SiAccenture, color: '#A100FF', darkColor: '#A100FF' },
  'mcdonalds': { icon: SiMcdonalds, color: '#FFBC0D', darkColor: '#FFBC0D' },
  'samsung': { icon: SiSamsung, color: '#1428A0', darkColor: '#1428A0' },
  'sony': { icon: SiSony, color: '#FFFFFF', darkColor: '#000000' },
  
  // Indian Companies with custom icons
  'tcs': { icon: CustomIcons.tcs, color: '#FF6B00', darkColor: '#FF6B00', isCustom: true },
  'tata consultancy services': { icon: CustomIcons.tcs, color: '#FF6B00', darkColor: '#FF6B00', isCustom: true },
  'infosys': { icon: SiInfosys, color: '#007CC3', darkColor: '#007CC3' },
  'wipro': { icon: SiWipro, color: '#341C53', darkColor: '#341C53' },
  'hcl': { icon: SiHcl, color: '#000000', darkColor: '#FFFFFF' },
  'hcl technologies': { icon: SiHcl, color: '#000000', darkColor: '#FFFFFF' },
  'zomato': { icon: SiZomato, color: '#FF5722', darkColor: '#FF5722' },
  'paytm': { icon: SiPaytm, color: '#1F2B9D', darkColor: '#1F2B9D' },
  'swiggy': { icon: SiSwiggy, color: '#FC8019', darkColor: '#FC8019' },
  'phonepe': { icon: SiPhonepe, color: '#5F259F', darkColor: '#5F259F' },
  'flipkart': { icon: SiFlipkart, color: '#2874F0', darkColor: '#2874F0' },
  'reliance': { icon: CustomIcons.reliance, color: '#D1AB66', darkColor: '#D1AB66', isCustom: true },
  'reliance industries': { icon: CustomIcons.reliance, color: '#D1AB66', darkColor: '#D1AB66', isCustom: true },
  'hdfc': { icon: CustomIcons.hdfc, color: '#004B8D', darkColor: '#004B8D', isCustom: true },
  'hdfc bank': { icon: CustomIcons.hdfc, color: '#004B8D', darkColor: '#004B8D', isCustom: true },
  'icici': { icon: CustomIcons.icici, color: '#AE282E', darkColor: '#AE282E', isCustom: true },
  'icici bank': { icon: CustomIcons.icici, color: '#AE282E', darkColor: '#AE282E', isCustom: true },
  'axis': { icon: CustomIcons.axis, color: '#1976D2', darkColor: '#1976D2', isCustom: true },
  'axis bank': { icon: CustomIcons.axis, color: '#1976D2', darkColor: '#1976D2', isCustom: true },
  'sbi': { icon: CustomIcons.sbi, color: '#000000', darkColor: '#FFFFFF', isCustom: true },
  'state bank of india': { icon: CustomIcons.sbi, color: '#000000', darkColor: '#FFFFFF', isCustom: true },
  'tata': { icon: CustomIcons.tata, color: '#000000', darkColor: '#FFFFFF', isCustom: true },
  'bajaj': { icon: CustomIcons.bajaj, color: '#000000', darkColor: '#FFFFFF', isCustom: true },
  
  // Other companies
  'atlassian': { icon: FaAtlassian, color: '#0052CC', darkColor: '#0052CC' },
  'dropbox': { icon: FaDropbox, color: '#0061FF', darkColor: '#0061FF' },
};

const CompanyIcon: React.FC<CompanyIconProps> = ({ 
  companyName, 
  size = 24, 
  className = '' 
}) => {
  // Normalize company name to lowercase for matching
  const normalizedCompanyName = companyName.toLowerCase().trim();
  
  // Try to find an exact match first
  const companyData = companyIconMap[normalizedCompanyName];
  
  // If no exact match, try fuzzy matching for spelling mistakes
  if (!companyData) {
    let bestMatch: { key: string; score: number } | null = null;
    
    // Find the best fuzzy match
    Object.keys(companyIconMap).forEach(key => {
      const { match, score } = fuzzyMatch(normalizedCompanyName, key);
      if (match && (!bestMatch || score > bestMatch.score)) {
        bestMatch = { key, score };
      }
    });
    
    if (bestMatch) {
      const fuzzyCompanyData = companyIconMap[bestMatch.key];
      const IconComponent = fuzzyCompanyData.icon;
      
      // Handle custom SVG icons
      if (fuzzyCompanyData.isCustom) {
        return (
          <span 
            style={{ color: fuzzyCompanyData.color, display: 'inline-block' }} 
            className={className}
          >
            <IconComponent width={size} height={size} />
          </span>
        );
      }
      
      // Apply color through inline styles by wrapping in a span
      return (
        <span style={{ color: fuzzyCompanyData.color }} className={className}>
          <IconComponent size={size} />
        </span>
      );
    }
  }
  
  // Return the specific icon with color if found, otherwise return a generic building icon
  if (companyData) {
    const { icon: IconComponent, color, isCustom } = companyData;
    
    // Handle custom SVG icons
    if (isCustom) {
      return (
        <span 
          style={{ color: color, display: 'inline-block' }} 
          className={className}
        >
          <IconComponent width={size} height={size} />
        </span>
      );
    }
    
    // Apply color through inline styles by wrapping in a span
    return (
      <span style={{ color: color }} className={className}>
        <IconComponent size={size} />
      </span>
    );
  }
  
  // Default to LogoDevImage which will fallback to FaBuilding if image load fails
  return <LogoDevImage companyName={companyName} size={size} className={className} />;
};

export default CompanyIcon;