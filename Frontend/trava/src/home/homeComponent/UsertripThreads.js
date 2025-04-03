import React from "react";
import UserTrip from "./UserTrip";
import UserThread from "./UserThread";

const UsertripThreads = () => {
  return (
    <div className="flex flex-col md:flex-row gap-6 w-[85%] justify-center items-start p-4">

     <UserTrip/>
    <UserThread/>
    </div>
  );
};

export default UsertripThreads;