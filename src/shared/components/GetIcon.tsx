import {
  ArrowRightLeft,
  AtSign,
  Book,
  DatabaseIcon,
  ExternalLink,
  Globe,
  Image,
  ImageIcon,
  LayoutGrid,
  LockOpen,
  LucideCircleQuestionMark,
  LucideIcon,
  PenLine,
  PlusCircle,
  RefreshCw,
  Send,
  SendHorizonal,
  Settings,
  Shield,
  Upload,
  User2Icon,
} from 'lucide-react-native';

export default function getIconComponent(iconName: string): LucideIcon {
  switch (iconName) {
    case 'User':
      return User2Icon;
    case 'Display':
      return ImageIcon;
    case 'Security':
      return Shield;
    case 'Networks':
      return Globe;
    case 'Help':
      return LucideCircleQuestionMark;
    case 'Image':
      return Image;
    case 'Apps':
      return LayoutGrid;
    case 'Lock':
      return LockOpen;
    case 'Pen':
      return PenLine;
    case 'AtSign':
      return AtSign;
    case 'Plane':
      return SendHorizonal;
    case 'Learn':
      return Book;
    case 'Link':
      return ExternalLink;
    case 'Send':
      return Send;
    case 'Upload':
      return Upload;
    case 'Settings':
      return Settings;
    case 'RefreshCw':
      return RefreshCw;
    case 'DatabaseIcon':
      return DatabaseIcon;
    case 'PlusCircle':
      return PlusCircle;
    case 'ArrowRightLeft':
      return ArrowRightLeft;
    default:
      return User2Icon;
  }
}
