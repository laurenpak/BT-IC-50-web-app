import SchedulePage from "@/components/pages/SchedulePage";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

interface UserMetadata {
  fullName: string;
}

interface User {
  id: string;
  user_metadata: UserMetadata;
}

interface ScheduleEntry {
  day: string;
  time: string;
  title: string;
}

interface ScheduleDay {
  day: string;
  events: { time: string; title: string }[];
}

export default async function Home() {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    redirect("/login");
  }

  const user: User = userData.user;

  console.log(userData, "User Data");

  const { data: scheduleData, error: scheduleError } = await supabase
    .from<ScheduleEntry>("schedules")
    .select("*")
    .eq("user_id", user.id);

  if (scheduleError) {
    console.error(scheduleError);
    // Handle the error as appropriate, e.g., redirect or display a message
  }

  console.log(scheduleData, "Schedule Data");

  const scheduleDataUpdated: ScheduleDay[] = scheduleData?.reduce(
    (acc: ScheduleDay[], { day, time, title }) => {
      let dayEntry = acc.find((d) => d.day === day);
      if (!dayEntry) {
        dayEntry = { day, events: [] };
        acc.push(dayEntry);
      }
      dayEntry.events.push({ time, title });
      return acc;
    },
    []
  ) || []; // Ensure we return an empty array if scheduleData is undefined

  console.log(scheduleDataUpdated, "Schedule Data Updated");

  return (
    <SchedulePage
      userName={user.user_metadata.fullName} // Fixed the typo here
      scheduleData={scheduleDataUpdated}
    />
  );
}
