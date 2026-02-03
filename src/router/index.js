import { createRouter, createWebHistory } from "vue-router";
import StartPage from "@/components/StartPage.vue";
import InstructionPage from "@/components/InstructionPage.vue";
import GamePage from "@/components/GamePage.vue";
import FinishPage from "@/components/FinishPage.vue";
import TryAgainPage from "@/components/TryAgainPage.vue";
import GameOverPage from "@/components/GameOverPage.vue";

const routes = [
  {
    path: "/",
    name: "Start",
    component: StartPage,
  },
  {
    path: "/instruction",
    name: "Instruction",
    component: InstructionPage,
  },
  {
    path: "/game",
    name: "Game",
    component: GamePage,
  },
  {
    path: "/finish",
    name: "Finish",
    component: FinishPage,
  },
  {
    path: "/tryagain",
    name: "TryAgain",
    component: TryAgainPage,
  },
  {
    path: "/gameover",
    name: "GameOver",
    component: GameOverPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
