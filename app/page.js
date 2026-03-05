"use client";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";

export default function Page() {
  const [rides, setRides] = useState([]);
  const [error, setError] = useState(null);
  const [filterByLand, setFilterByLand] = useState("");

  async function fetchRides() {
    try {
      const response = await fetch("/api/queue"); //go get me the cheesies
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json(); //when you come back with the cheesies, put them in a bowl for me
      //console.log(data.lands[1].rides);
      setRides(data.lands);
    } catch (error) {
      setError(error.message);
    }
  }

  useEffect(() => {
    fetchRides();
  }, []);
  if (error) {
    //if error is not null then return:
    return (
      <div className="bg-red-500 flex justify-center items-center p-8">
        <h2>ERROR!</h2>
        <p>{error}</p>
        <Link href="/">Home</Link>
      </div>
    );
  }
  //display list of all rides, offer buttons to sort and show by land
  const displayedLands =
    filterByLand === ""
      ? rides
      : rides.filter((land) => land.name === filterByLand);

  return (
    <main className="flex flex-col justify-center items-center">
      <header className="py-10 text-3xl font-bold text-pink-600">
        <h1>Disneyland Paris Wait Times</h1>
      </header>
      <div className="flex flex-col items-center">
        <div className="font-semibold pb-2">Filter By Land:</div>
        <select
          value={filterByLand}
          onChange={(e) => setFilterByLand(e.target.value)}
          className="border p-1 mb-4"
        >
          <option value="">All</option>
          {rides.map((land) => (
            <option key={land.id} value={land.name}>
              {land.name}
            </option>
          ))}
        </select>
      </div>
      <div className="w-150 m-5 px-8 py-5 rounded-2xl bg-linear-to-r from-violet-200 to-pink-200">
        {displayedLands.map((land) => (
          <div key={land.id}>
            <div className="flex flex-row items-center">
              <Icon
                icon="arcticons:disneyland"
                className="text-5xl px-2 text-pink-700"
              />
              <h3 className="text-2xl font-semibold text-purple-700">
                {land.name}
              </h3>
            </div>
            <div className="pb-4">
              <ul className="p-4 list-disc dark:text-black">
                {land.rides.map((ride) => (
                  <li key={ride.id} className="p-1">
                    {ride.name} -{" "}
                    {ride.wait_time === 0
                      ? "Closed"
                      : `${ride.wait_time} minutes`}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      <footer className="font-medium m-5 pb-4">
        <Link href="https://queue-times.com/" className="hover:underline">
          Powered by Queue-Times.com
        </Link>
      </footer>
    </main>
  );
}
