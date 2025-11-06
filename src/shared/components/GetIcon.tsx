import { User2Icon, ImageIcon, Shield, Globe, LucideCircleQuestionMark } from 'lucide-react-native';
import { Send, Upload, Settings, RefreshCw, DatabaseIcon, PlusCircle, ArrowRightLeft } from 'lucide-react-native';


export default function getIconComponent (iconName: string){
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
};