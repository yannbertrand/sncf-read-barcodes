<template>
  <main>
    <h1>Lire les infos d'un billet SNCF</h1>
    <p>
      Uploader un billet SNCF ou son QR Code. Seul le navigateur travaille, rien
      n'est envoyé sur un serveur.
    </p>
    <input type="file" id="file" @change="onFileChange" />
    <h2>{{ foundTickets }}</h2>
    <div class="tickets">
      <Ticket
        v-for="ticket in result.tickets"
        :ticket="ticket"
        :key="ticket.info.eTicketNumber"
      />
    </div>
  </main>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from "vue";
import Ticket from "./components/Ticket.vue";
import { findTicketsInfoFromFile } from "./services/domain/find-tickets-info-from-file";

export default defineComponent({
	setup() {
		const result = reactive({ tickets: [] });
		const onFileChange = async (event: Event) => {
			result.tickets = [];
			const file = event.target.files[0];
			console.log(`Looking for tickets in ${file.name}`);
			const tickets = await findTicketsInfoFromFile(file);
			console.log(`Found ${tickets.length} tickets`);
			tickets.map((t) => console.log(t));
			for (const ticket of tickets) {
				result.tickets.push(ticket);
			}
		};

		const foundTickets = computed(() => {
			return result.tickets.length > 0
				? `${result.tickets.length} tickets trouvés`
				: "Aucun code trouvé";
		});

		return { onFileChange, result, foundTickets };
	},
	components: {
		Ticket,
	},
});
</script>

<style scoped>
main {
  font-family: sans-serif;
}
.tickets {
  display: flex;
}
</style>