import { parse } from "csv-parse";
import fs from "node:fs";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";

interface Row {
  [key: string]: string | undefined;
}

interface ScheduleEntry {
  time: string;
  title: string;
  day: string;
  user_id: string;
}

function formatSchedule(row: Row, userId: string): { events: ScheduleEntry[] }[] {
  const schedule: { [key: string]: ScheduleEntry[] } = {};

  for (const [key, value] of Object.entries(row)) {
    if (key.match(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/)) {
      const [day, time] = key.split(", ");
      if (!schedule[day]) schedule[day] = [];

      schedule[day].push({
        time: time?.trim() || '',
        title: (value as string)?.trim() || '',
        day: day,
        user_id: userId,
      });
    }
  }

  return Object.entries(schedule).map(([date, events]) => ({
    events,
  }));
}

async function processRow(row: Row) {
  const supabase = createClient("supabaseUrl", "supabaseKey");

  const firstName = row["First Name"];
  const lastName = row["Last Name"];

  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("username", `${firstName} ${lastName}`)
    .single();

  let userId;

  if (data) {
    userId = data.id;
  } else {
    const { data, error } = await supabase.auth.signUp({
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      password: "12345678",
      options: {
        data: {
          fullName: `${firstName} ${lastName}`,
        },
      },
    });

    if (error) {
      console.error(error);
      return;
    }

    userId = data.user?.id;
  }

  const schedule = formatSchedule(row, userId);

  const { data: scheduleData, error: insertError } = await supabase
    .from("schedules")
    .insert(schedule.flatMap((sc) => sc.events))
    .select("*");

  if (insertError) {
    console.error(insertError);
    return;
  }

  console.log(scheduleData, "Schedule Data");
}

fs.createReadStream(process.cwd() + "/scripts/IC50 Temp Sem ASSIGNMENTS.csv")
  .pipe(parse({ delimiter: ",", columns: true }))
  .on("data", processRow)
  .on("end", () => {
    console.log("CSV file successfully processed.");
  });
