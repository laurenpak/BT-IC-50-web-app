import { parse } from "csv-parse";
import fs from "node:fs";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";

function formatSchedule(row: any, userId: string) {
  const schedule: any = {};

  for (const [key, value] of Object.entries(row)) {
    if (
      key.includes("Monday") ||
      key.includes("Tuesday") ||
      key.includes("Wednesday") ||
      key.includes("Thursday") ||
      key.includes("Friday") ||
      key.includes("Saturday") ||
      key.includes("Sunday")
    ) {
      const [day, time] = key.split(", ");
      console.log(time, "Day, Time, Value");
      if (!schedule[day]) schedule[day] = [];

      schedule[day].push({
        time: time?.trim(),
        title: value?.trim(),
        day: day,
        user_id: userId,
      });
    }
  }

  // Convert the schedule object to an array
  return Object.entries(schedule).map(([date, events]) => ({
    // date,
    events,
  }));
}

fs.createReadStream(process.cwd() + "/scripts/IC50 Temp Sem ASSIGNMENTS.csv")
  .pipe(parse({ delimiter: ",", columns: true }))
  .on("data", async function (row) {
    // console.log(row);

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

    const { data: scheduleData } = await supabase
      .from("schedules")
      .insert(schedule.flatMap((sc) => sc.events))
      .select("*");

    console.log(scheduleData, "Schedule Data");

    setTimeout(() => {
      console.log("Data Feeded");
    }, 3500);
  });
