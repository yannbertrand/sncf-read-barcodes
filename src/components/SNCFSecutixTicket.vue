<template>
  <h3 class="title">Ticket</h3>
  <table class="info">
    <thead>
      <tr>
        <th>Date</th>
        <td>{{ ticket.info.travelDate }}</td>
      </tr>
    </thead>
    <tbody class="trip">
      <tr>
        <td colspan="2">
          {{ getStation(ticket.info.departureStation) }}
        </td>
      </tr>
      <tr>
        <td colspan="2">↓</td>
      </tr>
      <tr>
        <td colspan="2">{{ getStation(ticket.info.arrivalStation) }}</td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <th>Prénom</th>
        <td>{{ ticket.info.travellerFirstName }}</td>
      </tr>
      <tr>
        <th>Nom</th>
        <td>{{ ticket.info.travellerLastName }}</td>
      </tr>
      <tr>
        <th>Classe</th>
        <td>{{ ticket.info.class }}</td>
      </tr>
      <!-- <tr>
        <th>n° train</th>
        <td>{{ ticket.info.train }}</td>
      </tr> -->
      <tr>
        <th>n° eTicket</th>
        <td>{{ ticket.info.ticketNumber }}</td>
      </tr>
    </tfoot>
  </table>
  <img class="code" :src="ticket.imgSrcValue" alt="" />
</template>

<script setup lang="ts">
import { getStation } from "../services/domain/stations";
import type { SNCFSecutixTicketInfo } from "../services/domain/ticket-info";

defineProps<{
	ticket: SNCFSecutixTicketInfo;
}>();
</script>

<style scoped>
.title {
  margin: 0;
}
.info th {
  text-align: right;
}
.info td {
  text-align: left;
}
.info .trip td {
  text-align: center;
}
.code {
  margin: auto;
  width: 100%;
}
</style>
