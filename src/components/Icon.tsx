import type { LucideProps } from 'lucide-react';
import {
  Accessibility, Armchair, ArrowRight, ArrowUpRight, Award, BadgeCheck, BedDouble, Bell, BookOpen, Briefcase, BriefcaseBusiness,
  Building, Bus, Calendar, CalendarCheck, CalendarDays, ChartColumn, Check, ChevronDown, ChevronRight, Circle, CircleCheck,
  CircleQuestionMark, ClipboardCheck, ClipboardList, Clock, Cpu, Download, ExternalLink, Eye, Factory, FileText, Flower2,
  Gem, GraduationCap, HandCoins, Handshake, HardHat, Heart, HeartPulse, House, IdCard, Images, IndianRupee, Inbox, Info,
  Keyboard, Landmark, Languages, Laptop, Library, Lightbulb, Link, ListChecks, LogIn, Mail, MapPin, Medal, Megaphone,
  MessageSquare, Monitor, Drama, Navigation, Network, PencilRuler, Phone, Projector, QrCode, Quote, Rocket, Scale, School,
  Scissors, ScanLine, Search, Send, Shield, ShieldCheck, Shirt, Siren, Smartphone, Sparkle, Sparkles, Sprout, Star, Target,
  Timer, TrainFront, Trophy, User, UserRound, Users, UsersRound, Wallet, Wifi, Wrench, Zap,
} from 'lucide-react';

const icons = {
  Accessibility, Armchair, ArrowRight, ArrowUpRight, Award, BadgeCheck, BedDouble, Bell, BookOpen, Briefcase, BriefcaseBusiness,
  Building, Bus, Calendar, CalendarCheck, CalendarDays, ChartColumn, Check, ChevronDown, ChevronRight, Circle, CircleCheck,
  CircleQuestionMark, ClipboardCheck, ClipboardList, Clock, Cpu, Download, ExternalLink, Eye, Factory, FileText, Flower2,
  Gem, GraduationCap, HandCoins, Handshake, HardHat, Heart, HeartPulse, House, IdCard, Images, IndianRupee, Inbox, Info,
  Keyboard, Landmark, Languages, Laptop, Library, Lightbulb, Link, ListChecks, LogIn, Mail, MapPin, Medal, Megaphone,
  MessageSquare, Monitor, Drama, Navigation, Network, PencilRuler, Phone, Projector, QrCode, Quote, Rocket, Scale, School,
  Scissors, ScanLine, Search, Send, Shield, ShieldCheck, Shirt, Siren, Smartphone, Sparkle, Sparkles, Sprout, Star, Target,
  Timer, TrainFront, Trophy, User, UserRound, Users, UsersRound, Wallet, Wifi, Wrench, Zap,
} as const;

export type IconName = keyof typeof icons;

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Cmp = icons[name as IconName] ?? Circle;
  return <Cmp aria-hidden="true" focusable="false" {...props} />;
}
