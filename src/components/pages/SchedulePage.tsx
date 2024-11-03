"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

// const scheduleData = [
//   {
//     date: "Friday, November 8",
//     events: [
//       { time: "8:30 - 9:30", title: "Keynote # Text Here" },
//       {
//         time: "9:45 - 10:45",
//         title: "Session 1: Webdisney: Teaching Zack to Thiel",
//       },
//       { time: "11:00 - 12:00", title: "Session 2: Customer Engagement" },
//       { time: "12:00 - 1:00", title: "Lunch" },
//       { time: "1:00 - 2:00", title: "Session 2: Text Here" },
//       { time: "2:00 - 2:15", title: "Coffee" },
//       { time: "2:15 - 4:15", title: "Session 3:" },
//     ],
//   },
//   {
//     date: "Saturday, November 9",
//     events: [
//       { time: "8:30 - 9:30", title: "Keynote # Text Here" },
//       {
//         time: "9:45 - 10:45",
//         title: "Session 1: Webdisney: Teaching Zack to Thiel",
//       },
//       { time: "11:00 - 12:00", title: "Session 2: Customer Engagement" },
//       { time: "12:00 - 1:00", title: "Lunch" },
//       { time: "1:00 - 2:00", title: "Session 2: Text Here" },
//       { time: "2:00 - 2:15", title: "Coffee" },
//       { time: "2:15 - 4:15", title: "Session 3:" },
//     ],
//   },
//   {
//     date: "Sunday, November 10",
//     events: [
//       { time: "8:30 - 9:30", title: "Keynote # Text Here" },
//       {
//         time: "9:45 - 10:45",
//         title: "Session 1: Webdisney: Teaching Zack to Thiel",
//       },
//       { time: "11:00 - 12:00", title: "Session 2: Customer Engagement" },
//       { time: "12:00 - 1:00", title: "Lunch" },
//       { time: "1:00 - 2:00", title: "Session 2: Text Here" },
//       { time: "2:00 - 2:15", title: "Coffee" },
//       { time: "2:15 - 4:15", title: "Session 3:" },
//     ],
//   },
// ];

interface SchedulePageProps {
  userMame?: string;
  scheduleData?: any;
}

export default function SchedulePage({
  userMame,
  scheduleData,
}: SchedulePageProps) {
  const [username] = useState(userMame ?? "John Doe"); // Replace with actual user data

  const supabase = createClient();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f9f7f4]">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Image
              src="/logo.png"
              alt="Logo"
              width={48}
              height={48}
              className="h-8 w-auto mr-4 "
            />
            <h1 className="text-2xl font-bold text-[#17607b]">
              {username} Conference Schedule
            </h1>
          </div>
          <div className="flex items-center">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5 text-[#17607b]" />
            </Button>
            <span className="ml-4 text-sm font-medium text-[#17607b]">
              {username}
            </span>
            <Button
              variant={"destructive"}
              className="ml-3"
              onClick={async () => {
                await supabase.auth.signOut();
                router.push("/login");
              }}
            >
              <span className="text-sm font-medium">Log Out</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[95vh]">
        {scheduleData?.length > 0 &&
          scheduleData?.map((day, index) => (
            <Card
              key={index}
              className="mb-8 bg-white shadow-md rounded-lg overflow-hidden"
            >
              <CardHeader className="bg-[#17607b] text-white p-4">
                <h2 className="text-xl font-semibold">{day?.day}</h2>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full">
                  <tbody>
                    {day?.events?.map((event, eventIndex) => (
                      <tr key={eventIndex} className="border-b last:border-b-0">
                        <td className="py-3 px-4 align-top w-[30%] ">
                          <span className="text-sm font-medium text-[#17607b]">
                            {event.time}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-800">
                            {event.title}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          ))}

        {scheduleData?.length === 0 && (
          <div className="min-h-[85vh]">
            <div className="bg-white shadow-md rounded-lg p-8 text-center">
              <h2 className="text-xl font-semibold text-[#17607b]">
                No events scheduled
              </h2>
            </div>
          </div>
        )}
      </main>
      <footer className="bg-white border-t mt-8  w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-sm text-[#17607b]">
          <p>
            *Disclaimer: This is a personalized schedule of all the events that
            YOU signed up for.
          </p>
          <p>
            It is YOUR responsibility to check in and attend your events for
            attendance reasons.
          </p>
        </div>
      </footer>
    </div>
  );
}
