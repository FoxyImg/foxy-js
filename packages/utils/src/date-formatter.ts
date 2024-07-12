//@ts-ignore
import humanizeDuration from "humanize-duration";

export function durationFormat(
	dateStr: string | Date,
	suffix: string = " ago",
	force: boolean = false,
	lowerCase: boolean = false,
	alwaysHumanize: boolean = false,
	showSeconds: boolean = false
): string {
	if ((typeof dateStr == "string") && (!dateStr || dateStr.length === 0)) {
		return "";
	}

	const date = (typeof dateStr == "string") ? new Date(dateStr) : dateStr;
	const time = Math.abs((Date.now() - date.getTime()) / 1000);

	let result = "";

	if (time < 60) {
		if (showSeconds) {
			result = Math.floor(time) + "s";
		} else {
			result = "Moments" + suffix;
		}
	} else {
		const monthAgo = new Date();
		monthAgo.setMonth(monthAgo.getMonth() - 1);

		if (!force && date.getTime() <= monthAgo.getTime() && !alwaysHumanize) {
			return Intl.DateTimeFormat("en-US", {
				year: "numeric",
				month: "numeric",
				day: "numeric",
				hour: "numeric",
				minute: "numeric",
			}).format(date);
		}

		result = humanizeDuration(date.getTime() - Date.now(), { largest: 1, round: true }) + suffix;
	}

	if (lowerCase) {
		return result.toLowerCase();
	}

	return result;
}

export function dateFormat(dateStr: string|Date) {
	const date = (typeof dateStr == "string") ? new Date(dateStr) : dateStr;
	return Intl.DateTimeFormat("en-US").format(date);
}

function longDateFormat(dateStr: string|Date, showWeekday: boolean = false) {
	const date = (typeof dateStr == "string") ? new Date(dateStr) : dateStr;

	const options = showWeekday
		? {
			year: "numeric",
			month: "long",
			day: "numeric",
			weekday: "long",
		}
		: {
			year: "numeric",
			month: "long",
			day: "numeric",
		};

	return Intl.DateTimeFormat("en-US", <any>options).format(date);
}

export function longDateTimeFormat(dateStr: string|Date) {
	const date = (typeof dateStr == "string") ? new Date(dateStr) : dateStr;
	return Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
	}).format(date);
}

export function dateTimeFormat(dateStr: string|Date) {
	const date = (typeof dateStr == "string") ? new Date(dateStr) : dateStr;
	return Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "numeric",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
	}).format(date);
}

export function shortDateTimeFormat(dateStr: string | Date) {
	const date = (typeof dateStr == "string") ? new Date(dateStr) : dateStr;

	return Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "numeric",
		day: "numeric",
	}).format(date);
}
