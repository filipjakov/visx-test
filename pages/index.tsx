import type { NextPage } from "next";
import { Chart } from "../components/MainChart";

const Home: NextPage = () => {
  return <Chart width={500} height={500} />;
};

export default Home;
