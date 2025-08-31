<template>
  <h3 class="title">Dossier {{ ticket.info.passengerNameRecord }}</h3>
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
          {{ getStation(ticket.info.departureStationFirstLeg) }}
        </td>
      </tr>
      <tr>
        <td colspan="2">↓</td>
      </tr>
      <tr>
        <td colspan="2">{{ getStation(ticket.info.arrivalStationFirstLeg) }}</td>
      </tr>
      <template
        v-if="
        ticket.info.departureStationSecondLeg &&
        ticket.info.arrivalStationSecondLeg
      "
      >
      <tr>
        <td colspan="2">•</td>
      </tr>
      <tr>
        <td colspan="2">
          {{ getStation(ticket.info.departureStationSecondLeg) }}
        </td>
      </tr>
      <tr>
        <td colspan="2">↓</td>
      </tr>
      <tr>
        <td colspan="2">
          {{ getStation(ticket.info.arrivalStationSecondLeg) }}
        </td>
      </tr>
      </template>
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
        <td>{{ ticket.info.classFirstLeg }}</td>
      </tr>
      <tr>
        <th>n° train</th>
        <td>{{ ticket.info.trainNumberFirstLeg }}</td>
      </tr>
      <tr v-if="ticket.info.trainNumberSecondLeg">
        <th>n° train 2</th>
        <td>{{ ticket.info.trainNumberSecondLeg }}</td>
      </tr>
      <tr>
        <th>n° eTicket</th>
        <td>{{ ticket.info.eTicketNumber }}</td>
      </tr>
    </tfoot>
  </table>
  <img class="code" :src="ticket.imgSrcValue" alt="" />
</template>

<script setup lang="ts">
import { getStation } from "../services/domain/stations";
import type { SNCFTicketInfo } from "../services/domain/ticket-info";

defineProps<{
	ticket: SNCFTicketInfo;
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
