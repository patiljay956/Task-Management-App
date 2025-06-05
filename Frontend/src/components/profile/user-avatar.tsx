import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

type Props = {
    user: {
        name: string;
        image: string;
        email: string;
    };
};

export default function UserAvatar({ user }: Props) {
    return (
        <>
            <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage
                    src={user.image}
                    alt="https://github.com/shadcn.png"
                />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                </span>
            </div>
        </>
    );
}
