import Icons from "views/Icons.js";
import MainSearch from "views/MainSearch";
import ICDSearch from "views/ICDSearch";
import PreQueue from "views/PreQueue";
import Train from "views/Train";

const dashboardRoutes = [
  {
    path: "train",
    name: "Train",
    icon: "nc-icon nc-chart-pie-35",
    component: Train,
    layout: "/admin",
  },
  {
    path: "main-search",
    name: "Claims",
    icon: "nc-icon nc-notes",
    component: MainSearch,
    layout: "/admin",
  },
  {
    path: "icd-search",
    name: "ICD Data",
    icon: "nc-icon nc-notes",
    component: ICDSearch,
    layout: "/admin",
  },
  {
    path: "pre-queue",
    name: "My Queue",
    icon: "nc-icon nc-notes",
    component: PreQueue,
    layout: "/admin",
  },
  {
    path: "dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-atom",
    component: Icons,
    layout: "/admin",
  },
];

export default dashboardRoutes;
