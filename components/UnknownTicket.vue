<template>
  <h3 class="title">Format inconnu</h3>
  <code class="content">
    {{ ticket.info.content }}
  </code>
  <img class="code" :src="ticket.imgSrcValue" alt="" />
</template>

<script setup lang="ts">
import { UnknownTicketInfo } from '../services/domain/ticket-info';

const { ticket } = defineProps<{
  ticket: UnknownTicketInfo;
}>();
</script>

<style scoped>
.title {
  margin: 0;
}
.content {
  background: #ddd;
  border: 1px solid black;
  padding: 4px;
  word-break: break-all;
}
.code {
  margin: auto;
  width: 100%;
}
</style>
