import type { TicketInfo } from "@/services/domain/ticket-info";

// See https://community.kde.org/KDE_PIM/KItinerary/SNCF_Barcodes
const getSNCFTicketInfo = (str: string[130]): SNCFTicket => {
	const ticketInfo: SNCFTicket = {
		type: "sncf",
		header: str.slice(0, 4),
		passengerNameRecord: str.slice(4, 10),
		eTicketNumber: str.slice(10, 19),
		constant: str.slice(19, 23),
		travellerBirthDate: str.slice(23, 33),
		departureStationFirstLeg: str.slice(33, 38),
		arrivalStationFirstLeg: str.slice(38, 43),
		trainNumberFirstLeg: str.slice(43, 48),
		travelDate: str.slice(48, 53),
		clientId: str.slice(53, 83),
		travellerLastName: str.slice(83, 100).trim(),
		travellerFirstName: str.slice(100, 110).trim(),
		classFirstLeg: str.slice(110, 111),
		tariff: str.slice(111, 116),
	};

	const ending = str.slice(116, 130);
	if (ending.replaceAll("0", "").trim().length > 0) {
		ticketInfo.departureStationSecondLeg = str.slice(116, 121);
		ticketInfo.arrivalStationSecondLeg = str.slice(121, 126);
		ticketInfo.trainNumberSecondLeg = str.slice(126, 131);
	}

	return ticketInfo;
};

const getSecutixTicketInfo = (str: string): SNCFSecutixTicket => {
	const ticketInfo: SNCFSecutixTicket = {
		type: "secutix",
		eTicketNumber: str.slice(4, 260),
		header: str.slice(0, 4),
		signature: str.slice(4, 260),
		constant1: str.slice(260, 264),
		uicIssuer: str.slice(264, 268),
		ticketNumber: str.slice(268, 277),
		departureStation: str.slice(277, 282),
		arrivalStation: str.slice(282, 287),
		station: str.slice(287, 292).trim(),
		constant2: str.slice(342, 343),
		travelDate: str.slice(343, 351),
		class: str.slice(351, 352),
		tariff: str.slice(352, 356),
		tariffDetail: str.slice(356, 376).trim(),
		travellerLastName: str.slice(376, 395).trim(),
		travellerFirstName: str.slice(395, 414).trim(),
		travellerBirthDate: str.slice(414, 422),
		travellerType1: str.slice(422, 432).trim(),
		travellerTypeQuantity1: str.slice(432, 434),
		travellerType2: str.slice(434, 444).trim(),
		travellerTypeQuantity2: str.slice(444, 446),
		travelDate1: str.slice(446, 454),
		travelDate2: str.slice(454, 462),
		constant3: str.slice(462, 474),
		purshaseDateTime: str.slice(474, 486),
		price: str.slice(486, 496),
		freeText: str.slice(496, 686).trim(),
	};

	return ticketInfo;
};

export interface SNCFTicket {
	type: "sncf";
	header: string[4];
	passengerNameRecord: string[6];
	eTicketNumber: string[9];
	constant: string[4];
	travellerBirthDate: string[10];
	departureStationFirstLeg: string[5];
	arrivalStationFirstLeg: string[5];
	trainNumberFirstLeg: string[5];
	departureStationSecondLeg?: string[5];
	arrivalStationSecondLeg?: string[5];
	trainNumberSecondLeg?: string[5];
	travelDate: string[5];
	clientId: string[30];
	travellerLastName: string;
	travellerFirstName: string;
	classFirstLeg: string;
	tariff: string;
}

export interface SNCFSecutixTicket {
	type: "secutix";
	eTicketNumber: string;
	header: string;
	signature: string;
	constant1: string;
	uicIssuer: string;
	ticketNumber: string;
	departureStation: string;
	arrivalStation: string;
	station: string;
	constant2: string;
	travelDate: string;
	class: string;
	tariff: string;
	tariffDetail: string;
	travellerLastName: string;
	travellerFirstName: string;
	travellerBirthDate: string;
	travellerType1: string;
	travellerTypeQuantity1: string;
	travellerType2: string;
	travellerTypeQuantity2: string;
	travelDate1: string;
	travelDate2: string;
	constant3: string;
	purshaseDateTime: string;
	price: string;
	freeText: string;
}

export interface UnknownTicket {
	type: "unknown";
	eTicketNumber: string;
	content: string;
}

const getInfoFromZxing = (
	str: string,
): SNCFTicket | SNCFSecutixTicket | UnknownTicket => {
	if (
		(str.startsWith("i0CV") || str.startsWith("i1CV")) &&
		str.length === 131
	) {
		return getSNCFTicketInfo(str);
	}
	if (str.startsWith("2200")) {
		const secutixInfo = `2200${" ".repeat(256)}${str.slice(str.indexOf("00T1"))}`;
		return getSecutixTicketInfo(secutixInfo);
	}

	return {
		type: "unknown",
		eTicketNumber: `${Math.ceil(Math.random() * 1000000)}`,
		content: str,
	};
};

export function getInfoFromZxingResult(
	zxingResult: string,
	file: File,
): TicketInfo {
	return {
		info: getInfoFromZxing(zxingResult),
		imgSrcValue: URL.createObjectURL(file),
	};
}
