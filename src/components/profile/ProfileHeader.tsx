import { Calendar, Crown, Mail, ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileHeaderProps {
  name: string;
  email: string;
  image?: string;
  role: string;
  joinDate: number;
  isPremium?: boolean;
}

export default function ProfileHeader({
  name,
  email,
  image,
  role,
  joinDate,
  isPremium = false,
}: ProfileHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-8 mb-12 bg-[#0b1021] border border-slate-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
      
      {/* Background Decor: Only visible for Premium users */}
      {isPremium && (
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-[80px] -z-0 pointer-events-none" />
      )}

      {/* --- AVATAR SECTION --- */}
      <div className="relative z-10">
        {/* Glow behind avatar */}
        <div className={`absolute -inset-1 rounded-full blur opacity-40 ${isPremium ? 'bg-gradient-to-r from-amber-400 to-yellow-600' : 'bg-gradient-to-r from-blue-600 to-purple-600'}`} />
        
        <Avatar className="w-32 h-32 border-4 border-[#0b1021] shadow-2xl relative">
          <AvatarImage src={image} className="object-cover" />
          <AvatarFallback className="bg-slate-800 text-slate-400 text-3xl font-bold">
            {name.charAt(0)}
          </AvatarFallback>
        </Avatar>

        {/* Render a Crown if Premium */}
        {isPremium && (
          <div className="absolute -top-3 -right-3 bg-gradient-to-br from-amber-300 to-yellow-600 text-white p-2.5 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.4)] border-4 border-[#0b1021] z-20" title="Premium Member">
            <Crown className="w-5 h-5 fill-white" />
          </div>
        )}
      </div>

      {/* --- INFO SECTION --- */}
      <div className="text-center md:text-left space-y-3 flex-1 relative z-10">
        
        {/* Name & Badges Row */}
        <div className="flex flex-col md:flex-row items-center gap-3 justify-center md:justify-start">
          <h1 className="text-4xl font-bold text-white tracking-tight">
            {name}
          </h1>
          
          <div className="flex items-center gap-2 mt-2 md:mt-0">
            {/* Role Badge */}
            <span className="px-3 py-1 rounded-full bg-slate-800/50 text-slate-300 text-xs font-bold border border-slate-700 uppercase tracking-wider">
              {role}
            </span>

            {/* Premium Badge */}
            {isPremium && (
              <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-xs font-bold border border-yellow-500/20 flex items-center gap-1.5 shadow-[0_0_10px_rgba(234,179,8,0.1)] uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3" />
                PRO
              </span>
            )}
          </div>
        </div>

        {/* Contact / Meta Data */}
        <div className="flex flex-col md:flex-row items-center gap-4 text-slate-400 text-sm mt-2">
            <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800/50">
                <Mail className="w-3.5 h-3.5 text-blue-500" />
                <span>{email}</span>
            </div>
            
            <div className="hidden md:block w-1 h-1 rounded-full bg-slate-700" />

            <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800/50">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                <span>Joined {new Date(joinDate).toLocaleDateString()}</span>
            </div>
        </div>
      </div>
    </div>
  );
}