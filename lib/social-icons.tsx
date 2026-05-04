import {
  BriefcaseBusiness,
  Camera,
  CirclePlay,
  Code2,
  Globe2,
  Mail,
  MessageCircle,
  MessagesSquare,
  Music2,
  Send,
} from "lucide-react";

const socialIconMap = {
  "briefcase-business": BriefcaseBusiness,
  camera: Camera,
  "circle-play": CirclePlay,
  "code-2": Code2,
  discord: MessagesSquare,
  email: Mail,
  envelope: Mail,
  facebook: MessagesSquare,
  github: Code2,
  globe: Globe2,
  "globe-2": Globe2,
  instagram: Camera,
  linkedin: BriefcaseBusiness,
  mail: Mail,
  "message-circle": MessageCircle,
  "messages-square": MessagesSquare,
  "music-2": Music2,
  tiktok: Music2,
  telegram: Send,
  twitter: Send,
  "twitter-x": Send,
  whatsapp: MessageCircle,
  youtube: CirclePlay,
} as const;

export function getSocialIconComponent(iconName?: string | null, platform?: string | null) {
  const normalizedIcon = iconName?.toLowerCase().trim();
  const normalizedPlatform = platform?.toLowerCase().trim();

  if (normalizedIcon && normalizedIcon in socialIconMap) {
    return socialIconMap[normalizedIcon as keyof typeof socialIconMap];
  }

  if (normalizedPlatform && normalizedPlatform in socialIconMap) {
    return socialIconMap[normalizedPlatform as keyof typeof socialIconMap];
  }

  return Globe2;
}

export function SocialIcon({
  iconName,
  platform,
  className = "h-5 w-5",
  strokeWidth = 1.8,
}: {
  iconName?: string | null;
  platform?: string | null;
  className?: string;
  strokeWidth?: number;
}) {
  const Icon = getSocialIconComponent(iconName, platform);

  return <Icon className={className} strokeWidth={strokeWidth} />;
}

export const predefinedSocials = [
  { id: "whatsapp", label: "WhatsApp", icon: "message-circle" },
  { id: "instagram", label: "Instagram", icon: "camera" },
  { id: "facebook", label: "Facebook", icon: "messages-square" },
  { id: "twitter", label: "X / Twitter", icon: "send" },
  { id: "youtube", label: "YouTube", icon: "circle-play" },
  { id: "tiktok", label: "TikTok", icon: "music-2" },
  { id: "linkedin", label: "LinkedIn", icon: "briefcase-business" },
  { id: "github", label: "GitHub", icon: "code-2" },
  { id: "telegram", label: "Telegram", icon: "send" },
  { id: "discord", label: "Discord", icon: "messages-square" },
  { id: "email", label: "Email", icon: "mail" },
] as const;
