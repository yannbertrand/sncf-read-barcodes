import { UnknownTicket } from '~~/.nuxt/components';
import {
  SNCFTicket,
  SNCFSecutixTicket,
  UnknownTicket,
} from '../infrastructure/low-level/get-info-from-zxing-result';

export interface TicketInfo {
  info: SNCFTicket | UnknownTicket;
  imgSrcValue: string;
}

export interface SNCFTicketInfo extends TicketInfo {
  info: SNCFTicket;
}

export interface SNCFSecutixTicketInfo extends TicketInfo {
  info: SNCFSecutixTicket;
}

export interface UnknownTicketInfo extends TicketInfo {
  info: UnknownTicket;
}

export interface SNCFTicket {}
export interface UnknownTicket {}
