import { Calendar, Crown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileHeaderProps {
  name: string;
  email: string;
  image?: string;
  role: string;
  joinDate: number;
  isPremium?: boolean; // New Prop
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
    <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
      <div className="relative">
        <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
          <AvatarImage src={image} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        {/* Render a Crown if Premium */}
        {isPremium && (
          <div className="absolute -top-2 -right-2 bg-yellow-500 text-white p-2 rounded-full shadow-lg border-2 border-background" title="Premium Member">
            <Crown className="w-5 h-5 fill-current" />
          </div>
        )}
      </div>

      <div className="text-center md:text-left space-y-2">
        <div className="flex items-center gap-3 justify-center md:justify-start">
          <h1 className="text-4xl font-display font-bold text-foreground">
            {name}
          </h1>
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
            {role}
          </span>
          {isPremium && (
            <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-600 text-sm font-bold border border-yellow-500/20 flex items-center gap-1">
              PRO
            </span>
          )}
        </div>

        <p className="text-muted-foreground text-lg">{email}</p>
        
        <div className="flex items-center gap-2 text-muted-foreground text-sm justify-center md:justify-start">
          <Calendar className="w-4 h-4" />
          <span>Joined {new Date(joinDate).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
