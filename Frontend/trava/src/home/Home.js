import React from "react";
import ImageBanner from "./homeComponent/ImageBanner";
import ExploreComponent from "./homeComponent/ExploreComponent";
import UsertripThreads from "./homeComponent/UsertripThreads";

const Home = () => {

  return (
    <div className="flex flex-col items-center space-y-6">
        <ImageBanner/>
        <UsertripThreads/>
        <ExploreComponent/>
    </div>
  );
};

export default Home;