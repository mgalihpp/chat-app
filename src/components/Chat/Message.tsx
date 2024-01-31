import { cn } from "@/lib/utils";

export default function Message({
  isUserMessage = false,
  message,
  time,
}: {
  isUserMessage?: boolean;
  message?: string;
  time?: Date;
}) {
  return (
    <div
      className={cn("p-2 w-max flex flex-col rounded-md max-w-sm lg:max-w-lg", {
        "bg-green-500": isUserMessage,
        "bg-gray-500": !isUserMessage,
      })}
    >
      <div
        className={cn("min-w-0 break-words w-full", {
          "flex justify-end": isUserMessage,
        })}
      >
        <p
          className={cn("text-sm lg:text-base text-semibold", {
            "text-white dark:text-primary": !isUserMessage,
            "text-white": isUserMessage,
          })}
        >
          <span>{message}</span>
        </p>
      </div>
      <div className="flex-shrink-0 self-end">
        <p className="text-muted text-[10px]">
          <span>{time?.toLocaleTimeString()}</span>
        </p>
      </div>
    </div>
  );
}
