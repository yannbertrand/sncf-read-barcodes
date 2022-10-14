<template>
  <article class="ticket">
    <SNCFTicket v-if="ticket.info.type === 'sncf'" :ticket="ticket" />
    <SNCFSecutixTicket v-if="ticket.info.type === 'secutix'" :ticket="ticket" />
    <UnknownTicket v-if="ticket.info.type === 'unknown'" :ticket="ticket" />
  </article>
</template>

<script setup lang="ts">
import { TicketInfo } from '../services/domain/ticket-info';

const { ticket } = defineProps<{
  ticket: TicketInfo;
}>();
</script>

<style scoped>
.ticket {
  padding: 16px;
  margin: 8px;
  box-shadow: 0px 3px 5px silver;
  font-family: Courier, monospace;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  width: 200px;
  background: #f9c0c3;
}
</style>
