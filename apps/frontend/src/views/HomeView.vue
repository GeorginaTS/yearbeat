<template>
  <section class="relative min-h-screen overflow-hidden px-6 pb-16 pt-8">
    <span class="neon-note left-[10%] top-[8%] text-5xl">♪</span>
    <span
      class="neon-note right-[14%] top-[10%] text-6xl"
      style="animation-delay: 0.8s"
      >♫</span
    >
    <span
      class="neon-note left-[12%] top-[28%] text-4xl"
      style="animation-delay: 1.6s"
      >♪</span
    >
    <span
      class="neon-note right-[8%] top-[32%] text-5xl"
      style="animation-delay: 2.4s"
      >♫</span
    >
    <span
      class="neon-note left-[18%] top-[48%] text-3xl"
      style="animation-delay: 1.1s"
      >♬</span
    >
    <span
      class="neon-note right-[16%] top-[52%] text-4xl"
      style="animation-delay: 2s"
      >♪</span
    >

    <!-- Info usuari (cantonada superior dreta, només si autenticat) -->
    <div v-if="authStore.isAuthenticated" class="absolute right-4 top-4">
      <UserInfo :name="currentPlayerName" @sign-out="authStore.signOut" />
    </div>

    <div class="mx-auto max-w-md">
      <!-- Capçalera -->
      <AppBrand />

      <!-- PANTALLA LOGIN -->
      <template v-if="!authStore.isAuthenticated">
        <div class="mt-16 game-card p-8 space-y-4">
          <p class="text-center text-lg font-semibold text-white/80">
            Inicia sessió per jugar
          </p>
          <button
            class="primary-pill !w-full py-4 text-lg"
            @click="signInGoogle"
          >
            <span class="mr-2">G</span> Entrar amb Google
          </button>
          <!-- <button class="secondary-pill !w-full py-4 text-lg" @click="signInFacebook">
            <span class="mr-2">f</span> Entrar amb Facebook
          </button> -->
        </div>
      </template>

      <!-- PANTALLA LOBBY -->
      <template v-else>
        <div
          class="mt-10 text-center text-sm font-semibold uppercase tracking-[0.24em] text-game-muted"
        >
          Codi de sala
        </div>
        <div class="mt-6">
          <RoomCode v-model="roomCode" />
        </div>
        <button
          class="secondary-pill mt-8 text-2xl max-sm:text-xl"
          @click="joinGame"
        >
          ⇢ Unir-se a partida
        </button>

        <div
          class="glow-divider mt-10 text-center text-2xl font-bold text-white/70"
        >
          O
        </div>

        <button
          class="primary-pill mt-16 text-2xl max-sm:text-xl"
          @click="createGame"
        >
          ⊕ Crear partida
        </button>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import type {
  CreateGameResponse,
  JoinGameResponse,
} from "@yearbeat/shared-types";
import RoomCode from "../components/lobby/RoomCode.vue";
import UserInfo from "../components/shared/UserInfo.vue";
import AppBrand from "../components/shared/AppBrand.vue";
import { usePlayerStore } from "../stores/playerStore";
import { useGameStore } from "../stores/gameStore";
import { useSocket } from "../composables/useSocket";
import { useAuthStore } from "../stores/authStore";

const API = `${import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"}/api`;
const router = useRouter();
const playerStore = usePlayerStore();
const gameStore = useGameStore();
const socketStore = useSocket();
const authStore = useAuthStore();

const roomCode = ref("AB00");
const currentPlayerName = computed(() => authStore.user?.name || "");

async function signInGoogle() {
  try {
    await authStore.signInWithGoogle();
  } catch {
    window.alert("No s'ha pogut iniciar sessió amb Google");
  }
}

async function signInFacebook() {
  try {
    await authStore.signInWithFacebook();
  } catch {
    window.alert("No s'ha pogut iniciar sessió amb Facebook");
  }
}

async function createGame() {
  if (!authStore.user) {
    window.alert("Inicia sessió amb Google o Facebook");
    return;
  }

  const token = await authStore.getAccessToken();
  if (!token) {
    window.alert("Sessió invàlida. Torna a iniciar sessió.");
    return;
  }

  const response = await fetch(`${API}/games/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  });

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as {
      message?: string;
    };
    window.alert(errorData.message || "No s'ha pogut crear la partida");
    return;
  }

  const data = (await response.json()) as CreateGameResponse;
  playerStore.setPlayer({
    id: data.player.id,
    name: data.player.name,
    totalScore: data.player.totalScore,
  });
  gameStore.setGame(data.game);
  socketStore.emit("game:join", {
    code: data.game.code,
    playerName: data.player.name,
  });
  router.push(`/lobby/${data.game.code}`);
}

async function joinGame() {
  if (!authStore.user) {
    window.alert("Inicia sessió amb Google o Facebook");
    return;
  }

  const token = await authStore.getAccessToken();
  if (!token) {
    window.alert("Sessió invàlida. Torna a iniciar sessió.");
    return;
  }

  const response = await fetch(`${API}/games/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ code: roomCode.value }),
  });

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as {
      message?: string;
    };
    window.alert(errorData.message || "No s'ha pogut unir a la partida");
    return;
  }

  const data = (await response.json()) as JoinGameResponse;
  playerStore.setPlayer({
    id: data.player.id,
    name: data.player.name,
    totalScore: data.player.totalScore,
  });
  gameStore.setGame(data.game);
  socketStore.emit("game:join", {
    code: data.game.code,
    playerName: data.player.name,
  });
  router.push(`/lobby/${data.game.code}`);
}
</script>
