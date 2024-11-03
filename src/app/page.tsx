import SchedulePage from "@/components/pages/SchedulePage";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  console.log(data, "Data");

  const { data: scheduleData } = await supabase
    .from("schedules")
    .select("*")
    .eq("user_id", data.user.id);

  console.log(scheduleData, "Schedule Data");

  const scheduleDataUpdated = scheduleData?.reduce(
    (acc, { day, time, title }) => {
      let dayUp = acc.find((d: any) => d.day === day);
      if (!dayUp) {
        dayUp = { day, events: [] };
        acc.push(dayUp);
      }
      dayUp.events.push({ time, title });
      return acc;
    },
    []
  );

  console.log(scheduleDataUpdated, "Schedule Data Updated");

  return (
    <SchedulePage
      userMame={data?.user?.user_metadata?.fullName}
      scheduleData={scheduleDataUpdated}
    />
  );
}
