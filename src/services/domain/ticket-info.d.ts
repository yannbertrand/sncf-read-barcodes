// import { UnknownTicket } from "~~/.nuxt/components";
import type {
	SNCFSecutixTicket,
	SNCFTicket,
	UnknownTicket,
} from "../infrastructure/low-level/get-info-from-zxing-result";

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

export type SNCFTicket = {};
export type UnknownTicket = {};
